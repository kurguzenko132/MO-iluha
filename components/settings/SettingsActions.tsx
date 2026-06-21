'use client'

import { resetProgress } from '@/lib/progress/storage'

export function SettingsActions() {
  const logout = () => {
    localStorage.removeItem('vika-parking-auth')
    window.location.href = '/login'
  }

  const reset = () => {
    if (confirm('Сбросить прогресс?')) {
      resetProgress()
      window.location.reload()
    }
  }

  return (
    <div className="mt-6 grid gap-3 md:grid-cols-2">
      <button onClick={logout} className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-left text-sm text-soft hover:bg-white/12">
        Выйти из приложения
      </button>
      <button onClick={reset} className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-left text-sm text-danger hover:bg-danger/15">
        Сбросить прогресс
      </button>
    </div>
  )
}
