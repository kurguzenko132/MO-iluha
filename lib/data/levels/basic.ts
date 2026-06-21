import { ParkingLevel } from '@/lib/simulator/types'

export const basicLevels: ParkingLevel[] = [
  {
    id: 'basic-gabarits-01',
    title: 'Почувствовать габариты Octavia',
    category: 'basic',
    difficulty: 1,
    introMessage: 'Попробуем медленно проехать между конусами.',
    goal: 'Проедь между конусами и остановись в зоне.',
    scene: {},
    startCar: { x: -3, y: 0, angle: 0, speed: 0, steeringAngle: 0, gear: 'D' },
    targetZone: { x: 5, y: 0, width: 5, height: 2 },
    obstacles: [],
    idealTrajectory: [],
    checkpoints: [],
    hints: [],
    scoringRules: {}
  }
]
