import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FitForge — Treino & Dieta com IA',
  description: 'Planos personalizados de treino e dieta gerados por inteligência artificial.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0, background: '#0a0a0f' }}>
        {children}
      </body>
    </html>
  )
}
