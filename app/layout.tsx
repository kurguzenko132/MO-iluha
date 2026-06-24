import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '5 комплиментов для Ильи',
  description: 'Небольшая страница с сюрпризом для Ильи.',
  openGraph: {
    title: '5 комплиментов для Ильи',
    description: 'Небольшая страница с сюрпризом для Ильи.',
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: '5 комплиментов для Ильи',
    description: 'Небольшая страница с сюрпризом для Ильи.'
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
