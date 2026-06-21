import { AuthGuard } from '@/components/auth/AuthGuard'
import { ResultClient } from '@/components/results/ResultClient'
import { V11Shell } from '@/components/v11/V11Shell'

type ResultsPageProps = {
  params: Promise<{
    attemptId: string
  }>
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  await params

  return (
    <AuthGuard>
      <V11Shell withNav={false}>
        <ResultClient />
      </V11Shell>
    </AuthGuard>
  )
}
