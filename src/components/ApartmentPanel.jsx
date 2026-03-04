import { useState, useEffect } from 'react'
import { AMENITIES, STATUS_CONFIG } from '../constants'

const DEFAULTS = {
  name: '',
  address: '',
  rent: '',
  bedrooms: '',
  bathrooms: '',
  sqft: '',
  amenities: [],
  pros: [],
  cons: [],
  notes: '',
  status: 'considering',
  rating: 0,
  listingUrl: '',
  moveInDate: '',
  leaseLength: '',
  contact: '',
}

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n === value ? 0 : n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="text-2xl leading-none transition-transform hover:scale-110"
        >
          <span className={(hovered || value) >= n ? 'text-amber-400' : 'text-slate-200'}>★</span>
        </button>
      ))}
    </div>
  )
}

function ListBuilder({ items, onChange, placeholder }) {
  const [input, setInput] = useState('')

  function add() {
    const trimmed = input.trim()
    if (trimmed) {
      onChange([...items, trimmed])
      setInput('')
    }
  }

  function remove(index) {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={add}
          disabled={!input.trim()}
          className="px-3 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-40 transition-colors"
        >
          Add
        </button>
      </div>
      {items.length > 0 && (
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-700">
              <span>{item}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-slate-400 hover:text-rose-500 transition-colors ml-2 flex-shrink-0 text-lg leading-none"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  )
}

const inputClass = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'

export default function ApartmentPanel({ apartment, onSave, onClose }) {
  const [form, setForm] = useState(DEFAULTS)
  const isNew = !apartment

  useEffect(() => {
    setForm(apartment ? { ...DEFAULTS, ...apartment } : DEFAULTS)
  }, [apartment])

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function toggleAmenity(key) {
    const current = form.amenities || []
    set('amenities', current.includes(key) ? current.filter(a => a !== key) : [...current, key])
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave(form)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-20" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-30 flex flex-col">
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-900">
            {isNew ? 'Add Apartment' : 'Edit Apartment'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-7">

            {/* Basic Info */}
            <section>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Basic Info</h3>
              <div className="space-y-3">
                <Field label="Nickname / Name">
                  <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder='e.g. "The Downtown One"' className={inputClass} />
                </Field>
                <Field label="Address">
                  <input type="text" value={form.address} onChange={e => set('address', e.target.value)}
                    placeholder="123 Main St, City, ST" className={inputClass} />
                </Field>
                <Field label="Listing URL">
                  <input type="url" value={form.listingUrl} onChange={e => set('listingUrl', e.target.value)}
                    placeholder="https://..." className={inputClass} />
                </Field>
              </div>
            </section>

            {/* Details */}
            <section>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Monthly Rent ($)">
                  <input type="number" value={form.rent} onChange={e => set('rent', e.target.value)}
                    placeholder="1800" min="0" className={inputClass} />
                </Field>
                <Field label="Sq Ft">
                  <input type="number" value={form.sqft} onChange={e => set('sqft', e.target.value)}
                    placeholder="850" min="0" className={inputClass} />
                </Field>
                <Field label="Bedrooms">
                  <input type="number" value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)}
                    placeholder="2" min="0" step="0.5" className={inputClass} />
                </Field>
                <Field label="Bathrooms">
                  <input type="number" value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)}
                    placeholder="1" min="0" step="0.5" className={inputClass} />
                </Field>
                <Field label="Move-in Date">
                  <input type="date" value={form.moveInDate} onChange={e => set('moveInDate', e.target.value)}
                    className={inputClass} />
                </Field>
                <Field label="Lease Length">
                  <input type="text" value={form.leaseLength} onChange={e => set('leaseLength', e.target.value)}
                    placeholder="12 months" className={inputClass} />
                </Field>
              </div>
              <div className="mt-3">
                <Field label="Contact">
                  <input type="text" value={form.contact} onChange={e => set('contact', e.target.value)}
                    placeholder="Landlord name, phone, email..." className={inputClass} />
                </Field>
              </div>
            </section>

            {/* Status & Rating */}
            <section>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Status & Rating</h3>
              <div className="space-y-3">
                <Field label="Status">
                  <select value={form.status} onChange={e => set('status', e.target.value)}
                    className={inputClass + ' bg-white'}>
                    {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </Field>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Rating</p>
                  <StarPicker value={form.rating} onChange={v => set('rating', v)} />
                </div>
              </div>
            </section>

            {/* Amenities */}
            <section>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {AMENITIES.map(a => (
                  <label key={a.key} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={form.amenities?.includes(a.key) || false}
                      onChange={() => toggleAmenity(a.key)}
                      className="w-4 h-4 accent-indigo-600 rounded"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900">{a.label}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Pros */}
            <section>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Pros</h3>
              <ListBuilder
                items={form.pros}
                onChange={v => set('pros', v)}
                placeholder="What do you like about it?"
              />
            </section>

            {/* Cons */}
            <section>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Cons</h3>
              <ListBuilder
                items={form.cons}
                onChange={v => set('cons', v)}
                placeholder="Any concerns or downsides?"
              />
            </section>

            {/* Notes */}
            <section>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Notes</h3>
              <textarea
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder="Anything else worth remembering..."
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </section>

          </div>

          {/* Sticky footer */}
          <div className="px-6 py-4 border-t border-slate-200 flex gap-3 bg-white">
            <button
              type="submit"
              className="flex-1 py-2.5 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {isNew ? 'Add Apartment' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
