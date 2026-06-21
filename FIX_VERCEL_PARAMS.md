# Исправление ошибки Next.js 15 params Promise

Vercel падал на:

```txt
Type error: Type '{ params: { levelId: string; }; }' does not satisfy the constraint 'PageProps'
```

Причина: в Next.js 15 `params` в App Router dynamic routes является `Promise`.

Исправлено:

```tsx
type SimulatorPageProps = {
  params: Promise<{ levelId: string }>
}

export default async function SimulatorPage({ params }: SimulatorPageProps) {
  const { levelId } = await params
}
```

Также добавлен `generateStaticParams()` для уровней симулятора.
