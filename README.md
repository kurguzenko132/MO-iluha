# Для Ильи

Стабильная версия проекта.

## Что исправлено

- Конверт полностью перевёрстан.
- Клапан жёстко привязан к конверту и больше не улетает вверх.
- Текст после открытия появляется отдельной карточкой сверху.
- Нет наложения на заголовок.
- Нет кривых абсолютных позиций из прошлых версий.

## Важно

Если деплоишь поверх старого репозитория, сначала удали мусор:

```bash
rm -rf components lib store public
rm -f postcss.config.js postcss.config.mjs tailwind.config.ts tailwind.config.js
rm -f package-lock.json
```

## Запуск

```bash
npm install
npm run dev
npm run build
```
