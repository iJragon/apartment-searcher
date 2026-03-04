import { AMENITIES, STATUS_CONFIG } from '../constants'

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} className={`text-xl ${n <= rating ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
      ))}
    </div>
  )
}

export default function ApartmentDetail({ apartment, onEdit, onDelete, onClose }) {
  if (!apartment) return null

  const status = STATUS_CONFIG[apartment.status] || STATUS_CONFIG.considering
  const amenityLabels = AMENITIES.filter(a => apartment.amenities?.includes(a.key))

  function handleDelete() {
    if (window.confirm(`Delete "${apartment.name || 'this apartment'}"? This can't be undone.`)) {
      onDelete(apartment.id)
      onClose()
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${status.bgClass} mb-2`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
                {status.label}
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {apartment.name || 'Unnamed Apartment'}
              </h2>
              {apartment.address && (
                <p className="text-sm text-slate-500 mt-0.5">{apartment.address}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg flex-shrink-0 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Key stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {apartment.rent && (
              <div className="bg-indigo-50 rounded-xl p-3 col-span-2 sm:col-span-1">
                <p className="text-xs text-indigo-500 font-medium mb-0.5">Monthly Rent</p>
                <p className="text-2xl font-bold text-indigo-700">${Number(apartment.rent).toLocaleString()}</p>
              </div>
            )}
            {apartment.bedrooms && (
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500 font-medium mb-0.5">Beds</p>
                <p className="text-xl font-bold text-slate-800">{apartment.bedrooms}</p>
              </div>
            )}
            {apartment.bathrooms && (
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500 font-medium mb-0.5">Baths</p>
                <p className="text-xl font-bold text-slate-800">{apartment.bathrooms}</p>
              </div>
            )}
            {apartment.sqft && (
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500 font-medium mb-0.5">Sq Ft</p>
                <p className="text-xl font-bold text-slate-800">{Number(apartment.sqft).toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Rating */}
          {apartment.rating > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Rating</p>
              <Stars rating={apartment.rating} />
            </div>
          )}

          {/* Lease & contact */}
          {(apartment.leaseLength || apartment.moveInDate || apartment.contact) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {apartment.leaseLength && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Lease</p>
                  <p className="text-sm text-slate-800">{apartment.leaseLength}</p>
                </div>
              )}
              {apartment.moveInDate && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Move-in Date</p>
                  <p className="text-sm text-slate-800">
                    {new Date(apartment.moveInDate + 'T00:00:00').toLocaleDateString()}
                  </p>
                </div>
              )}
              {apartment.contact && (
                <div className="col-span-full">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Contact</p>
                  <p className="text-sm text-slate-800">{apartment.contact}</p>
                </div>
              )}
            </div>
          )}

          {/* Listing link */}
          {apartment.listingUrl && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Listing</p>
              <a
                href={apartment.listingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline break-all"
              >
                {apartment.listingUrl}
              </a>
            </div>
          )}

          {/* Pros & Cons */}
          {(apartment.pros?.length > 0 || apartment.cons?.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {apartment.pros?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-2">Pros</p>
                  <ul className="space-y-1.5">
                    {apartment.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {apartment.cons?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-rose-500 uppercase tracking-widest mb-2">Cons</p>
                  <ul className="space-y-1.5">
                    {apartment.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="text-rose-400 mt-0.5 flex-shrink-0">✕</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Amenities */}
          {amenityLabels.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {amenityLabels.map(a => (
                  <span key={a.key} className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-full">
                    {a.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {apartment.notes && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Notes</p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{apartment.notes}</p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center flex-shrink-0">
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => onEdit(apartment)}
            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            Edit
          </button>
        </div>

      </div>
    </>
  )
}
