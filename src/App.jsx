import { useState } from 'react'
import { useApartments } from './hooks/useApartments'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import ApartmentGrid from './components/ApartmentGrid'
import ApartmentPanel from './components/ApartmentPanel'
import ApartmentDetail from './components/ApartmentDetail'

export default function App() {
  const { apartments, addApartment, updateApartment, deleteApartment, exportData, importData } = useApartments()
  const [panelOpen, setPanelOpen] = useState(false)
  const [editingApartment, setEditingApartment] = useState(null)
  const [detailApartment, setDetailApartment] = useState(null)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')

  function handleAdd() {
    setEditingApartment(null)
    setPanelOpen(true)
  }

  function handleEdit(apt) {
    setDetailApartment(null)
    setEditingApartment(apt)
    setPanelOpen(true)
  }

  function handleSave(data) {
    if (editingApartment) {
      updateApartment(editingApartment.id, data)
    } else {
      addApartment(data)
    }
    setPanelOpen(false)
    setEditingApartment(null)
  }

  function handleDelete(id) {
    deleteApartment(id)
    if (detailApartment?.id === id) setDetailApartment(null)
  }

  async function handleImport(file) {
    try {
      const count = await importData(file, 'merge')
      alert(`Imported ${count} apartment${count !== 1 ? 's' : ''} successfully.`)
    } catch (err) {
      alert('Import failed: ' + err.message)
    }
  }

  const counts = apartments.reduce((acc, apt) => {
    acc[apt.status] = (acc[apt.status] || 0) + 1
    return acc
  }, {})

  const liveDetailApartment = detailApartment
    ? apartments.find(a => a.id === detailApartment.id) ?? null
    : null

  return (
    <div className="min-h-screen">
      <Header
        count={apartments.length}
        onAdd={handleAdd}
        onExport={exportData}
        onImport={handleImport}
      />
      <FilterBar
        filter={filter}
        onFilterChange={setFilter}
        sort={sort}
        onSortChange={setSort}
        counts={counts}
      />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <ApartmentGrid
          apartments={apartments}
          filter={filter}
          sort={sort}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSelect={setDetailApartment}
        />
      </main>

      {panelOpen && (
        <ApartmentPanel
          apartment={editingApartment}
          onSave={handleSave}
          onClose={() => { setPanelOpen(false); setEditingApartment(null) }}
        />
      )}

      {liveDetailApartment && (
        <ApartmentDetail
          apartment={liveDetailApartment}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClose={() => setDetailApartment(null)}
        />
      )}
    </div>
  )
}
