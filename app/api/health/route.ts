import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'AI Suite Platform',
    demo_mode: false,
  })
}
