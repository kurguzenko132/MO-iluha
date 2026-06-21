import SimulatorCanvas from '@/components/simulator/SimulatorCanvas'

export default function Simulator({ params }: { params: { levelId: string } }) {
  return (
    <div className="min-h-screen flex flex-col gap-4 p-4">
      <h1 className="text-xl font-semibold">Симулятор — уровень {params.levelId}</h1>
      <div className="flex-1 border border-gray-700 rounded-lg overflow-hidden">
        <SimulatorCanvas />
      </div>
    </div>
  )
}
