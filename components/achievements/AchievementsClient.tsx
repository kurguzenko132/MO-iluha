'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/shared/Card'
import { getProgress } from '@/lib/progress/storage'
import type { VikaProgress } from '@/lib/progress/types'

const items = [
  ['first-drive', '🚗', 'Первый заезд', 'Пройти первую тренировку.'],
  ['no-touch', '🅿️', 'Без касаний', 'Запарковаться без столкновений.'],
  ['clean-parking', '🎯', 'Ровно в линиях', 'Получить 90+ баллов.'],
  ['reverse-start', '🔄', 'Спокойный задний ход', 'Начать упражнения задним ходом.'],
  ['practice-five', '💛', 'Без паники', 'Сделать несколько попыток и продолжить.']
]

export function AchievementsClient() {
  const [progress, setProgress] = useState<VikaProgress | null>(null)

  useEffect(() => {
    const load = () => setProgress(getProgress())
    load()
    window.addEventListener('vika-progress-updated', load)
    return () => window.removeEventListener('vika-progress-updated', load)
  }, [])

  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-4xl font-semibold">Достижения</h1>
        <p className="mt-3 text-soft">Мягкая мотивация без давления.</p>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map(([key, icon, title, desc]) => {
          const unlocked = Boolean(progress?.achievements[key])
          return (
            <Card key={key} className={unlocked ? '' : 'opacity-55'}>
              <div className="text-4xl">{icon}</div>
              <h2 className="mt-3 text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-soft">{desc}</p>
              <p className={`mt-4 text-sm ${unlocked ? 'text-mint' : 'text-soft'}`}>
                {unlocked ? 'Открыто' : 'Пока закрыто'}
              </p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
