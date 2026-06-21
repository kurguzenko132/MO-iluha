'use client'

import { useEffect, useRef, useState } from 'react'
import { updateCarPhysics, predictTrajectory } from '@/lib/physics/carPhysics'
import { getCarCorners } from '@/lib/physics/geometry'
import { detectCollision, getSoftHint, isParked } from '@/lib/simulator/scoring'
import { buildAttemptResult } from '@/lib/simulator/result'
import { saveAttempt } from '@/lib/progress/storage'
import { playSound } from '@/lib/sound/soundEngine'
import { getInstructorSteps } from '@/lib/data/instructorSteps'
import { useSettingsStore } from '@/store/settingsStore'
import { useSimulatorStore } from '@/store/simulatorStore'
import type { ParkingLevel } from '@/lib/data/levels'
import type { CarInput, CarState, Point, RectObstacle, TargetZone } from '@/lib/physics/types'

function scaleFor(w: number, h: number) {
  if (w < 520) return Math.max(32, Math.min(42, w / 10))
  if (w < 900) return Math.max(40, Math.min(52, w / 13))
  return Math.max(48, Math.min(62, Math.min(w / 16, h / 11)))
}

function toScreen(p: Point, w: number, h: number, cam: Point, scale: number) {
  return {
    x: w / 2 + (p.x - cam.x) * scale,
    y: h / 2 - (p.y - cam.y) * scale
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

function drawPath(
  ctx: CanvasRenderingContext2D,
  points: Array<Point | { x: number; y: number; angle?: number }>,
  w: number,
  h: number,
  cam: Point,
  scale: number,
  color: string,
  width = 4,
  dash?: number[]
) {
  if (points.length < 2) return
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.setLineDash(dash || [])
  ctx.shadowColor = color
  ctx.shadowBlur = 12
  ctx.beginPath()
  points.forEach((p, index) => {
    const s = toScreen({ x: p.x, y: p.y }, w, h, cam, scale)
    if (index === 0) ctx.moveTo(s.x, s.y)
    else ctx.lineTo(s.x, s.y)
  })
  ctx.stroke()
  ctx.restore()
}

function drawWorldRect(
  ctx: CanvasRenderingContext2D,
  center: Point,
  widthM: number,
  heightM: number,
  angle: number,
  w: number,
  h: number,
  cam: Point,
  scale: number,
  fill: string,
  stroke?: string,
  radius = 8
) {
  const s = toScreen(center, w, h, cam, scale)
  ctx.save()
  ctx.translate(s.x, s.y)
  ctx.rotate(-angle)
  const pxW = widthM * scale
  const pxH = heightM * scale
  ctx.fillStyle = fill
  if (stroke) {
    ctx.strokeStyle = stroke
    ctx.lineWidth = 2
  }
  roundRect(ctx, -pxW / 2, -pxH / 2, pxW, pxH, radius)
  ctx.fill()
  if (stroke) ctx.stroke()
  ctx.restore()
}

function drawPolygon(ctx: CanvasRenderingContext2D, points: Point[], w: number, h: number, cam: Point, scale: number, fill: string, stroke?: string) {
  ctx.beginPath()
  points.forEach((p, i) => {
    const s = toScreen(p, w, h, cam, scale)
    if (i === 0) ctx.moveTo(s.x, s.y)
    else ctx.lineTo(s.x, s.y)
  })
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
  if (stroke) {
    ctx.strokeStyle = stroke
    ctx.lineWidth = 2
    ctx.stroke()
  }
}

function drawAsphalt(ctx: CanvasRenderingContext2D, w: number, h: number, cam: Point, scale: number) {
  const bg = ctx.createLinearGradient(0, 0, w, h)
  bg.addColorStop(0, '#121827')
  bg.addColorStop(1, '#070B14')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  const grid = Math.max(26, scale * 0.75)
  const ox = ((w / 2 - cam.x * scale) % grid + grid) % grid
  const oy = ((h / 2 + cam.y * scale) % grid + grid) % grid
  ctx.strokeStyle = 'rgba(255,255,255,.045)'
  ctx.lineWidth = 1
  for (let x = ox; x < w; x += grid) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, h)
    ctx.stroke()
  }
  for (let y = oy; y < h; y += grid) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }

  ctx.save()
  ctx.globalAlpha = 0.08
  ctx.fillStyle = '#C8D0E5'
  for (let i = 0; i < 90; i++) {
    const x = (i * 97 + Math.floor(cam.x * 23)) % w
    const y = (i * 53 + Math.floor(cam.y * 17)) % h
    ctx.fillRect(x, y, 1, 1)
  }
  ctx.restore()

  const vignette = ctx.createRadialGradient(w * .5, h * .44, 80, w * .5, h * .45, Math.max(w, h) * .75)
  vignette.addColorStop(0, 'rgba(255,255,255,.025)')
  vignette.addColorStop(1, 'rgba(0,0,0,.44)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, w, h)
}

function drawScene(ctx: CanvasRenderingContext2D, level: ParkingLevel, w: number, h: number, cam: Point, scale: number) {
  if (level.category === 'shop') {
    for (let i = -3; i <= 3; i++) {
      drawWorldRect(ctx, { x: i * 3.15, y: 2.35 }, 2.72, 5.35, Math.PI / 2, w, h, cam, scale, 'rgba(255,255,255,.012)', 'rgba(255,255,255,.30)', 6)
    }
    drawPath(ctx, [{ x: -8.5, y: -1.2 }, { x: 8.5, y: -1.2 }], w, h, cam, scale, 'rgba(255,255,255,.18)', 2, [18, 18])

    const edge = toScreen({ x: 8.35, y: 0 }, w, h, cam, scale).x
    ctx.fillStyle = 'rgba(28,33,45,.92)'
    ctx.fillRect(edge, -100, scale * 3, h + 200)
    ctx.fillStyle = 'rgba(255,200,87,.24)'
    ctx.fillRect(edge - 10, -100, 8, h + 200)

    for (let i = 0; i < 9; i++) {
      ctx.fillStyle = i % 2 ? 'rgba(255,210,130,.15)' : 'rgba(255,210,130,.07)'
      roundRect(ctx, edge + scale * .35, 40 + i * 105, scale * 1.2, 42, 8)
      ctx.fill()
    }

    drawWorldRect(ctx, { x: 8.1, y: -2.4 }, 1.2, .8, -.15, w, h, cam, scale, 'rgba(170,180,200,.18)', 'rgba(180,190,210,.42)', 6)
    drawWorldRect(ctx, { x: 8.1, y: -4.1 }, 1.9, .55, 0, w, h, cam, scale, 'rgba(139,90,43,.55)', 'rgba(255,255,255,.18)', 8)
  }

  if (level.category === 'parallel' || level.category === 'hard') {
    drawWorldRect(ctx, { x: 1, y: 3.35 }, 15, .34, 0, w, h, cam, scale, 'rgba(255,200,87,.65)', 'rgba(255,255,255,.22)', 2)
    drawPath(ctx, [{ x: -8.5, y: -.25 }, { x: 8.5, y: -.25 }], w, h, cam, scale, 'rgba(255,255,255,.16)', 2, [22, 22])
  }

  if (level.category === 'yard') {
    drawWorldRect(ctx, { x: -7.2, y: -3.2 }, 2.1, 1.6, .1, w, h, cam, scale, 'rgba(34,197,94,.08)', 'rgba(34,197,94,.20)', 14)
    drawWorldRect(ctx, { x: 7.0, y: 3.6 }, 1.8, 1.5, -.15, w, h, cam, scale, 'rgba(34,197,94,.08)', 'rgba(34,197,94,.20)', 14)
    drawPath(ctx, [{ x: -8, y: -3.05 }, { x: 8, y: -3.05 }], w, h, cam, scale, 'rgba(255,200,87,.50)', 4)
  }

  if (level.category === 'basic') {
    drawPath(ctx, [{ x: -8, y: 1.55 }, { x: 8, y: 1.55 }], w, h, cam, scale, 'rgba(255,255,255,.23)', 2, [12, 12])
    drawPath(ctx, [{ x: -8, y: -1.55 }, { x: 8, y: -1.55 }], w, h, cam, scale, 'rgba(255,255,255,.23)', 2, [12, 12])
  }
}

function drawTarget(ctx: CanvasRenderingContext2D, target: TargetZone, w: number, h: number, cam: Point, scale: number) {
  const s = toScreen({ x: target.x, y: target.y }, w, h, cam, scale)
  ctx.save()
  ctx.translate(s.x, s.y)
  ctx.rotate(-(target.angle ?? 0))
  const pxW = target.width * scale
  const pxH = target.height * scale

  ctx.fillStyle = 'rgba(34,230,165,.12)'
  ctx.strokeStyle = 'rgba(34,230,165,.95)'
  ctx.shadowColor = 'rgba(34,230,165,.42)'
  ctx.shadowBlur = 26
  ctx.lineWidth = 2.5
  roundRect(ctx, -pxW / 2, -pxH / 2, pxW, pxH, 10)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = 'rgba(34,230,165,.55)'
  ctx.font = `700 ${Math.max(28, scale * .9)}px system-ui`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('P', 0, 0)
  ctx.restore()
}

function drawCar(
  ctx: CanvasRenderingContext2D,
  car: Pick<CarState, 'x' | 'y' | 'angle' | 'steeringAngle'>,
  w: number,
  h: number,
  cam: Point,
  scale: number,
  color = '#8A5CFF',
  alpha = 1
) {
  const s = toScreen({ x: car.x, y: car.y }, w, h, cam, scale)
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.translate(s.x, s.y)
  ctx.rotate(-car.angle)

  const length = 4.69 * scale
  const width = 1.83 * scale

  ctx.shadowColor = 'rgba(0,0,0,.55)'
  ctx.shadowBlur = 18
  ctx.shadowOffsetY = 8

  const grad = ctx.createLinearGradient(-length / 2, 0, length / 2, 0)
  grad.addColorStop(0, color === '#8A5CFF' ? '#5B22D9' : color)
  grad.addColorStop(.55, color)
  grad.addColorStop(1, color === '#8A5CFF' ? '#B150FF' : color)

  ctx.fillStyle = grad
  roundRect(ctx, -length / 2, -width / 2, length, width, width * .25)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,.55)'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.shadowColor = 'transparent'
  ctx.fillStyle = 'rgba(8,14,28,.88)'
  roundRect(ctx, -length * .08, -width * .34, length * .28, width * .68, 12)
  ctx.fill()
  ctx.fillStyle = 'rgba(62,166,255,.18)'
  roundRect(ctx, -length * .05, -width * .27, length * .10, width * .54, 7)
  ctx.fill()
  roundRect(ctx, length * .07, -width * .27, length * .09, width * .54, 7)
  ctx.fill()

  ctx.fillStyle = 'rgba(62,166,255,.88)'
  ctx.fillRect(length / 2 - 7, -width * .32, 4, width * .20)
  ctx.fillRect(length / 2 - 7, width * .12, 4, width * .20)
  ctx.fillStyle = 'rgba(255,94,200,.85)'
  ctx.fillRect(-length / 2 + 3, -width * .32, 4, width * .20)
  ctx.fillRect(-length / 2 + 3, width * .12, 4, width * .20)

  ctx.fillStyle = '#020617'
  const wheelW = Math.max(5, scale * .13)
  const wheelH = width * .24
  const wheels: Array<[number, number, number]> = [
    [-length * .30, -width * .53, 0],
    [-length * .30, width * .53, 0],
    [length * .30, -width * .53, -car.steeringAngle],
    [length * .30, width * .53, -car.steeringAngle]
  ]
  wheels.forEach(([x, y, rot]) => {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rot)
    roundRect(ctx, -wheelW / 2, -wheelH / 2, wheelW, wheelH, 3)
    ctx.fill()
    ctx.restore()
  })

  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(length / 2 - 14, 0, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawCone(ctx: CanvasRenderingContext2D, obs: RectObstacle, w: number, h: number, cam: Point, scale: number) {
  const s = toScreen({ x: obs.x, y: obs.y }, w, h, cam, scale)
  ctx.save()
  ctx.translate(s.x, s.y)
  ctx.shadowColor = 'rgba(0,0,0,.48)'
  ctx.shadowBlur = 9
  ctx.fillStyle = '#FF6B2C'
  ctx.beginPath()
  ctx.moveTo(0, -scale * .28)
  ctx.lineTo(scale * .22, scale * .26)
  ctx.lineTo(-scale * .22, scale * .26)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,.55)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(-scale * .12, scale * .05)
  ctx.lineTo(scale * .12, scale * .05)
  ctx.stroke()
  ctx.restore()
}

function drawObstacle(ctx: CanvasRenderingContext2D, obs: RectObstacle, w: number, h: number, cam: Point, scale: number) {
  if (obs.type === 'car') {
    const color = obs.id.includes('white') || obs.id.includes('left') ? '#D8DEE8' : obs.id.includes('suv') || obs.id.includes('right') ? '#64748B' : '#202938'
    return drawCar(ctx, { x: obs.x, y: obs.y, angle: obs.angle ?? 0, steeringAngle: 0 }, w, h, cam, scale, color, .96)
  }
  if (obs.type === 'cone') return drawCone(ctx, obs, w, h, cam, scale)
  if (obs.type === 'curb') return drawWorldRect(ctx, { x: obs.x, y: obs.y }, obs.width, obs.height, obs.angle ?? 0, w, h, cam, scale, 'rgba(255,200,87,.75)', 'rgba(255,255,255,.22)', 3)
  if (obs.type === 'trash') return drawWorldRect(ctx, { x: obs.x, y: obs.y }, obs.width, obs.height, obs.angle ?? 0, w, h, cam, scale, 'rgba(168,85,247,.65)', 'rgba(255,255,255,.22)', 8)
  return drawWorldRect(ctx, { x: obs.x, y: obs.y }, obs.width, obs.height, obs.angle ?? 0, w, h, cam, scale, 'rgba(255,94,130,.75)', 'rgba(255,255,255,.22)', 4)
}

function drawInstructor(ctx: CanvasRenderingContext2D, level: ParkingLevel, w: number, h: number, cam: Point, scale: number) {
  const store = useSimulatorStore.getState()
  if (!store.instructorMode) return
  const steps = getInstructorSteps(level)
  const step = steps[Math.min(store.instructorStepIndex, steps.length - 1)]
  if (!step) return

  const s = toScreen({ x: step.x, y: step.y }, w, h, cam, scale)
  const pulse = 1 + Math.sin(Date.now() / 260) * .07
  ctx.save()
  ctx.fillStyle = 'rgba(255,94,200,.12)'
  ctx.strokeStyle = 'rgba(255,94,200,.85)'
  ctx.shadowColor = 'rgba(255,94,200,.65)'
  ctx.shadowBlur = 26
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(s.x, s.y, step.radius * scale * pulse, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#FF5EC8'
  ctx.font = `800 ${Math.max(13, scale * .24)}px system-ui`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(Math.min(store.instructorStepIndex + 1, steps.length)), s.x, s.y)
  ctx.restore()
}

function updateInstructor(level: ParkingLevel, car: CarState) {
  const store = useSimulatorStore.getState()
  if (!store.instructorMode) return
  const steps = getInstructorSteps(level)
  const step = steps[store.instructorStepIndex]
  if (!step) return

  store.setHint(step.text)
  const dist = Math.hypot(car.x - step.x, car.y - step.y)
  if (dist < step.radius && Math.abs(car.speed) < 1.8 && store.instructorStepIndex < steps.length - 1) {
    store.setInstructorStepIndex(store.instructorStepIndex + 1)
    playSound('soft')
  }
}

export function RealParkingCanvas({ level }: { level: ParkingLevel }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const cameraRef = useRef<Point>({ x: level.start.x, y: level.start.y })
  const savedRef = useRef(false)
  const [finished, setFinished] = useState(false)

  const settings = useSettingsStore()
  const { setCar, setInput, resetCar, setHint, addCollision } = useSimulatorStore()

  useEffect(() => {
    resetCar(level.start)
    cameraRef.current = { x: level.start.x, y: level.start.y }
    savedRef.current = false
    setFinished(false)
  }, [level.id, level.start, resetCar])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') setInput({ throttle: true })
      if (e.code === 'KeyS' || e.code === 'ArrowDown') setInput({ brake: true })
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') setInput({ steerLeft: true })
      if (e.code === 'KeyD' || e.code === 'ArrowRight') setInput({ steerRight: true })
      if (e.code === 'KeyR') resetCar(level.start)
      if (e.code === 'KeyQ') useSimulatorStore.getState().setGear('R')
      if (e.code === 'KeyE') useSimulatorStore.getState().setGear('D')
    }
    const up = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') setInput({ throttle: false })
      if (e.code === 'KeyS' || e.code === 'ArrowDown') setInput({ brake: false })
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') setInput({ steerLeft: false })
      if (e.code === 'KeyD' || e.code === 'ArrowRight') setInput({ steerRight: false })
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [level.start, resetCar, setInput])

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    let cooldown = 0

    const frame = (now: number) => {
      const dtRaw = Math.min(0.033, (now - last) / 1000)
      last = now
      const store = useSimulatorStore.getState()
      const dt = store.comfortMode ? dtRaw * 0.72 : dtRaw

      if (!finished) {
        const next = updateCarPhysics(store.car, store.input, store.config, dt)
        const hit = detectCollision(next, store.config, level.obstacles)

        if (hit && cooldown <= 0) {
          addCollision()
          playSound('warning')
          cooldown = .8
          setHint(hit.type === 'curb' ? 'Бордюр близко — выровняй траекторию.' : 'Корпус машины близко к препятствию.')
        } else {
          setHint(getSoftHint(next, level.target))
        }

        cooldown -= dt
        setCar(hit ? { ...next, speed: 0 } : next)
        updateInstructor(level, next)

        if (isParked(next, store.config, level.target) && !savedRef.current) {
          savedRef.current = true
          const result = buildAttemptResult({
            level,
            car: next,
            config: store.config,
            collisions: store.collisions,
            maneuvers: store.maneuvers,
            startedAt: store.startedAt,
            maxSpeed: store.maxSpeed,
            completed: true
          })
          saveAttempt(result)
          playSound('success')
          setFinished(true)
          setTimeout(() => {
            window.location.href = `/results/${result.id}`
          }, 900)
        }
      }

      draw()
      raf = requestAnimationFrame(frame)
    }

    const draw = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const parent = canvas.parentElement
      const dpr = window.devicePixelRatio || 1
      const cssW = parent?.clientWidth || 940
      const cssH = parent?.clientHeight || 620

      if (canvas.width !== Math.floor(cssW * dpr) || canvas.height !== Math.floor(cssH * dpr)) {
        canvas.width = Math.floor(cssW * dpr)
        canvas.height = Math.floor(cssH * dpr)
        canvas.style.width = `${cssW}px`
        canvas.style.height = `${cssH}px`
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const store = useSimulatorStore.getState()
      const scale = scaleFor(cssW, cssH)
      const lookAhead = {
        x: store.car.x + Math.cos(store.car.angle) * .55,
        y: store.car.y + Math.sin(store.car.angle) * .55
      }
      cameraRef.current = {
        x: cameraRef.current.x + (lookAhead.x - cameraRef.current.x) * .055,
        y: cameraRef.current.y + (lookAhead.y - cameraRef.current.y) * .055
      }
      const cam = cameraRef.current

      drawAsphalt(ctx, cssW, cssH, cam, scale)
      drawScene(ctx, level, cssW, cssH, cam, scale)
      drawTarget(ctx, level.target, cssW, cssH, cam, scale)

      level.obstacles.forEach((obs) => drawObstacle(ctx, obs, cssW, cssH, cam, scale))

      if (settings.ideal) {
        drawPath(ctx, level.ideal, cssW, cssH, cam, scale, 'rgba(34,230,165,.88)', 4, [12, 12])
      }

      const predicted = predictTrajectory(store.car, store.input, store.config, 2.8, 34)

      if (settings.corridor) {
        ctx.save()
        ctx.globalAlpha = .08
        predicted.forEach((p, i) => {
          if (i % 7 !== 0) return
          drawPolygon(
            ctx,
            getCarCorners({ ...store.car, x: p.x, y: p.y, angle: p.angle }, store.config),
            cssW,
            cssH,
            cam,
            scale,
            '#3EA6FF'
          )
        })
        ctx.restore()
      }

      if (settings.trajectory) {
        drawPath(ctx, predicted, cssW, cssH, cam, scale, 'rgba(62,166,255,.96)', 5)
      }

      if (settings.ghost) {
        predicted.forEach((p, i) => {
          if (i % 24 !== 12) return
          drawCar(ctx, { x: p.x, y: p.y, angle: p.angle, steeringAngle: store.car.steeringAngle }, cssW, cssH, cam, scale, '#8A5CFF', .18)
        })
      }

      drawInstructor(ctx, level, cssW, cssH, cam, scale)
      drawCar(ctx, store.car, cssW, cssH, cam, scale, '#8A5CFF', 1)

      const foreground = ctx.createLinearGradient(0, 0, 0, cssH)
      foreground.addColorStop(0, 'rgba(8,11,19,.10)')
      foreground.addColorStop(.65, 'rgba(8,11,19,0)')
      foreground.addColorStop(1, 'rgba(8,11,19,.32)')
      ctx.fillStyle = foreground
      ctx.fillRect(0, 0, cssW, cssH)

      if (finished) {
        ctx.fillStyle = 'rgba(0,0,0,.50)'
        ctx.fillRect(0, 0, cssW, cssH)
        ctx.fillStyle = '#fff'
        ctx.font = '700 30px system-ui'
        ctx.textAlign = 'center'
        ctx.fillText('Вика, получилось красиво 💛', cssW / 2, cssH / 2)
      }
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [level, settings, setCar, setHint, addCollision, finished])

  return <canvas ref={canvasRef} className="block h-full w-full" />
}
