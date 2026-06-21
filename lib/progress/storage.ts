'use client'

import type { AttemptResult, VikaProgress } from './types'
import { levels } from '@/lib/data/levels'
import { lessons } from '@/lib/data/lessons'

const KEY = 'vika-parking-progress-v1'

export function createInitialProgress(): VikaProgress {
  const levelRecords: VikaProgress['levels'] = {}
  levels.forEach((level, index) => {
    levelRecords[level.id] = {
      levelId: level.id,
      status: index === 0 ? 'available' : 'locked',
      bestScore: 0,
      attempts: 0
    }
  })

  const lessonRecords: VikaProgress['lessons'] = {}
  lessons.forEach((lesson, index) => {
    lessonRecords[lesson.id] = {
      lessonId: lesson.id,
      completed: false
    }
  })

  return {
    version: 1,
    lastLessonId: lessons[0]?.id,
    lastLevelId: levels[0]?.id,
    lessons: lessonRecords,
    levels: levelRecords,
    attempts: [],
    achievements: {}
  }
}

export function getProgress(): VikaProgress {
  if (typeof window === 'undefined') return createInitialProgress()

  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      const initial = createInitialProgress()
      localStorage.setItem(KEY, JSON.stringify(initial))
      return initial
    }

    const parsed = JSON.parse(raw) as VikaProgress
    const initial = createInitialProgress()

    // merge new lessons/levels after updates
    return {
      ...initial,
      ...parsed,
      lessons: { ...initial.lessons, ...(parsed.lessons || {}) },
      levels: { ...initial.levels, ...(parsed.levels || {}) },
      attempts: parsed.attempts || [],
      achievements: parsed.achievements || {}
    }
  } catch {
    const initial = createInitialProgress()
    localStorage.setItem(KEY, JSON.stringify(initial))
    return initial
  }
}

export function saveProgress(progress: VikaProgress) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(progress))
  window.dispatchEvent(new Event('vika-progress-updated'))
}

export function completeLesson(lessonId: string) {
  const progress = getProgress()
  progress.lessons[lessonId] = {
    lessonId,
    completed: true,
    completedAt: new Date().toISOString()
  }
  progress.lastLessonId = lessonId
  saveProgress(progress)
  return progress
}

export function saveAttempt(result: AttemptResult) {
  const progress = getProgress()

  const current = progress.levels[result.levelId] || {
    levelId: result.levelId,
    status: 'available',
    bestScore: 0,
    attempts: 0
  }

  progress.levels[result.levelId] = {
    ...current,
    status: result.completed || result.score >= 70 ? 'completed' : 'available',
    bestScore: Math.max(current.bestScore || 0, result.score),
    attempts: (current.attempts || 0) + 1,
    completedAt: result.completed || result.score >= 70 ? new Date().toISOString() : current.completedAt
  }

  const idx = levels.findIndex((l) => l.id === result.levelId)
  const next = levels[idx + 1]
  if (next && progress.levels[next.id]?.status === 'locked' && result.score >= 70) {
    progress.levels[next.id] = {
      ...progress.levels[next.id],
      status: 'available'
    }
  }

  progress.lastLevelId = next?.id || result.levelId
  progress.attempts = [result, ...(progress.attempts || [])].slice(0, 30)

  unlockAchievements(progress, result)

  saveProgress(progress)
  localStorage.setItem('vika-parking-last-result', JSON.stringify(result))
  return progress
}

function unlockAchievements(progress: VikaProgress, result: AttemptResult) {
  const now = new Date().toISOString()

  const unlock = (key: string) => {
    if (!progress.achievements[key]) progress.achievements[key] = { key, unlockedAt: now }
  }

  unlock('first-drive')

  if (result.collisions === 0) unlock('no-touch')
  if (result.score >= 90) unlock('clean-parking')
  if (result.levelId.includes('reverse')) unlock('reverse-start')
  if ((progress.attempts?.length || 0) >= 4) unlock('practice-five')
}

export function getLastResult(): AttemptResult | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('vika-parking-last-result')
    return raw ? JSON.parse(raw) as AttemptResult : null
  } catch {
    return null
  }
}

export function resetProgress() {
  const initial = createInitialProgress()
  saveProgress(initial)
  localStorage.removeItem('vika-parking-last-result')
  return initial
}
