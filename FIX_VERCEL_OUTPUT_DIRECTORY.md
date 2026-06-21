# Исправление Vercel Output Directory

Ошибка:

```txt
Error: No Output Directory named "public" found after the Build completed.
```

Причина: в настройках Vercel указан Output Directory = `public`.

Для Next.js этого делать не нужно. Результат сборки находится в `.next`, а Vercel сам обслуживает Next.js приложение.

Что сделать в Vercel:

1. Открыть проект в Vercel.
2. Settings → Build and Deployment.
3. Output Directory очистить полностью или поставить `.next`.
4. Framework Preset: Next.js.
5. Build Command: `npm run build`.
6. Install Command: `npm install`.

В проект добавлен `vercel.json`:

```json
{
  "framework": "nextjs",
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```
