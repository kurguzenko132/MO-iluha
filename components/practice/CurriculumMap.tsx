import { levels } from '@/lib/data/levels'

const labels: Record<string, string> = {
  basic: 'База',
  shop: 'Магазин',
  yard: 'Двор',
  parallel: 'Бордюр',
  hard: 'Сложное'
}

export function CurriculumMap() {
  return (
    <div className="glass rounded-3xl p-5">
      <h2 className="text-xl font-semibold">Маршрут обучения</h2>
      <p className="mt-2 text-sm text-soft">Упражнения идут от простого чувства габаритов к реальным ситуациям.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {levels.map((level, index) => (
          <a href={`/simulator/${level.id}`} key={level.id} className="relative rounded-3xl border border-white/10 bg-white/6 p-4 hover:bg-white/10">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-pink to-violet text-sm font-semibold">{index + 1}</span>
              <span className="rounded-full bg-white/8 px-2 py-1 text-[10px] text-soft">{labels[level.category]}</span>
            </div>
            <h3 className="text-sm font-semibold">{level.title}</h3>
            <p className="mt-2 text-xs leading-5 text-soft">{level.skill}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
