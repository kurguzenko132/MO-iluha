import { AuthGuard } from '@/components/auth/AuthGuard'
import { V11Shell } from '@/components/v11/V11Shell'
import { lessons } from '@/lib/data/lessons'
import { BookOpen, ChevronRight } from 'lucide-react'

export default function LearnPage() {
  return (
    <AuthGuard>
      <V11Shell>
        <section className="space-y-6">
          <div className="v11-glass rounded-[2rem] p-7 v11-pink-glow">
            <p className="text-xl text-pink">Теория</p>
            <h1 className="v11-title mt-3 text-5xl">Короткие уроки парковки</h1>
            <p className="mt-4 text-xl text-soft">Сначала понять траекторию, потом спокойно закрепить на практике.</p>
          </div>
          <div className="grid gap-4">
            {lessons.map((lesson, index) => (
              <a key={lesson.id} href={`/learn/${lesson.id}`} className="v11-glass-soft flex items-center gap-5 rounded-[1.6rem] p-5 transition hover:scale-[1.01]">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-pink/12 text-2xl text-pink v11-pink-glow">{index + 1}</span>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold">{lesson.title}</h2>
                  <p className="mt-2 text-soft">{lesson.subtitle}</p>
                </div>
                <BookOpen className="text-pink" />
                <ChevronRight className="text-soft" />
              </a>
            ))}
          </div>
        </section>
      </V11Shell>
    </AuthGuard>
  )
}
