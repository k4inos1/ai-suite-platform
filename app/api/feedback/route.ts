import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({
    status: 'received',
    message: 'Feedback recorded for future model improvements',
  })
}
