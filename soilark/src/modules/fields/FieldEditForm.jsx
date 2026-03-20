import { useState } from 'react'
import { useApp } from '../../context/AppContext'

const SOIL_TYPES = ['Sandy', 'Clay', 'Loam', 'Silt', 'Peat', 'Chalk']
export default function FieldEditForm({ field, onCancel, onSave }) {
  const { updateField, showToast, usages } = useApp()
  const [form, setForm] = useState({
    name: field.name,
    usage: field.usage,
    sizeHectares: field.sizeHectares,
    soilType: field.soilType,
    scheme: field.scheme || 'None',
    livestock: field.livestock || '',
    description: field.description || '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    updateField(field.id, {
      ...form,
      sizeHectares: parseFloat(form.sizeHectares),
      sizeAcres: Math.round(parseFloat(form.sizeHectares) / 0.4047 * 10) / 10,
    })
    showToast(`${form.name} updated`)
    onSave()
  }

  const update = (key, value) => setForm({ ...form, [key]: value })

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }} className="flex flex-col gap-4">
      <h3 className="text-label" style={{ color: 'var(--color-slate-400)' }}>Edit Field</h3>

      <FormField label="Field Name">
        <input type="text" value={form.name} onChange={e => update('name', e.target.value)} required className="form-input" />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Usage">
          <select value={form.usage} onChange={e => update('usage', e.target.value)} className="form-select">
            {usages.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
          </select>
        </FormField>
        <FormField label="Size (ha)">
          <input type="number" step="0.1" value={form.sizeHectares} onChange={e => update('sizeHectares', e.target.value)} className="form-input" />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Soil Type">
          <select value={form.soilType} onChange={e => update('soilType', e.target.value)} className="form-select">
            {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
          </select>
        </FormField>
        <FormField label="Scheme">
          <select value={form.scheme} onChange={e => update('scheme', e.target.value)} className="form-select">
            {['None', 'CS', 'SFI'].map(s => <option key={s}>{s}</option>)}
          </select>
        </FormField>
      </div>

      <FormField label="Livestock">
        <input type="text" value={form.livestock} onChange={e => update('livestock', e.target.value)} className="form-input" />
      </FormField>

      <FormField label="Description">
        <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={3} className="form-textarea" />
      </FormField>

      <div className="flex gap-2 pt-2">
        <button type="submit" className="btn btn-primary flex-1">Save Changes</button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
      </div>
    </form>
  )
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {children}
    </div>
  )
}
