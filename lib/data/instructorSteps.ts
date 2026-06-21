import type { ParkingLevel } from './levels'

export type InstructorStepKind = 'position' | 'steer' | 'gear' | 'finish'

export type InstructorStep = {
  id: string
  title: string
  text: string
  kind: InstructorStepKind
  x: number
  y: number
  radius: number
  action?: 'set-r' | 'set-d' | 'steer-left' | 'steer-right' | 'straighten' | 'stop'
}

export function getInstructorSteps(level: ParkingLevel): InstructorStep[] {
  if (level.id === 'shop-reverse-lines' || level.id === 'shop-reverse-crooked-car') {
    return [
      {
        id: 'start-r',
        title: 'Включи заднюю передачу',
        text: 'Начинаем медленно. Поставь R и не спеши с газом.',
        kind: 'gear',
        x: level.start.x,
        y: level.start.y,
        radius: 1.2,
        action: 'set-r'
      },
      {
        id: 'point-1',
        title: 'Доедь до точки начала поворота',
        text: 'Едь назад до первой розовой точки. Здесь важно не крутить руль слишком рано.',
        kind: 'position',
        x: -2.1,
        y: -2.7,
        radius: 1.0
      },
      {
        id: 'steer',
        title: 'Начинай поворот',
        text: 'Теперь плавно выкручивай руль. Следи, чтобы синяя линия входила в место.',
        kind: 'steer',
        x: 0.5,
        y: -0.3,
        radius: 1.2,
        action: 'steer-right'
      },
      {
        id: 'straighten',
        title: 'Выравнивай руль',
        text: 'Машина уже заходит. Верни руль ближе к центру, чтобы корпус стал ровнее.',
        kind: 'steer',
        x: 1.6,
        y: 1.5,
        radius: 1.1,
        action: 'straighten'
      },
      {
        id: 'finish',
        title: 'Остановись в зелёной зоне',
        text: 'Теперь только маленькое движение назад и мягкая остановка.',
        kind: 'finish',
        x: level.target.x,
        y: level.target.y,
        radius: 1.1,
        action: 'stop'
      }
    ]
  }

  if (level.id === 'parallel-curb-easy') {
    return [
      { id: 'r', title: 'Включи R', text: 'Параллельная парковка начинается спокойно задним ходом.', kind: 'gear', x: level.start.x, y: level.start.y, radius: 1.2, action: 'set-r' },
      { id: 'align', title: 'Держи начальную позицию', text: 'Едь назад до первой точки. Не прижимайся слишком близко к бордюру.', kind: 'position', x: -3.7, y: -1.4, radius: 1.1 },
      { id: 'turn-in', title: 'Заводи зад машины', text: 'Плавно поверни, чтобы зад машины пошёл в свободное место.', kind: 'steer', x: -1.5, y: .1, radius: 1.1, action: 'steer-right' },
      { id: 'straight', title: 'Выравнивай корпус', text: 'Когда машина вошла в место, выравнивай руль и смотри на бордюр.', kind: 'steer', x: .2, y: 1.2, radius: 1.1, action: 'straighten' },
      { id: 'finish', title: 'Остановись параллельно бордюру', text: 'Мягко остановись, когда корпус ровно в зоне.', kind: 'finish', x: level.target.x, y: level.target.y, radius: 1.2, action: 'stop' }
    ]
  }

  if (level.id === 'basic-reverse-straight') {
    return [
      { id: 'r', title: 'Включи R', text: 'Задний ход по прямой. Главное — не спешить.', kind: 'gear', x: level.start.x, y: level.start.y, radius: 1.2, action: 'set-r' },
      { id: 'middle', title: 'Держи машину ровно', text: 'Смотри на синюю линию: если она уходит в сторону, верни руль в центр.', kind: 'position', x: 0, y: 0, radius: 1.2, action: 'straighten' },
      { id: 'finish', title: 'Остановись в зоне', text: 'Плавно остановись, когда машина внутри зелёной зоны.', kind: 'finish', x: level.target.x, y: level.target.y, radius: 1.2, action: 'stop' }
    ]
  }

  return [
    { id: 'start', title: 'Начни медленно', text: 'Сначала почувствуй скорость и габариты машины.', kind: 'position', x: level.start.x + 2.5, y: level.start.y, radius: 1.2 },
    { id: 'look', title: 'Смотри на траекторию', text: 'Синяя линия показывает, куда машина реально поедет.', kind: 'position', x: (level.start.x + level.target.x) / 2, y: (level.start.y + level.target.y) / 2, radius: 1.2 },
    { id: 'finish', title: 'Остановись в зоне', text: 'В конце важно выровнять руль и мягко остановиться.', kind: 'finish', x: level.target.x, y: level.target.y, radius: 1.2, action: 'stop' }
  ]
}
