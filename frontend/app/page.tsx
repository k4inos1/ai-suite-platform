"use client"

import { useState } from 'react'
import { ChatContainer } from '@/components/chat'
import { RecipeSuite } from '@/components/recipe/recipe-suite'

export default function HomePage() {
  const [activeView, setActiveView] = useState<'chat' | 'recipes'>('chat')

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="border-b bg-background/80 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">AI Suite Platform</p>
            <h1 className="text-xl font-semibold text-foreground">
              Chat asistido + Recipe Studio en un solo monorepo
            </h1>
          </div>
          <div className="inline-flex rounded-full border bg-card p-1 text-sm">
            <button
              type="button"
              onClick={() => setActiveView('chat')}
              className={
                activeView === 'chat'
                  ? 'rounded-full bg-primary px-4 py-2 text-primary-foreground'
                  : 'rounded-full px-4 py-2 text-muted-foreground transition hover:text-foreground'
              }
            >
              AI Chat
            </button>
            <button
              type="button"
              onClick={() => setActiveView('recipes')}
              className={
                activeView === 'recipes'
                  ? 'rounded-full bg-primary px-4 py-2 text-primary-foreground'
                  : 'rounded-full px-4 py-2 text-muted-foreground transition hover:text-foreground'
              }
            >
              Recipes
            </button>
          </div>
        </div>
      </div>
      <main className="flex-1 overflow-hidden">
        {activeView === 'chat' ? <ChatContainer /> : <RecipeSuite />}
      </main>
    </div>
  )
}
