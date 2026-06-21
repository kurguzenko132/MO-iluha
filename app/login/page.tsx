'use client'

import { useState } from 'react'
import { LockKeyhole, Eye, BookOpen, Car, ChartNoAxesColumnIncreasing, ChevronRight } from 'lucide-react'
import { V11Shell, V11ActionButton } from '@/components/v11/V11Shell'

export default function LoginPage() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const enterByCode = () => {
    if (code.trim().toLowerCase() === (process.env.NEXT_PUBLIC_VIKA_CODE || 'vika').toLowerCase()) {
      localStorage.setItem('vika-parking-auth', 'true')
      window.location.href = '/dashboard'
    } else {
      setError('Код не подошёл. Попробуй ещё раз 💛')
    }
  }

  return (
    <V11Shell withNav={false}>
      <section className="min-h-screen v11-bottom-safe">
        <div className="pt-8 text-center">
          <p className="text-2xl text-pink v11-text-glow">Для Вики 💛</p>
          <h1 className="v11-title mt-8 text-5xl md:text-6xl">Личный тренажёр парковки</h1>
          <p className="mx-auto mt-6 max-w-xl text-xl leading-8 text-soft">
            Сделано специально для тебя — спокойно учиться парковаться шаг за шагом.
          </p>
        </div>

        <div
          className="v11-image mt-10 h-[330px] rounded-[2rem] border border-white/10 shadow-card md:h-[430px]"
          style={{ backgroundImage: "url('/assets/v11/hero-login-parking.png')" }}
        />

        <div className="v11-glass mx-auto mt-10 max-w-[800px] rounded-[2rem] p-6 md:p-8">
          <div className="flex items-center gap-4 text-pink">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink/12 v11-pink-glow">
              <LockKeyhole size={24} />
            </span>
            <span className="text-2xl">Секретный код</span>
          </div>

          <div className="mt-6 flex items-center rounded-[1.35rem] border border-white/10 bg-white/5 px-5 py-4">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') enterByCode()
              }}
              placeholder="Введи код"
              className="w-full bg-transparent text-xl text-white outline-none placeholder:text-soft/55"
            />
            <Eye className="text-soft/70" />
          </div>

          {error && <p className="mt-4 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}

          <button
            onClick={enterByCode}
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-[1.35rem] bg-gradient-to-r from-pink/90 via-violet/80 to-sky/80 px-6 py-5 text-xl font-semibold text-white v11-pink-glow active:scale-[.98]"
          >
            Открыть приложение
            <ChevronRight />
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            [BookOpen, 'Теория', 'Учись правилам'],
            [Car, 'Практика', 'Тренируйся здесь'],
            [ChartNoAxesColumnIncreasing, 'Разбор ошибок', 'Становись лучше']
          ].map(([Icon, title, subtitle]: any) => (
            <div key={title} className="v11-glass-soft rounded-[1.5rem] p-5">
              <Icon className="text-pink" size={30} />
              <h3 className="mt-3 text-xl font-semibold">{title}</h3>
              <p className="mt-1 text-soft">{subtitle}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xl text-soft">♡ Спокойно, Вика, у тебя получится 💛 ✦</p>
      </section>
    </V11Shell>
  )
}
