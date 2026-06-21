export default function Simulator({ params }: { params: { levelId: string } }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold">Симулятор (уровень {params.levelId})</h1>
      <p className="text-gray-400">Тут будет Canvas с машиной и траекторией.</p>
    </div>
  )
}
