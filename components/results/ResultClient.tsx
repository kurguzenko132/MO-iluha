'use client'

import { useEffect, useState } from 'react'
import { Home, RotateCcw, Star, Target, Hand, ChartNoAxesColumnIncreasing, Circle } from 'lucide-react'
import { getLastResult } from '@/lib/progress/storage'
import type { AttemptResult } from '@/lib/progress/types'
import { levels } from '@/lib/data/levels'
import { V11ActionButton } from '@/components/v11/V11Shell'

export function ResultClient() {
  const [result, setResult] = useState<AttemptResult | null>(null)

  useEffect(() => {
    setResult(getLastResult())
  }, [])

  const score = result?.score ?? 86
  const collisions = result?.collisions ?? 0
  const maneuvers = result?.maneuvers ?? 3
  const currentIndex = levels.findIndex(l => l.id === result?.levelId)
  const nextLevel = levels[currentIndex + 1] || levels[0]
  const levelId = result?.levelId || 'shop-reverse-lines'

  return (
    <section className="space-y-6 pb-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-2xl text-pink">Разбор попытки</p>
          <h1 className="v11-title mt-4 text-5xl md:text-6xl">Вика, получилось хорошо 💛</h1>
        </div>
      </header>

      <div className="mx-auto flex w-fit items-end gap-5 rounded-[1.7rem] px-14 py-8 v11-glass v11-pink-glow">
        <span className="text-8xl font-bold text-pink">{score}</span>
        <span className="pb-3 text-4xl text-white">/ 100</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="v11-glass-soft flex items-center justify-center gap-3 rounded-[1.35rem] px-3 py-4 text-lg text-soft"><Hand /> Касания <b className="text-pink">{collisions}</b></div>
        <div className="v11-glass-soft flex items-center justify-center gap-3 rounded-[1.35rem] px-3 py-4 text-lg text-soft"><RotateCcw /> Манёвры <b className="text-pink">{maneuvers}</b></div>
        <div className="v11-glass-soft flex items-center justify-center gap-3 rounded-[1.35rem] px-3 py-4 text-lg text-soft"><Target /> Точность <b className="text-pink">88%</b></div>
      </div>

      <div
        className="h-[560px] rounded-[2rem] border border-white/10 bg-cover bg-center shadow-card"
        style={{ backgroundImage: "url('/assets/v11/hero-result-scene.png')" }}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="v11-glass rounded-[1.6rem] p-6">
          <h2 className="flex items-center gap-3 text-2xl font-semibold text-pink"><Star /> Что получилось</h2>
          <ul className="mt-5 space-y-4 text-xl leading-8 text-soft">
            <li className="flex gap-3"><span className="text-mint">✓</span> Аккуратный въезд в парковочное место</li>
            <li className="flex gap-3"><span className="text-mint">✓</span> Не задеты препятствия</li>
            <li className="flex gap-3"><span className="text-mint">✓</span> Спокойный и уверенный темп</li>
          </ul>
        </div>

        <div className="v11-glass rounded-[1.6rem] p-6">
          <h2 className="flex items-center gap-3 text-2xl font-semibold text-pink"><Circle /> Что улучшить</h2>
          <ul className="mt-5 space-y-4 text-xl leading-8 text-soft">
            <li>○ Руль можно выравнивать чуть раньше</li>
            <li>○ Финальный откат — плавнее</li>
            <li>○ Следи за правым габаритом при въезде</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <V11ActionButton href={`/simulator/${levelId}`} variant="dark"><RotateCcw className="mr-2" /> Повторить</V11ActionButton>
        <V11ActionButton href={`/simulator/${nextLevel.id}`}>→ Следующий уровень</V11ActionButton>
        <V11ActionButton href="/dashboard" variant="blue"><Home className="mr-2" /> На главную</V11ActionButton>
      </div>

      <div className="v11-glass rounded-[1.6rem] p-5 text-center text-2xl text-soft v11-pink-glow">
        ♡ Ты уже намного лучше чувствуешь габариты. ✦
      </div>
    </section>
  )
}
