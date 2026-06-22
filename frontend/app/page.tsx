"use client"

import { ChatContainer } from '@/components/chat'

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="border-b bg-background/80 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">AI Suite Platform</p>
            <h1 className="text-xl font-semibold text-foreground">
              Chat Asistido por Inteligencia Artificial
            </h1>
          </div>
        </div>
      </div>
      <main className="flex-1 overflow-hidden">
        <ChatContainer />
      </main>
    </div>
  )
}
