'use client'

import { completeLesson } from '@/lib/progress/storage'

export function CompleteLessonButton({ lessonId, practiceLevelId }: { lessonId: string; practiceLevelId: string }) {
  const complete = () => {
    completeLesson(lessonId)
    window.location.href = `/simulator/${practiceLevelId}`
  }

  return (
    <button
      onClick={complete}
      className="w-full rounded-[1.5rem] bg-gradient-to-r from-pink/90 via-violet/80 to-sky/80 px-6 py-5 text-2xl font-semibold text-white v11-pink-glow active:scale-[.98]"
    >
      Перейти к упражнению →
    </button>
  )
}
