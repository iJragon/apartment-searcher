import { STATUS_CONFIG, AMENITIES } from '../constants'

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} className={n <= rating ? 'text-amber-400' : 'text-slate-200'}>★</span>
      ))}
    </div>
  )
}

export default function ApartmentCard({ apartment, onEdit, onDelete, onClick }) {
  const status = STATUS_CONFIG[apartment.status] || STATUS_CONFIG.considering
  const amenityLabels = AMENITIES.filter(a => apartment.amenities?.includes(a.key)).slice(0, 4)

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
      className="bg-white rounded-xl border border-slate-200 p-5 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all group"
    >
      {/* Status + actions */}
      <div className="flex items-start justify-between mb-3">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${status.bgClass}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
          {status.label}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Name */}
      <h3 className="font-semibold text-slate-900 text-lg leading-tight mb-1">
        {apartment.name || 'Unnamed Apartment'}
      </h3>

      {/* Address */}
      {apartment.address && (
        <p className="text-sm text-slate-500 mb-3 truncate">{apartment.address}</p>
      )}

      {/* Rent */}
      {apartment.rent && (
        <p className="text-2xl font-bold text-indigo-600 mb-3">
          ${Number(apartment.rent).toLocaleString()}
          <span className="text-sm font-normal text-slate-400">/mo</span>
        </p>
      )}

      {/* Bed / bath / sqft */}
      {(apartment.bedrooms || apartment.bathrooms || apartment.sqft) && (
        <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
          {apartment.bedrooms && <span>{apartment.bedrooms} bed</span>}
          {apartment.bathrooms && <span>{apartment.bathrooms} bath</span>}
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
      {amenityLabels.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {amenityLabels.map(a => (
            <span key={a.key} className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full">
              {a.label}
            </span>
          ))}
          {apartment.amenities?.length > 4 && (
            <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-400 rounded-full">
              +{apartment.amenities.length - 4} more
            </span>
          )}
        </div>
      )}
    </div>
  )
}
