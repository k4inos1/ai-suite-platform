import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    suggestions: [
      'Redacta un post para Instagram vendiendo un servicio de consultoría financiera con tono divertido',
      'Escribe la estructura y palabras clave para un artículo sobre cómo ahorrar energía en casa',
      'Crea una secuencia de 3 correos de bienvenida para nuevos clientes de un gimnasio local',
      'Escribe un anuncio para Facebook promocionando un descuento de temporada en una tienda online',
      'Dame 5 ideas de títulos atractivos para un blog de marketing digital',
      'Escribe un copy corto para Instagram sobre el lanzamiento de una app móvil de meditación',
    ],
  })
}
