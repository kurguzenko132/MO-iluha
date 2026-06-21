import { AuthGuard } from '@/components/auth/AuthGuard'
import { getLesson, lessons } from '@/lib/data/lessons'
import { CompleteLessonButton } from '@/components/learn/CompleteLessonButton'
import { V11Shell } from '@/components/v11/V11Shell'
import { BookOpen, Car, ChartNoAxesColumnIncreasing, ChevronRight } from 'lucide-react'

type LessonPageProps = {
  params: Promise<{
    lessonId: string
  }>
}

export function generateStaticParams() {
  return lessons.map((lesson) => ({
    lessonId: lesson.id
  }))
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params
  const lesson = getLesson(lessonId)

  return (
    <AuthGuard>
      <V11Shell withNav={false}>
        <section className="space-y-6 pb-8">
          <header className="relative">
            <p className="text-2xl text-pink">Урок 4</p>
            <h1 className="v11-title mt-4 max-w-3xl text-5xl md:text-6xl">{lesson.title}</h1>
            <p className="mt-6 text-xl text-soft"><span className="text-pink">Навык:</span> задний ход и момент поворота</p>
            <div className="absolute right-0 top-20 hidden text-7xl text-pink drop-shadow-[0_0_30px_rgba(255,94,200,.45)] md:block">♡</div>
          </header>

          <div
            className="v11-image relative h-[620px] overflow-hidden rounded-[2rem] border border-white/10 shadow-card"
            style={{ backgroundImage: "url('/assets/v11/hero-theory-reverse.png')" }}
          >
            <div className="v11-glass absolute left-5 top-8 max-w-[280px] rounded-[1.5rem] p-5">
              <p className="text-lg leading-7 text-soft">Главное — не спешить и задать правильную траекторию.</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              ['1', 'Смотри на задний угол машины', 'Ориентируйся по заднему углу — это поможет понять, когда начинать поворот.'],
              ['2', 'Поворачивай не слишком рано', 'Жди, пока задний угол окажется на одной линии с ближней границей места.'],
              ['3', 'Выравнивай руль раньше входа в место', 'Успей вернуть руль в нейтраль до того, как машина полностью заедет в место.']
            ].map(([num, title, text]) => (
              <div key={num} className="v11-glass-soft flex items-center gap-5 rounded-[1.5rem] p-5">
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl ${num === '3' ? 'bg-mint/12 text-mint v11-mint-glow' : 'bg-sky/12 text-sky v11-blue-glow'}`}>{num}</span>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold">{title}</h2>
                  <p className="mt-2 text-lg leading-7 text-soft">{text}</p>
                </div>
                <ChevronRight className="text-soft" />
              </div>
            ))}
          </div>

          <div className="v11-glass mx-auto grid max-w-[760px] grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3 rounded-[1.35rem] px-5 py-4 text-center text-soft">
            <div className="relative flex items-center justify-center gap-2 text-pink">
              <BookOpen /> Теория
              <span className="absolute -bottom-4 h-0.5 w-28 rounded-full bg-pink shadow-[0_0_18px_rgba(255,94,200,.8)]" />
            </div>
            <span>→</span>
            <div className="flex items-center justify-center gap-2"><Car /> Практика</div>
            <span>→</span>
            <div className="flex items-center justify-center gap-2"><ChartNoAxesColumnIncreasing /> Разбор</div>
          </div>

          <CompleteLessonButton lessonId={lesson.id} practiceLevelId={lesson.practiceLevelId} />

          <div className="v11-glass-soft rounded-[1.5rem] p-5 text-lg text-soft">
            💡 Короткая теория, потом закрепляем на практике.
          </div>
        </section>
      </V11Shell>
    </AuthGuard>
  )
}
