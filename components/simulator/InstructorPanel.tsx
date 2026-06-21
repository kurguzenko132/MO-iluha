'use client'

import { CheckCircle2, MapPinned, Flower2 } from 'lucide-react'
import { getInstructorSteps } from '@/lib/data/instructorSteps'
import type { ParkingLevel } from '@/lib/data/levels'
import { useSimulatorStore } from '@/store/simulatorStore'

export function InstructorPanel({ level }: { level: ParkingLevel }) {
  const { instructorMode, instructorStepIndex, setInstructorMode, setInstructorStepIndex } = useSimulatorStore()
  const steps = getInstructorSteps(level)
  const current = steps[Math.min(instructorStepIndex, steps.length - 1)]
  const progress = Math.round(((Math.min(instructorStepIndex, steps.length - 1) + 1) / steps.length) * 100)

  return (
    <div className="v11-glass rounded-[1.6rem] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink/12 text-pink v11-pink-glow">
            <MapPinned size={24} />
          </span>
          <div>
            <p className="text-sm text-pink">Инструктор</p>
            <h3 className="mt-1 text-xl font-semibold">{current?.title || 'Свободная практика'}</h3>
            <p className="mt-2 text-sm leading-6 text-soft">{current?.text || 'Тренируйся в своём темпе.'}</p>
          </div>
        </div>

        <button
          onClick={() => setInstructorMode(!instructorMode)}
          className={`shrink-0 rounded-2xl px-3 py-2 text-xs ${instructorMode ? 'bg-mint/15 text-mint v11-mint-glow' : 'bg-white/8 text-soft'}`}
        >
          {instructorMode ? 'вкл' : 'выкл'}
        </button>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-pink via-violet to-sky" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => setInstructorStepIndex(index)}
            className={`h-10 rounded-xl text-xs transition ${index < instructorStepIndex ? 'bg-mint/15 text-mint' : index === instructorStepIndex ? 'bg-pink/20 text-pink v11-pink-glow' : 'bg-white/8 text-soft'}`}
            title={step.title}
          >
            {index < instructorStepIndex ? <CheckCircle2 className="mx-auto" size={16} /> : index + 1}
          </button>
        ))}
      </div>

      <p className="mt-4 flex items-center gap-2 text-xs text-soft">
        <Flower2 size={14} />
        Включи спокойный режим и просто двигайся от точки к точке.
      </p>
    </div>
  )
}
