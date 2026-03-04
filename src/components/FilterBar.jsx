import { STATUS_CONFIG, SORT_OPTIONS } from '../constants'

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'considering', label: 'Considering' },
  { value: 'visited', label: 'Visited' },
  { value: 'top_pick', label: 'Top Pick' },
  { value: 'rejected', label: 'Rejected' },
]

export default function FilterBar({ filter, onFilterChange, sort, onSortChange, counts }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1 flex-wrap">
          {FILTERS.map(f => {
            const count = f.value === 'all' ? total : counts[f.value] || 0
            const isActive = filter === f.value
            return (
              <button
                key={f.value}
                onClick={() => onFilterChange(f.value)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {f.label}
                <span className={`ml-1.5 text-xs ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <select
          value={sort}
          onChange={e => onSortChange(e.target.value)}
          className="text-sm text-slate-600 border border-slate-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
