import { STATUS_CONFIG, SORT_OPTIONS } from '../constants'

const FILTERS = [
  { value: 'all', label: 'All' },
  ...Object.entries(STATUS_CONFIG).map(([value, { label }]) => ({ value, label })),
]

export default function FilterBar({ filter, onFilterChange, sort, onSortChange, counts }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div className="border-b border-white/[0.06] bg-slate-950/50">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1 flex-wrap">
          {FILTERS.map(f => {
            const count = f.value === 'all' ? total : counts[f.value] || 0
            const isActive = filter === f.value
            return (
              <button
                key={f.value}
                onClick={() => onFilterChange(f.value)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 ring-1 ring-indigo-500/30'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                {f.label}
                <span className={`ml-1.5 text-xs tabular-nums ${isActive ? 'text-indigo-400' : 'text-slate-600'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <select
          value={sort}
          onChange={e => onSortChange(e.target.value)}
          className="text-sm text-slate-400 bg-transparent border border-slate-700/50 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-colors cursor-pointer"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value} className="bg-slate-900">{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
