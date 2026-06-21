import type { AttemptResult } from '@/lib/progress/types'
import type { ParkingLevel } from '@/lib/data/levels'
import type { CarConfig, CarState, TargetZone } from '@/lib/physics/types'

function angleDiff(a: number, b: number) {
  return Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)))
}

export function buildAttemptResult(args: {
  level: ParkingLevel
  car: CarState
  config: CarConfig
  collisions: number
  maneuvers: number
  startedAt: number
  maxSpeed: number
  completed: boolean
}): AttemptResult {
  const { level, car, collisions, maneuvers, startedAt, maxSpeed, completed } = args

  const finalDistance = Math.hypot(car.x - level.target.x, car.y - level.target.y)
  const finalAngleError = angleDiff(car.angle, level.target.angle ?? 0)
  const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000))

  let score = 100
  const mistakes: string[] = []
  const positives: string[] = []

  if (collisions > 0) {
    score -= Math.min(45, collisions * 14)
    mistakes.push('были касания — смотри на габаритный коридор перед движением')
  } else {
    positives.push('без касаний — это очень хороший контроль габаритов')
  }

  if (maxSpeed > 2.2) {
    score -= 10
    mistakes.push('скорость была высоковата для парковки')
  } else {
    positives.push('скорость была спокойной и контролируемой')
  }

  if (maneuvers > 8) {
    score -= 8
    mistakes.push('получилось много переключений D/R — лучше заранее смотреть на траекторию')
  }

  if (finalDistance > 2.4) {
    score -= 22
    mistakes.push('машина остановилась далековато от целевой зоны')
  } else if (finalDistance > 1.1) {
    score -= 10
    mistakes.push('машина почти в зоне, но можно точнее попасть в центр')
  } else {
    positives.push('машина хорошо попала в парковочную зону')
  }

  if (finalAngleError > 0.45) {
    score -= 15
    mistakes.push('машина стоит под заметным углом — в конце нужно раньше выровнять руль')
  } else if (finalAngleError > 0.25) {
    score -= 7
    mistakes.push('машина почти ровно, но угол можно сделать точнее')
  } else {
    positives.push('корпус машины встал достаточно ровно')
  }

  if (!completed && score > 82) score = 82
  if (completed) positives.push('упражнение завершено корректно')

  if (mistakes.length === 0) mistakes.push('серьёзных ошибок нет — можно переходить к следующему упражнению')
  if (positives.length === 0) positives.push('ты начала тренировку и уже увидела, что нужно улучшить')

  return {
    id: `${level.id}-${Date.now()}`,
    levelId: level.id,
    title: level.title,
    score: Math.max(0, Math.min(100, Math.round(score))),
    collisions,
    maneuvers,
    durationSeconds,
    completed,
    maxSpeed: Number(maxSpeed.toFixed(2)),
    finalDistance: Number(finalDistance.toFixed(2)),
    finalAngleError: Number((finalAngleError * 180 / Math.PI).toFixed(1)),
    mistakes,
    positives,
    createdAt: new Date().toISOString()
  }
}
