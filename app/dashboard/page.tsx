import { AppShell } from '@/components/shared/AppShell'
import { DashboardClient } from '@/components/dashboard/DashboardClient'

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardClient />
    </AppShell>
  )
}
