export interface CarState {
  x: number
  y: number
  angle: number      // radians
  speed: number      // m/s
  steeringAngle: number // radians
  gear: 'D' | 'R'
}

export interface CarConfig {
  length: number      // m
  width: number       // m
  wheelBase: number   // m
  maxSteeringAngle: number // rad
  maxForwardSpeed: number  // m/s
  maxReverseSpeed: number  // m/s
  acceleration: number     // m/s2
  brakePower: number       // m/s2
}

export interface CarInput {
  throttle: boolean
  brake: boolean
  steerLeft: boolean
  steerRight: boolean
}

export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

// simple bicycle model
export function updateCarPhysics(
  state: CarState,
  input: CarInput,
  config: CarConfig,
  dt: number
): CarState {
  // 1. update steering
  let steering = state.steeringAngle
  const steerRate = config.maxSteeringAngle * 2 // rad per second
  if (input.steerLeft) steering += steerRate * dt
  if (input.steerRight) steering -= steerRate * dt
  steering = clamp(steering, -config.maxSteeringAngle, config.maxSteeringAngle)

  // 2. update speed
  let speed = state.speed
  const accel = (state.gear === 'D' ? 1 : -1) * config.acceleration
  const maxSpeed = state.gear === 'D' ? config.maxForwardSpeed : -config.maxReverseSpeed
  if (input.throttle) speed = clamp(speed + accel * dt, -config.maxReverseSpeed, config.maxForwardSpeed)
  if (input.brake) {
    const dec = config.brakePower * dt * Math.sign(speed)
    if (Math.abs(speed) < Math.abs(dec)) speed = 0
    else speed -= dec
  }
  speed = clamp(speed, -config.maxReverseSpeed, config.maxForwardSpeed)

  // 3. kinematics
  const beta = Math.atan((config.wheelBase / 2) * Math.tan(steering) / config.wheelBase)
  const dx = speed * Math.cos(state.angle + beta) * dt
  const dy = speed * Math.sin(state.angle + beta) * dt
  const dAngle = (speed / config.wheelBase) * Math.tan(steering) * dt

  return {
    ...state,
    x: state.x + dx,
    y: state.y + dy,
    angle: state.angle + dAngle,
    speed,
    steeringAngle: steering
  }
}

export interface TrajectoryPoint {
  x: number
  y: number
  angle: number
}

export function predictTrajectory(
  current: CarState,
  input: CarInput,
  config: CarConfig,
  seconds = 2,
  fps = 60
): TrajectoryPoint[] {
  const ghost: CarState = { ...current }
  const pts: TrajectoryPoint[] = []
  const steps = seconds * fps
  const dt = 1 / fps
  for (let i = 0; i < steps; i++) {
    const next = updateCarPhysics(ghost, input, config, dt)
    pts.push({ x: next.x, y: next.y, angle: next.angle })
    Object.assign(ghost, next)
  }
  return pts
}
