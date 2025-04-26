export default function TeamCount() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 bg-white rounded-lg pl-10 pr-30 py-3">
        <img src="/src/assets/present.png" alt="Present icon" className="w-24 h-24" />
        <div>
          <p className="text-gray-500 text-sm">Total Teams Present Today</p>
          <p className="text-2xl font-semibold">124</p>
        </div>
      </div>
      <div className="flex items-center gap-3 bg-white rounded-lg pl-10 pr-30 py-3">
        <img src="/src/assets/absent.png" alt="Absent icon" className="w-24 h-24" />
        <div>
          <p className="text-gray-500 text-sm">Total Teams Absent Today</p>
          <p className="text-2xl font-semibold">38</p>
        </div>
      </div>
    </div>
  )
}
