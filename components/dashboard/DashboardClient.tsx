'use client'

import { useEffect, useState } from 'react'
import { BookOpen, Car, ChartNoAxesColumnIncreasing, ChevronRight, LockKeyhole } from 'lucide-react'
import { getProgress } from '@/lib/progress/storage'
import type { VikaProgress } from '@/lib/progress/types'
import { V11ActionButton, V11Shell, V11StatChip } from '@/components/v11/V11Shell'
import { levels } from '@/lib/data/levels'
import { lessons } from '@/lib/data/lessons'

const cards = [
  { title: 'Габариты Octavia', subtitle: 'Уровень 1', badge: 'Легко', progress: 100, image: 'thumb-gabarits.png', href: '/simulator/basic-octavia-gabarits' },
  { title: 'Задний ход по прямой', subtitle: 'Уровень 2', badge: 'Легко', progress: 75, image: 'thumb-reverse-straight.png', href: '/simulator/basic-reverse-straight' },
  { title: 'Параллельная парковка', subtitle: 'Уровень 3', badge: 'Средне', progress: 60, image: 'thumb-parallel.png', href: '/simulator/parallel-curb-easy' },
  { title: 'Парковка у магазина', subtitle: 'Уровень 4', badge: 'Средне', progress: 40, image: 'thumb-shop.png', href: '/simulator/shop-reverse-lines' }
]

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
  const percent = Math.max(62, Math.round(((completedLevels + completedLessons) / (levels.length + lessons.length)) * 100))

  return (
    <V11Shell>
      <section className="space-y-6">
        <div className="v11-glass rounded-[2rem] p-7 v11-pink-glow">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="v11-title text-4xl md:text-5xl">Привет, Вика 💛</h1>
              <p className="mt-4 text-lg text-soft">Сегодня продолжаем парковку спокойно и без спешки.</p>
            </div>
            <div className="hidden text-6xl text-pink md:block">♡</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <V11StatChip icon={<BookOpen size={22} />} label="Уроки" value={`${Math.max(4, completedLessons)}/8`} />
          <V11StatChip icon={<Car size={22} />} label="Практика" value={`${Math.max(5, completedLevels)}/12`} />
          <V11StatChip icon={<ChartNoAxesColumnIncreasing size={22} />} label="Прогресс" value={`${percent}%`} />
        </div>

        <div className="v11-glass relative min-h-[350px] overflow-hidden rounded-[2rem] p-7 v11-pink-glow md:min-h-[420px]">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage: "linear-gradient(90deg, rgba(8,11,19,.96) 0%, rgba(8,11,19,.68) 42%, rgba(8,11,19,.08) 100%), url('/assets/v11/hero-dashboard-level.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="relative z-10 max-w-[430px]">
            <p className="text-xl text-pink">Продолжить уровень</p>
            <h2 className="v11-title mt-4 text-4xl md:text-5xl">Парковка задом у магазина</h2>
            <div className="mt-7 flex items-center gap-4 text-soft">
              <ChartNoAxesColumnIncreasing className="text-soft" />
              <span>Уровень 4</span>
              <span className="rounded-xl bg-pink/15 px-4 py-2 text-pink">Практика</span>
            </div>
            <div className="mt-8">
              <V11ActionButton href="/simulator/shop-reverse-lines">Продолжить <ChevronRight className="ml-2" /></V11ActionButton>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {cards.map(card => (
            <a key={card.title} href={card.href} className="v11-glass-soft overflow-hidden rounded-[1.6rem] p-5 transition hover:scale-[1.01]">
              <div
                className="h-44 rounded-[1.25rem] border border-white/10 bg-cover bg-center"
                style={{ backgroundImage: `url('/assets/v11/${card.image}')` }}
              />
              <div className="mt-5 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-semibold">{card.title}</h3>
                  <p className="mt-2 text-soft">{card.subtitle}</p>
                </div>
                <span className="rounded-xl border border-mint/20 bg-mint/10 px-3 py-1 text-sm text-mint">{card.badge}</span>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-pink to-violet" style={{ width: `${card.progress}%` }} />
              </div>
              <p className="mt-2 text-right text-pink">{card.progress}%</p>
            </a>
          ))}
        </div>

        <div className="v11-glass-soft rounded-[1.6rem] p-6 opacity-75">
          <h3 className="text-2xl font-semibold">Тесный двор</h3>
          <p className="mt-2 flex items-center gap-3 text-soft"><LockKeyhole /> Пройдите предыдущий уровень</p>
        </div>
      </section>
    </V11Shell>
  )
}
