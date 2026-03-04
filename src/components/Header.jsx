import { useRef } from 'react'

export default function Header({ count, onAdd, onExport, onImport }) {
  const fileInputRef = useRef(null)

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) {
      onImport(file)
      e.target.value = ''
    }
  }

  return (
    <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-white tracking-tight">
            🏠 Apartment Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {count} apartment{count !== 1 ? 's' : ''} saved
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            disabled={count === 0}
            className="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Export
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-all"
          >
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={onAdd}
            className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
          >
            + Add
          </button>
        </div>
      </div>
    </header>
  )
}
