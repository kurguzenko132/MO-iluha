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
      className="w-full rounded-full bg-gradient-to-r from-pink to-violet px-6 py-3 text-sm font-semibold shadow-glow active:scale-[.98]"
    >
      Я поняла, перейти к упражнению
    </button>
  )
}
