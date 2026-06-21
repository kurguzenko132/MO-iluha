import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '100 комплиментов для Вики',
  description: 'Романтичное приложение с 100 комплиментами для Вики'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
