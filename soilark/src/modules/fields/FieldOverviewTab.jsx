import { useState } from 'react'
import { useApp } from '../../context/AppContext'

const SOIL_TYPES = ['Sandy', 'Clay', 'Loam', 'Silt', 'Peat', 'Chalk']
const SCHEMES = ['None', 'CS', 'SFI']

export default function FieldOverviewTab({ field }) {
  const { usages, updateField, showToast } = useApp()

  const handleSave = (key, value) => {
    const updates = { [key]: value }
    if (key === 'sizeHectares') {
      const ha = parseFloat(value)
      updates.sizeHectares = ha
      updates.sizeAcres = Math.round(ha / 0.4047 * 10) / 10
    }
    updateField(field.id, updates)
    showToast(`${field.name} updated`)
  }

  return (
    <div style={{ padding: 20 }} className="flex flex-col gap-6">
      {/* Properties grid */}
      <div>
        <h3 className="text-label mb-3" style={{ color: 'var(--color-slate-600)' }}>Properties</h3>
        <div className="grid grid-cols-2 gap-3">
          <PropItem
            label="Usage"
            value={field.usage}
            fieldKey="usage"
            onSave={handleSave}
            editControl="select"
            options={usages.map(u => u.name)}
          />
          <PropItem
            label="Size"
            value={`${field.sizeHectares} ha`}
            fieldKey="sizeHectares"
            onSave={handleSave}
            editControl="number"
            rawValue={field.sizeHectares}
          />
          <PropItem
            label="Soil Type"
            value={field.soilType}
            fieldKey="soilType"
            onSave={handleSave}
            editControl="select"
            options={SOIL_TYPES}
          />
          <PropItem
            label="Scheme"
            value={field.scheme || '—'}
            fieldKey="scheme"
            onSave={handleSave}
            editControl="select"
            options={SCHEMES}
          />
          <PropItem
            label="Livestock"
            value={field.livestock || '—'}
            fieldKey="livestock"
            onSave={handleSave}
            editControl="text"
            rawValue={field.livestock || ''}
          />
        </div>
      </div>

      {/* Description */}
      {field.description && (
        <div>
          <h3 className="text-label mb-2" style={{ color: 'var(--color-slate-600)' }}>Description</h3>
          <p className="text-body" style={{ color: 'var(--color-slate-900)' }}>{field.description}</p>
        </div>
      )}

    </div>
  )
}

function PropItem({ label, value, mono, fieldKey, onSave, editControl, options, rawValue }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const startEdit = () => {
    setDraft(rawValue !== undefined ? rawValue : value)
    setEditing(true)
  }

  const handleSave = () => {
    onSave(fieldKey, draft)
    setEditing(false)
  }

  const handleCancel = () => {
    setEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') handleCancel()
  }

  if (editing) {
    return (
      <div style={{ padding: 12, background: 'var(--color-slate-100)', borderRadius: 'var(--radius-md)' }}>
        <p className="text-label" style={{ color: 'var(--color-slate-600)', marginBottom: 4 }}>{label}</p>
        <div className="flex items-center gap-2">
          {editControl === 'select' ? (
            <select
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              className="form-select flex-1"
              style={{ padding: '4px 8px', fontSize: 13 }}
              autoFocus
            >
              {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : editControl === 'number' ? (
            <input
              type="number"
              step="0.1"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              className="form-input flex-1"
              style={{ padding: '4px 8px', fontSize: 13 }}
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              className="form-input flex-1"
              style={{ padding: '4px 8px', fontSize: 13 }}
              autoFocus
            />
          )}
          <button
            onClick={handleSave}
            className="btn btn-ghost"
            style={{ padding: 2, lineHeight: 1 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-green-600)' }}>check</span>
          </button>
          <button
            onClick={handleCancel}
            className="btn btn-ghost"
            style={{ padding: 2, lineHeight: 1 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-slate-400)' }}>close</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: 12, background: 'var(--color-slate-100)', borderRadius: 'var(--radius-md)', position: 'relative' }}>
      <p className="text-label" style={{ color: 'var(--color-slate-600)', marginBottom: 4 }}>{label}</p>
      <p className={mono ? 'text-data' : 'text-body'} style={{ color: 'var(--color-slate-900)', fontWeight: 500, margin: 0 }}>{value}</p>
      {onSave && (
        <button
          onClick={startEdit}
          className="btn btn-ghost"
          style={{ position: 'absolute', top: 8, right: 8, padding: 2, lineHeight: 1, opacity: 0.5, transition: 'opacity 120ms ease' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '0.5' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit</span>
        </button>
      )}
    </div>
  )
}
