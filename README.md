# 100 комплиментов для Вики

Финальная версия без Tailwind и PostCSS.

## Важно

В репозитории НЕ должно быть файлов:

- `postcss.config.js`
- `postcss.config.mjs`
- `tailwind.config.ts`
- `tailwind.config.js`

Иначе Vercel будет искать `tailwindcss` и сборка упадёт.

## Запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

## Vercel

- Framework Preset: Next.js
- Install Command: npm install
- Build Command: npm run build
- Output Directory: .next
