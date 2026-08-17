"use client"

import { Bot, Code, FileText, Languages, Lightbulb, Pencil, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void
  agentName?: string
  agentDescription?: string
  suggestions?: string[]
}

const suggestionTemplates = [
  {
    icon: Pencil,
    title: "Post de Instagram",
    defaultPrompt: "Redacta un post para Instagram vendiendo un servicio de consultoría financiera con tono divertido",
    color: "text-blue-500"
  },
  {
    icon: FileText,
    title: "Artículo SEO",
    defaultPrompt: "Escribe la estructura y palabras clave para un artículo sobre cómo ahorrar energía en casa",
    color: "text-green-500"
  },
  {
    icon: Lightbulb,
    title: "Emails de Venta",
    defaultPrompt: "Crea una secuencia de 3 correos de bienvenida para nuevos clientes de un gimnasio local",
    color: "text-yellow-500"
  },
  {
    icon: Zap,
    title: "Anuncios Publicitarios",
    defaultPrompt: "Escribe un anuncio para Facebook promocionando un descuento de temporada en una tienda online",
    color: "text-purple-500"
  },
  {
    icon: Pencil,
    title: "Ideas para Blogs",
    defaultPrompt: "Dame 5 ideas de títulos atractivos para un blog de marketing digital",
    color: "text-pink-500"
  },
  {
    icon: Bot,
    title: "Copys Cortos",
    defaultPrompt: "Escribe un copy corto para Instagram sobre el lanzamiento de una app móvil de meditación",
    color: "text-orange-500"
  }
]

export function WelcomeScreen({
  onSuggestionClick,
  agentName,
  agentDescription,
  suggestions,
}: WelcomeScreenProps) {
  const promptList =
    suggestions && suggestions.length > 0
      ? suggestions
      : suggestionTemplates.map(item => item.defaultPrompt)

  if (promptList.length > suggestionTemplates.length) {
    console.warn('Se recibieron más sugerencias de las que se pueden mostrar.')
  }

  const normalizedPrompts = promptList.slice(0, suggestionTemplates.length)
  const suggestionCards = normalizedPrompts.map((prompt, index) => {
    const template = suggestionTemplates[index % suggestionTemplates.length]
    return {
      icon: template.icon,
      title: template.title,
      color: template.color,
      prompt,
    }
  })

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 py-12">
      {/* Logo and Title */}
      <div className="flex flex-col items-center mb-12">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Bot className="w-10 h-10 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-4 border-background" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-2 text-balance text-center">
          Creador de Contenido Inteligente
        </h1>
        <p className="text-muted-foreground text-center max-w-md text-pretty">
          Plataforma de asistencia con agentes especializados en Marketing, Copys, SEO y Publicidad para PYMES.
        </p>
        {agentName && (
          <div className="mt-3 text-center">
            <p className="text-sm font-medium text-foreground">Agente: {agentName}</p>
            {agentDescription && (
              <p className="text-xs text-muted-foreground">{agentDescription}</p>
            )}
          </div>
        )}
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-3xl">
        {suggestionCards.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.prompt)}
            className={cn(
              "flex items-start gap-3 p-4 rounded-xl text-left",
              "bg-card border border-border",
              "hover:bg-secondary/50 hover:border-primary/30",
              "transition-all duration-200",
              "group"
            )}
          >
            <suggestion.icon className={cn(
              "w-5 h-5 flex-shrink-0 mt-0.5",
              suggestion.color,
              "group-hover:scale-110 transition-transform"
            )} />
            <div>
              <p className="font-medium text-foreground text-sm">
                {suggestion.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {suggestion.prompt}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Features */}
      <div className="flex flex-wrap justify-center gap-4 mt-12 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          Respuestas en tiempo real
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          Memoria de conversación
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          Múltiples idiomas
        </div>
      </div>
    </div>
  )
}
