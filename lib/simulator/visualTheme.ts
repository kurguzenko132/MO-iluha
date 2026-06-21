import type { RectObstacle } from '@/lib/physics/types'
import type { ParkingLevel } from '@/lib/data/levels'

export type SceneTheme = {
  asphalt: string
  asphalt2: string
  grid: string
  line: string
  curb: string
  parkingLine: string
  danger: string
  carBody: string
  carGlass: string
}

export const sceneTheme: SceneTheme = {
  asphalt: '#121824',
  asphalt2: '#0f1420',
  grid: 'rgba(255,255,255,.045)',
  line: 'rgba(255,255,255,.28)',
  curb: 'rgba(251,191,36,.88)',
  parkingLine: 'rgba(255,255,255,.55)',
  danger: 'rgba(251,113,133,.95)',
  carBody: 'rgba(139,92,246,.98)',
  carGlass: 'rgba(15,23,42,.85)'
}

export function getSceneLabel(level: ParkingLevel) {
  if (level.category === 'shop') return 'Парковка у магазина'
  if (level.category === 'yard') return 'Двор'
  if (level.category === 'parallel') return 'Улица и бордюр'
  if (level.category === 'hard') return 'Сложная ситуация'
  return 'Учебная площадка'
}

export function getObstacleLabel(obstacle: RectObstacle) {
  if (obstacle.type === 'car') return 'авто'
  if (obstacle.type === 'curb') return 'бордюр'
  if (obstacle.type === 'cone') return 'конус'
  if (obstacle.type === 'trash') return 'мусорка'
  if (obstacle.type === 'wall') return 'стена'
  return ''
}
