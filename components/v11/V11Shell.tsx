import Link from 'next/link'
import { BookOpen, Car, ChartNoAxesColumnIncreasing, Home, Settings } from 'lucide-react'

const nav = [
  { href: '/dashboard', label: 'Главная', icon: Home },
  { href: '/learn', label: 'Теория', icon: BookOpen },
  { href: '/practice', label: 'Практика', icon: Car },
  { href: '/progress', label: 'Прогресс', icon: ChartNoAxesColumnIncreasing },
  { href: '/settings', label: 'Настройки', icon: Settings }
]

export function V11Shell({ children, withNav = true }: { children: React.ReactNode; withNav?: boolean }) {
  return (
    <main className="v11-shell">
      <div className="v11-phone px-4 py-5 md:px-8">
        {children}
        {withNav && <V11BottomNav />}
      </div>
    </main>
  )
}

export function V11BottomNav() {
  return (
    <nav className="v11-glass sticky bottom-4 z-50 mt-6 grid grid-cols-5 rounded-[1.7rem] p-2">
      {nav.map((item, index) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 rounded-[1.35rem] px-2 py-3 text-xs text-soft transition hover:bg-white/8 hover:text-white ${index === 0 ? 'v11-pink-glow bg-pink/10 text-white' : ''}`}
          >
            <Icon size={22} />
            <span className="hidden sm:inline">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export function V11StatChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="v11-glass-soft flex items-center justify-center gap-3 rounded-[1.35rem] px-4 py-3 text-soft">
      <span className="text-pink">{icon}</span>
      <span>{label}</span>
      <b className="text-pink">{value}</b>
    </div>
  )
}

export function V11ActionButton({ children, href, onClick, variant = 'pink' }: { children: React.ReactNode; href?: string; onClick?: () => void; variant?: 'pink' | 'blue' | 'dark' }) {
  const cls = `inline-flex items-center justify-center rounded-[1.35rem] px-6 py-4 text-base font-semibold transition active:scale-[.98] ${
    variant === 'pink'
      ? 'bg-gradient-to-r from-pink/80 via-violet/70 to-sky/70 text-white v11-pink-glow'
      : variant === 'blue'
        ? 'bg-sky/10 text-white v11-blue-glow'
        : 'v11-glass-soft text-soft'
  }`

  if (href) return <Link href={href} className={cls}>{children}</Link>
  return <button onClick={onClick} className={cls}>{children}</button>
}
