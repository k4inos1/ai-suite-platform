import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Suite Platform',
  description: 'Chat de inteligencia artificial inteligente y amigable con múltiples agentes.',
  keywords: ['AI Suite Platform', 'chatbot', 'OpenAI', 'Python', 'FastAPI'],
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' }
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <header className="flex h-14 items-center justify-between border-b px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              AI Suite Platform
            </div>
          </header>
          <main className="flex-1 overflow-hidden flex flex-col relative">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
