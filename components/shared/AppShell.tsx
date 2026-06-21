import { AuthGuard } from '@/components/auth/AuthGuard'
import { V11Shell } from '@/components/v11/V11Shell'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <V11Shell>
        {children}
      </V11Shell>
    </AuthGuard>
  )
}
