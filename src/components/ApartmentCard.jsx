import { STATUS_CONFIG, AMENITIES } from '../constants'

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} className={`text-sm ${n <= rating ? 'text-amber-400' : 'text-slate-700'}`}>★</span>
      ))}
    </div>
  )
}

export default function ApartmentCard({ apartment, onEdit, onDelete, onClick }) {
  const status = STATUS_CONFIG[apartment.status] ?? STATUS_CONFIG.considering
  const shownAmenities = AMENITIES.filter(a => apartment.amenities?.includes(a.key)).slice(0, 3)
  const extraCount = (apartment.amenities?.length ?? 0) - shownAmenities.length

  function handleEdit(e) {
    e.stopPropagation()
    onEdit(apartment)
  }

  function handleDelete(e) {
    e.stopPropagation()
    if (window.confirm(`Delete "${apartment.name || 'this apartment'}"?`)) {
      onDelete(apartment.id)
    }
  }

  return (
    <div
      onClick={() => onClick(apartment)}
      className="group relative bg-slate-900 border border-slate-800/60 rounded-xl p-5 cursor-pointer
        hover:border-indigo-500/30 hover:bg-slate-800/60 transition-all duration-200"
    >
      {/* Status + actions */}
      <div className="flex items-start justify-between mb-4">
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md ${status.bgClass}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
          {status.label}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-1.5 text-slate-600 hover:text-slate-300 hover:bg-white/5 rounded-lg transition-colors"
            title="Edit"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Delete"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Name */}
      <h3 className="font-semibold text-slate-100 leading-snug mb-1 truncate">
        {apartment.name || 'Unnamed Apartment'}
      </h3>

      {/* Address */}
      {apartment.address && (
        <p className="text-xs text-slate-500 mb-3 truncate">{apartment.address}</p>
      )}

      {/* Rent */}
      {apartment.rent ? (
        <p className="text-xl font-bold text-white mb-3">
          ${Number(apartment.rent).toLocaleString()}
          <span className="text-xs font-normal text-slate-500 ml-1">/mo</span>
        </p>
      ) : (
        <p className="text-sm text-slate-600 mb-3 italic">No price listed</p>
      )}

      {/* Bed / bath / sqft */}
      {(apartment.bedrooms || apartment.bathrooms || apartment.sqft) && (
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
          {apartment.bedrooms && <span>{apartment.bedrooms} bd</span>}
          {apartment.bathrooms && <span>{apartment.bathrooms} ba</span>}
          {apartment.sqft && <span>{Number(apartment.sqft).toLocaleString()} sqft</span>}
        </div>
      )}

      {/* Rating */}
      {apartment.rating > 0 && (
        <div className="mb-3">
          <Stars rating={apartment.rating} />
        </div>
      )}

      {/* Amenity pills */}
      {shownAmenities.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {shownAmenities.map(a => (
            <span key={a.key} className="px-2 py-0.5 text-xs bg-slate-800 text-slate-400 rounded-md">
              {a.label}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="px-2 py-0.5 text-xs bg-slate-800 text-slate-600 rounded-md">
              +{extraCount}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
