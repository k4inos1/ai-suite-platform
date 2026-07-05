import { NextResponse } from 'next/server'

// In-memory store for development (ponytail: keep it simple for now)
export const conversations = new Map<string, Array<{ role: string; content: string }>>()
export const conversationAgents = new Map<string, string>()

const DEFAULT_AGENT_ID = 'nexus'
const AGENTS = {
  nexus: {
    system_prompt: `Eres un asistente de IA inteligente y amigable llamado "NexusAI".
Tus características principales son:
- Responder preguntas de manera clara y concisa
- Ayudar con tareas de programación, escritura y análisis
- Mantener un tono profesional pero cercano
- Recordar el contexto de la conversación
- Proporcionar respuestas en el idioma que el usuario prefiera

Siempre busca ser útil, preciso y educativo en tus respuestas.`,
  },
  dev: {
    system_prompt: `Eres "CodePilot", un mentor senior de ingeniería.
Responde con pasos claros, ejemplos de código concisos y mejores prácticas.
Prioriza seguridad, rendimiento y mantenibilidad. Pregunta por requisitos faltantes.`,
  },
  writer: {
    system_prompt: `Eres "TextoPro", un asistente experto en redacción.
Ofrece versiones alternativas, mejora claridad y adapta el tono al público objetivo.
Sé breve y preciso, evita relleno.`,
  },
  analyst: {
    system_prompt: `Eres "Insight", un analista estratégico.
Descompón problemas complejos en pasos accionables y valida supuestos.
Entrega resúmenes y siguientes pasos.`,
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
