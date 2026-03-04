import ApartmentCard from './ApartmentCard'

function sortApartments(apartments, sort) {
  return [...apartments].sort((a, b) => {
    switch (sort) {
      case 'newest': return new Date(b.createdAt) - new Date(a.createdAt)
      case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt)
      case 'price_asc': return (Number(a.rent) || 0) - (Number(b.rent) || 0)
      case 'price_desc': return (Number(b.rent) || 0) - (Number(a.rent) || 0)
      case 'rating_desc': return (b.rating || 0) - (a.rating || 0)
      default: return 0
    }
  })
}

export default function ApartmentGrid({ apartments, filter, sort, onEdit, onDelete, onSelect }) {
  const filtered = filter === 'all' ? apartments : apartments.filter(a => a.status === filter)
  const sorted = sortApartments(filtered, sort)

  if (apartments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">🏠</div>
        <h2 className="text-xl font-semibold text-slate-700 mb-2">No apartments yet</h2>
        <p className="text-slate-500">Click "Add Apartment" to start tracking your search.</p>
      </div>
    )
  }

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-semibold text-slate-700 mb-2">No apartments match this filter</h2>
        <p className="text-slate-500">Try a different status filter.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
