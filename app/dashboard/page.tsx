export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col gap-4 p-6">
      <h1 className="text-3xl font-semibold">Вика, рада видеть тебя снова 🚗</h1>
      <p className="text-gray-300 max-w-lg">
        Сегодня можно просто 5 минут спокойно потренироваться. Без спешки. Без давления. Только практика.
      </p>
      <div className="flex gap-4">
        <a href="/practice" className="bg-accent-blue px-6 py-2 rounded-full shadow hover:opacity-90">
          Продолжить обучение
        </a>
        <a href="/practice" className="bg-gray-700 px-6 py-2 rounded-full shadow hover:opacity-75">
          Свободная практика
        </a>
      </div>
    </div>
  )
}
