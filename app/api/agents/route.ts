import { NextResponse } from 'next/server'

const DEFAULT_AGENT_ID = 'nexus'
const AGENTS = {
  nexus: {
    name: 'NexusAI',
    description: 'Asistente generalista para resolver dudas y tareas diarias.',
  },
  dev: {
    name: 'CodePilot',
    description: 'Mentor técnico para arquitectura, código y depuración.',
  },
  writer: {
    name: 'TextoPro',
    description: 'Especialista en redacción, tono y contenido profesional.',
  },
  analyst: {
    name: 'Insight',
    description: 'Analista para síntesis, planificación y descomposición de problemas.',
  },
}

export async function GET() {
  return NextResponse.json({
    default_agent_id: DEFAULT_AGENT_ID,
    demo_mode: false,
    agents: Object.entries(AGENTS).map(([id, config]) => ({
      id,
      name: config.name,
      description: config.description,
    })),
  })
}
