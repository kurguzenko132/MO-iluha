import { AuthGuard } from '@/components/auth/AuthGuard'
import { V11Shell } from '@/components/v11/V11Shell'
import { levels } from '@/lib/data/levels'
import { Car, ChevronRight } from 'lucide-react'

const imgs = ['thumb-gabarits.png', 'thumb-reverse-straight.png', 'thumb-shop.png', 'thumb-shop.png', 'thumb-shop.png', 'thumb-parallel.png', 'thumb-yard.png', 'thumb-yard.png']

export default function PracticePage() {
  return (
    <AuthGuard>
      <V11Shell>
        <section className="space-y-6">
          <div className="v11-glass rounded-[2rem] p-7 v11-pink-glow">
            <p className="text-xl text-pink">Практика</p>
            <h1 className="v11-title mt-3 text-5xl">Уровни парковки</h1>
            <p className="mt-4 text-xl text-soft">От габаритов Octavia до сложных ситуаций во дворе и у магазина.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {levels.map((level, index) => (
              <a key={level.id} href={`/simulator/${level.id}`} className="v11-glass-soft overflow-hidden rounded-[1.6rem] p-5 transition hover:scale-[1.01]">
                <div className="h-48 rounded-[1.2rem] border border-white/10 bg-cover bg-center" style={{ backgroundImage: `url('/assets/v11/${imgs[index] || 'thumb-shop.png'}')` }} />
                <div className="mt-5 flex items-start gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-pink/12 text-pink v11-pink-glow">{index + 1}</span>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold">{level.title}</h2>
                    <p className="mt-2 text-soft">{level.skill}</p>
                  </div>
                  <Car className="text-pink" />
                  <ChevronRight className="text-soft" />
                </div>
              </a>
            ))}
          </div>
        </section>
      </V11Shell>
    </AuthGuard>
  )
}
