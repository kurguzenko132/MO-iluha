'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const isPublic = pathname === '/intro' || pathname === '/login' || pathname === '/'
    if (isPublic) {
      setReady(true)
      return
    }

    const authed = localStorage.getItem('vika-parking-auth') === 'true'
    if (!authed) {
      window.location.href = '/login'
      return
    }

    setReady(true)
  }, [pathname])

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="glass rounded-3xl px-6 py-4 text-sm text-soft">Открываю приложение для Вики...</div>
      </div>
    )
  }

  return <>{children}</>
}
