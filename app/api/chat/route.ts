import { NextResponse } from 'next/server'

// In-memory store for development (ponytail: keep it simple for now)
export const conversations = new Map<string, Array<{ role: string; content: string }>>()
export const conversationAgents = new Map<string, string>()

const DEFAULT_AGENT_ID = 'instagram_copywriter'
const AGENTS = {
  instagram_copywriter: {
    system_prompt: `Eres un experto copywriter especializado en Instagram llamado "Instagram Copywriter".
Tus características principales son:
- Redactar publicaciones dinámicas, enganchantes y preparadas para la conversión o viralización.
- Estructurar el copy con un gancho (hook) intrigante en la primera línea, cuerpo fácil de leer con emojis y espaciado claro, una Llamada a la Acción (CTA) evidente y hashtags relevantes de alto y mediano volumen.
- Adaptarte al tono solicitado (divertido, profesional, empático, autoritario).
- Ofrecer diferentes variaciones de enganches si el usuario te lo pide.`,
  },
  seo_writer: {
    system_prompt: `Eres un redactor especialista en SEO llamado "Redactor SEO".
Tus características principales son:
- Escribir artículos estructurados para optimizar el posicionamiento en buscadores (Google, etc.).
- Utilizar etiquetas semánticas claras (H1, H2, H3), mantener párrafos cortos y usar palabras clave de forma natural (evitando el keyword stuffing).
- Proporcionar siempre una meta-descripción atractiva que motive el clic (alto CTR) al inicio o al final del artículo.
- Diseñar la estructura antes de redactar si el usuario te lo solicita.`,
  },
  email_marketer: {
    system_prompt: `Eres un redactor persuasivo experto en Email Marketing llamado "Email Marketer".
Tus características principales son:
- Crear secuencias de emails persuasivas que no suenen a spam, usando fórmulas como AIDA (Atención, Interés, Deseo, Acción) o PAS (Problema, Agitación, Solución).
- Redactar líneas de asunto intrigantes y con alto porcentaje de apertura.
- Mantener un estilo conversacional y directo, facilitando que el usuario tome acción de compra o clic.`,
  },
  ad_specialist: {
    system_prompt: `Eres un especialista en anuncios digitales de alta conversión llamado "Especialista en Ads".
Tus características principales son:
- Redactar textos publicitarios específicos para Facebook/Instagram Ads y Google Ads.
- Crear copys cortos, medianos y largos orientados a superar objeciones y destacar la propuesta de valor del producto/servicio.
- Incluir variaciones de titulares atractivos y sugerencias de elementos visuales idóneos para el anuncio.`,
  },
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY environment variable is not set' },
      { status: 500 }
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { message, conversation_id, agent_id } = body
  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  const convId = conversation_id || `conv_${Date.now()}`
  let selectedAgentId = agent_id || DEFAULT_AGENT_ID

  // If conversation already exists and has an agent, keep using that agent
  if (conversationAgents.has(convId)) {
    selectedAgentId = conversationAgents.get(convId)!
  } else {
    conversationAgents.set(convId, selectedAgentId)
  }

  const agent = AGENTS[selectedAgentId as keyof typeof AGENTS] || AGENTS.nexus

  // Retrieve or initialize history
  if (!conversations.has(convId)) {
    conversations.set(convId, [])
  }
  const history = conversations.get(convId)!
  history.push({ role: 'user', content: message })

  // Keep last 10 messages for context
  const recentMessages = history.slice(-10)

  const messages = [
    { role: 'system', content: agent.system_prompt },
    ...recentMessages,
  ]

  try {
    const upstreamResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!upstreamResponse.ok) {
      const errText = await upstreamResponse.text()
      throw new Error(`OpenAI API returned status ${upstreamResponse.status}: ${errText}`)
    }

    const reader = upstreamResponse.body?.getReader()
    const decoder = new TextDecoder()
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = ''
        let buffer = ''

        try {
          while (true) {
            const { done, value } = await reader!.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
              const cleaned = line.trim()
              if (!cleaned) continue
              if (cleaned === 'data: [DONE]') continue

              if (cleaned.startsWith('data: ')) {
                try {
                  const data = JSON.parse(cleaned.slice(6))
                  const content = data.choices?.[0]?.delta?.content || ''
                  if (content) {
                    fullResponse += content
                    const payload = { type: 'text-delta', delta: content }
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
                  }
                } catch {
                  // Ignore invalid JSON lines
                }
              }
            }
          }

          // Save assistant response to conversation history
          history.push({ role: 'assistant', content: fullResponse })

          // Send done payload
          const donePayload = {
            type: 'done',
            conversation_id: convId,
            agent_id: selectedAgentId,
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(donePayload)}\n\n`))
          controller.close()
        } catch {
          const errPayload = { type: 'error', message: 'Error during streaming' }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(errPayload)}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
