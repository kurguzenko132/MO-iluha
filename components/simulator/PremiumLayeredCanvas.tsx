'use client'

import { RealParkingCanvas } from '@/components/simulator/RealParkingCanvas'
import type { ParkingLevel } from '@/lib/data/levels'

export function PremiumLayeredCanvas({ level }: { level: ParkingLevel }) {
  return <RealParkingCanvas level={level} />
}
