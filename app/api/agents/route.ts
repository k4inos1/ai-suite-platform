import { NextResponse } from 'next/server'

const DEFAULT_AGENT_ID = 'instagram_copywriter'
const AGENTS = {
  instagram_copywriter: {
    name: 'Instagram Copywriter',
    description: 'Especialista en redactar posts virales, enganches, llamadas a la acción (CTA) y hashtags.',
  },
  seo_writer: {
    name: 'Redactor SEO',
    description: 'Redactor experto en estructurar artículos de blog optimizados para posicionamiento orgánico en buscadores.',
  },
  email_marketer: {
    name: 'Email Marketer',
    description: 'Diseñador de secuencias de correos persuasivos para convertir suscriptores en clientes.',
  },
  ad_specialist: {
    name: 'Especialista en Ads',
    description: 'Creador de anuncios publicitarios de alta conversión para Facebook, Instagram y Google Ads.',
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
