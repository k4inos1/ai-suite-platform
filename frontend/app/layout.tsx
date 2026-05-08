import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Suite Platform',
  description: 'Monorepo con chat asistido por IA y experiencia de recetas en una sola plataforma.',
  keywords: ['AI Suite Platform', 'chatbot', 'recipes', 'OpenAI', 'Python', 'FastAPI'],
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
            <nav className="flex gap-4">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Chatbot
              </Link>
              <Link href="/recetas" className="text-sm font-medium hover:text-primary transition-colors">
                Recetas AI
              </Link>
            </nav>
          </header>
          <main className="flex-1 overflow-hidden flex flex-col relative">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
