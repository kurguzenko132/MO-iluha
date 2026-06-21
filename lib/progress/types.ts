export type LevelStatus = 'locked' | 'available' | 'completed'

export type LevelProgress = {
  levelId: string
  status: LevelStatus
  bestScore: number
  attempts: number
  completedAt?: string
}

export type LessonProgress = {
  lessonId: string
  completed: boolean
  completedAt?: string
}

export type AchievementProgress = {
  key: string
  unlockedAt: string
}

export type AttemptResult = {
  id: string
  levelId: string
  title: string
  score: number
  collisions: number
  maneuvers: number
  durationSeconds: number
  completed: boolean
  maxSpeed: number
  finalDistance: number
  finalAngleError: number
  mistakes: string[]
  positives: string[]
  createdAt: string
}

export type VikaProgress = {
  version: number
  lastLessonId?: string
  lastLevelId?: string
  lessons: Record<string, LessonProgress>
  levels: Record<string, LevelProgress>
  attempts: AttemptResult[]
  achievements: Record<string, AchievementProgress>
}
