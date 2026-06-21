'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { getLastResult } from '@/lib/progress/storage'
import type { AttemptResult } from '@/lib/progress/types'
import { levels } from '@/lib/data/levels'

function scoreLabel(score: number) {
  if (score >= 90) return 'Очень красиво'
  if (score >= 75) return 'Получилось хорошо'
  if (score >= 60) return 'Нормально, закрепим'
  return 'Нужно спокойно повторить'
}

export function ResultClient() {
  const [result, setResult] = useState<AttemptResult | null>(null)

  useEffect(() => {
    setResult(getLastResult())
  }, [])

  if (!result) {
    return (
      <Card>
        <h1 className="text-3xl font-semibold">Результат пока не найден</h1>
        <p className="mt-3 text-soft">Пройди упражнение, и здесь появится разбор.</p>
        <div className="mt-6"><Button href="/practice">К практике</Button></div>
      </Card>
    )
  }

  const currentIndex = levels.findIndex(l => l.id === result.levelId)
  const nextLevel = levels[currentIndex + 1] || levels[0]

  return (
    <div className="space-y-5">
      <Card>
        <p className="text-sm text-pink">Разбор попытки</p>
        <h1 className="mt-2 text-4xl font-semibold">Вика, {scoreLabel(result.score).toLowerCase()} 💛</h1>
        <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-end">
          <p className="text-7xl font-semibold text-mint">{result.score}</p>
          <div className="pb-2 text-soft">
            <p>{result.title}</p>
            <p className="text-sm">Время: {result.durationSeconds} сек · Касания: {result.collisions} · Манёвры: {result.maneuvers}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold">Что получилось</h2>
          <ul className="mt-4 space-y-3">
            {result.positives.map((item) => (
              <li key={item} className="rounded-2xl bg-mint/10 px-4 py-3 text-sm leading-6 text-soft">— {item}</li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold">Что улучшить</h2>
          <ul className="mt-4 space-y-3">
            {result.mistakes.map((item) => (
              <li key={item} className="rounded-2xl bg-white/8 px-4 py-3 text-sm leading-6 text-soft">— {item}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold">Технические детали</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-white/8 p-4">
            <p className="text-sm text-soft">Макс. скорость</p>
            <p className="mt-1 text-2xl font-semibold">{result.maxSpeed} м/с</p>
          </div>
          <div className="rounded-2xl bg-white/8 p-4">
            <p className="text-sm text-soft">Расстояние до центра</p>
            <p className="mt-1 text-2xl font-semibold">{result.finalDistance} м</p>
          </div>
          <div className="rounded-2xl bg-white/8 p-4">
            <p className="text-sm text-soft">Ошибка угла</p>
            <p className="mt-1 text-2xl font-semibold">{result.finalAngleError}°</p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button href={`/simulator/${result.levelId}`}>Повторить это упражнение</Button>
        <Button href={`/simulator/${nextLevel.id}`} variant="secondary">Следующее упражнение</Button>
        <Button href="/dashboard" variant="secondary">На главную</Button>
      </div>
    </div>
  )
}
