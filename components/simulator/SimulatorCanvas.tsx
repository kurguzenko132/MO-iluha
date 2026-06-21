'use client'
import { useRef, useEffect } from 'react'
import { Application, Graphics } from 'pixi.js'
import { useSimulatorStore } from '@/store/simulatorStore'
import { updateCarPhysics } from '@/lib/physics/carPhysics'

export default function SimulatorCanvas() {
  const ref = useRef<HTMLDivElement>(null)
  const { car, setCar, config } = useSimulatorStore()

  useEffect(() => {
    if (!ref.current) return
    const app = new Application<HTMLCanvasElement>({
      width: 800,
      height: 600,
      backgroundColor: 0x10131f,
      antialias: true
    })
    ref.current.appendChild(app.view as unknown as Node)

    // draw car
    const carGfx = new Graphics()
    carGfx.beginFill(0x8b5cf6)
    carGfx.drawRect(-config.length * 10 /2, -config.width*10/2, config.length*10, config.width*10)
    carGfx.endFill()
    app.stage.addChild(carGfx)

    let last = performance.now()
    const input = { throttle: false, brake: false, steerLeft: false, steerRight: false }

    const keyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') input.throttle = true
      if (e.code === 'ArrowDown' || e.code === 'KeyS') input.brake = true
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') input.steerLeft = true
      if (e.code === 'ArrowRight' || e.code === 'KeyD') input.steerRight = true
    }
    const keyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') input.throttle = false
      if (e.code === 'ArrowDown' || e.code === 'KeyS') input.brake = false
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') input.steerLeft = false
      if (e.code === 'ArrowRight' || e.code === 'KeyD') input.steerRight = false
    }
    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)

    app.ticker.add(() => {
      const now = performance.now()
      const dt = (now - last) / 1000
      last = now

      const next = updateCarPhysics(car, input, config, dt)
      setCar(next)
      carGfx.position.set(next.x * 10 + 400, 300 - next.y * 10)
      carGfx.rotation = next.angle
    })

    return () => {
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)
      app.destroy(true, { children: true })
    }
  }, [ref])

  return <div ref={ref} className="w-full h-full flex-1" />
}
