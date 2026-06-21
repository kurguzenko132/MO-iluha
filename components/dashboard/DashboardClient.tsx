'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { getProgress } from '@/lib/progress/storage'
import type { VikaProgress } from '@/lib/progress/types'
import { lessons } from '@/lib/data/lessons'
import { levels } from '@/lib/data/levels'
import { BookOpen, Car, Heart, Route } from 'lucide-react'

export function DashboardClient() {
  const [progress, setProgress] = useState<VikaProgress | null>(null)

  useEffect(() => {
    const load = () => setProgress(getProgress())
    load()
    window.addEventListener('vika-progress-updated', load)
    return () => window.removeEventListener('vika-progress-updated', load)
  }, [])

  const completedLevels = progress ? Object.values(progress.levels).filter(l => l.status === 'completed').length : 0
  const completedLessons = progress ? Object.values(progress.lessons).filter(l => l.completed).length : 0
  const percent = Math.round(((completedLevels + completedLessons) / (levels.length + lessons.length)) * 100)
  const nextLesson = lessons.find(l => !progress?.lessons[l.id]?.completed) || lessons[0]
  const nextLevel = levels.find(l => progress?.levels[l.id]?.status === 'available' && progress?.levels[l.id]?.bestScore < 70) || levels[0]

  return (
    <div className="space-y-5">
      <Card className="relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-pink/20 blur-3xl" />
        <p className="text-sm text-pink">Личный тренажёр</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-6xl">Вика, рада видеть тебя снова 🚗</h1>
        <p className="mt-4 max-w-2xl text-soft">
          Сегодня можно спокойно пройти короткую теорию и сразу закрепить её на упражнении. Без спешки. Без давления.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button href={`/learn/${nextLesson.id}`}>Продолжить обучение</Button>
          <Button href={`/simulator/${nextLevel.id}`} variant="secondary">Сразу практика</Button>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-4">
        <Card>
          <BookOpen className="text-sky" />
          <h3 className="mt-3 font-semibold">Теория</h3>
          <p className="mt-2 text-sm text-soft">{completedLessons}/{lessons.length} уроков</p>
        </Card>
        <Card>
          <Route className="text-mint" />
          <h3 className="mt-3 font-semibold">Траектория</h3>
          <p className="mt-2 text-sm text-soft">Синяя линия показывает реальный путь.</p>
        </Card>
        <Card>
          <Car className="text-pink" />
          <h3 className="mt-3 font-semibold">Практика</h3>
          <p className="mt-2 text-sm text-soft">{completedLevels}/{levels.length} упражнений</p>
        </Card>
        <Card>
          <Heart className="text-pink" />
          <h3 className="mt-3 font-semibold">Без давления</h3>
          <p className="mt-2 text-sm text-soft">Ошибки объясняются спокойно.</p>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <Card>
          <h2 className="text-xl font-semibold">Следующий шаг</h2>
          <div className="mt-4 space-y-3">
            <a href={`/learn/${nextLesson.id}`} className="block rounded-3xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
              <p className="text-sm text-sky">Теория</p>
              <h3 className="mt-1 font-semibold">{nextLesson.title}</h3>
              <p className="mt-2 text-sm text-soft">{nextLesson.subtitle}</p>
            </a>
            <a href={`/simulator/${nextLevel.id}`} className="block rounded-3xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
              <p className="text-sm text-mint">Практика</p>
              <h3 className="mt-1 font-semibold">{nextLevel.title}</h3>
              <p className="mt-2 text-sm text-soft">{nextLevel.goal}</p>
            </a>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold">Общий прогресс</h3>
          <div className="mt-4"><ProgressBar value={percent} /></div>
          <p className="mt-3 text-sm text-soft">{percent}% курса</p>
          <div className="mt-5 rounded-3xl bg-white/8 p-4">
            <h3 className="font-semibold">Сообщение от Дани 💛</h3>
            <p className="mt-2 text-sm leading-6 text-soft">
              Я сделал это не для того, чтобы ты идеально парковалась с первого раза. А чтобы тебе было спокойнее.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
