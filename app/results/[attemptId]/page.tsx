import { AppShell } from '@/components/shared/AppShell'
import { ResultClient } from '@/components/results/ResultClient'

type ResultsPageProps = {
  params: Promise<{
    attemptId: string
  }>
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  await params

  return (
    <AppShell>
      <ResultClient />
    </AppShell>
  )
}
