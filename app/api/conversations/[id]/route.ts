import { NextResponse } from 'next/server'
import { conversations, conversationAgents } from '../../chat/route'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const conversationId = params.id
  const history = conversations.get(conversationId)

  if (!history) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
  }

  const agentId = conversationAgents.get(conversationId) || 'nexus'

  return NextResponse.json({
    conversation_id: conversationId,
    agent_id: agentId,
    messages: history.map((msg, index) => ({
      id: `msg_${index}`,
      role: msg.role,
      content: msg.content,
      timestamp: new Date(),
    })),
  })
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const conversationId = params.id
  conversations.delete(conversationId)
  conversationAgents.delete(conversationId)
  return NextResponse.json({ status: 'deleted' })
}
