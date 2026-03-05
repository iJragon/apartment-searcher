import ApartmentCard from './ApartmentCard'

function sortApartments(apartments, sort) {
  return [...apartments].sort((a, b) => {
    switch (sort) {
      case 'newest':     return new Date(b.createdAt) - new Date(a.createdAt)
      case 'oldest':     return new Date(a.createdAt) - new Date(b.createdAt)
      case 'price_asc':  return (Number(a.rent) || 0) - (Number(b.rent) || 0)
      case 'price_desc': return (Number(b.rent) || 0) - (Number(a.rent) || 0)
      case 'rating_desc': return (b.rating || 0) - (a.rating || 0)
      default: return 0
    }
  })
}

export default function ApartmentGrid({ apartments, filter, sort, onEdit, onDelete, onSelect, canEdit = true, roomMode = false, onAdd }) {
  const filtered = filter === 'all' ? apartments : apartments.filter(a => a.status === filter)
  const sorted = sortApartments(filtered, sort)

  if (apartments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="text-5xl mb-4 opacity-20">🏠</div>
        <h2 className="text-base font-medium text-slate-400 mb-1">No apartments yet</h2>
        <p className="text-sm text-slate-600">
          {canEdit
            ? <>Hit <span className="text-slate-400">+ Add</span> to start tracking your search.</>
            : 'No apartments have been added to this room yet.'}
        </p>
        {canEdit && onAdd && roomMode && (
          <button onClick={onAdd} className="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors">
            + Add Apartment
          </button>
        )}
      </div>
    )
  }

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="text-4xl mb-4 opacity-20">🔍</div>
        <h2 className="text-base font-medium text-slate-400 mb-1">No results</h2>
        <p className="text-sm text-slate-600">No apartments match this filter.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {sorted.map(apt => (
        <ApartmentCard
          key={apt.id}
          apartment={apt}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={onSelect}
        />
      ))}
    </div>
  )
}
