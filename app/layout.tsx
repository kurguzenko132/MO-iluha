import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Для Вики 💛',
  description: 'Маленькая личная страница, сделанная специально для тебя.',
  openGraph: {
    title: 'Для Вики 💛',
    description: 'Маленькая личная страница, сделанная специально для тебя.',
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: 'Для Вики 💛',
    description: 'Маленькая личная страница, сделанная специально для тебя.'
  },
  robots: {
    index: false,
    follow: false
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
