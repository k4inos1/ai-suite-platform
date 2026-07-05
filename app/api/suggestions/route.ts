import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    suggestions: [
      'Explícame cómo funciona la inteligencia artificial',
      'Ayúdame a escribir un correo profesional',
      'Escribe código Python para ordenar una lista',
      'Dame ideas para un proyecto de programación',
      'Resume este texto que te voy a compartir',
      'Traduce este párrafo al inglés',
    ],
  })
}
