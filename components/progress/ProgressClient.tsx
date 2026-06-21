'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/shared/Card'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { getProgress } from '@/lib/progress/storage'
import type { VikaProgress } from '@/lib/progress/types'
import { lessons } from '@/lib/data/lessons'
import { levels } from '@/lib/data/levels'

export function ProgressClient() {
  const [progress, setProgress] = useState<VikaProgress | null>(null)

  useEffect(() => {
    const load = () => setProgress(getProgress())
    load()
    window.addEventListener('vika-progress-updated', load)
    return () => window.removeEventListener('vika-progress-updated', load)
  }, [])

  const completedLessons = progress ? Object.values(progress.lessons).filter(l => l.completed).length : 0
  const completedLevels = progress ? Object.values(progress.levels).filter(l => l.status === 'completed').length : 0
  const total = lessons.length + levels.length
  const done = completedLessons + completedLevels
  const percent = Math.round((done / total) * 100)

  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-4xl font-semibold">Твой прогресс, Вика</h1>
        <p className="mt-3 text-soft">Здесь сохраняются уроки, упражнения, лучшие результаты и последние попытки.</p>
        <div className="mt-5"><ProgressBar value={percent} /></div>
        <p className="mt-3 text-sm text-soft">{done}/{total} шагов курса</p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold">Уроки</h2>
          <p className="mt-2 text-3xl font-semibold text-sky">{completedLessons}/{lessons.length}</p>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Упражнения</h2>
          <p className="mt-2 text-3xl font-semibold text-mint">{completedLevels}/{levels.length}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold">Результаты по упражнениям</h2>
        <div className="mt-4 space-y-3">
          {levels.map(level => {
            const item = progress?.levels[level.id]
            return (
              <div key={level.id} className="rounded-2xl bg-white/8 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{level.title}</h3>
                    <p className="mt-1 text-sm text-soft">{level.skill}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{item?.bestScore || 0}/100</p>
                    <p className="text-xs text-soft">{item?.attempts || 0} попыток</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">Последние попытки</h2>
        <div className="mt-4 space-y-3">
          {(progress?.attempts || []).slice(0, 6).map(attempt => (
            <div key={attempt.id} className="rounded-2xl bg-white/8 p-4">
              <div className="flex justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{attempt.title}</h3>
                  <p className="mt-1 text-sm text-soft">Касания: {attempt.collisions} · Манёвры: {attempt.maneuvers}</p>
                </div>
                <p className="text-2xl font-semibold text-mint">{attempt.score}</p>
              </div>
            </div>
          ))}

          {(!progress?.attempts || progress.attempts.length === 0) && (
            <p className="text-soft">Пока попыток нет. Пройди первое упражнение.</p>
          )}
        </div>
      </Card>
    </div>
  )
}
