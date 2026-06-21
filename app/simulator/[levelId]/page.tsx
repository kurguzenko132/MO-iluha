import { AuthGuard } from '@/components/auth/AuthGuard'
import { getLevel, levels } from '@/lib/data/levels'
import { PremiumGameplayClient } from '@/components/simulator/PremiumGameplayClient'

type SimulatorPageProps = {
  params: Promise<{
    levelId: string
  }>
}

export function generateStaticParams() {
  return levels.map((level) => ({
    levelId: level.id
  }))
}

export default async function SimulatorPage({ params }: SimulatorPageProps) {
  const { levelId } = await params
  const level = getLevel(levelId)

  return (
    <AuthGuard>
      <PremiumGameplayClient level={level} />
    </AuthGuard>
  )
}
