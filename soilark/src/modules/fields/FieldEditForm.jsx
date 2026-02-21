import { useState } from 'react'
import { useApp } from '../../context/AppContext'

const SOIL_TYPES = ['Clay Loam', 'Sandy Loam', 'Silty Loam', 'Chalk', 'Peat', 'Loamy Sand', 'Sandy Clay', 'Heavy Clay']
const DRAINAGE_OPTIONS = ['Excellent', 'Good', 'Fair', 'Poor']
const CATEGORIES = ['Arable', 'Pastoral', 'Grassland', 'Forestry']

export default function FieldEditForm({ field, onCancel, onSave }) {
  const { updateField, showToast } = useApp()
  const [form, setForm] = useState({
    name: field.name,
    category: field.category,
    sizeHectares: field.sizeHectares,
    soilType: field.soilType,
    drainage: field.drainage,
    currentCrop: field.currentCrop || '',
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
      <h3 className="text-label" style={{ color: 'var(--color-earth-400)' }}>Edit Field</h3>

      <FormField label="Field Name">
        <input type="text" value={form.name} onChange={e => update('name', e.target.value)} required className="form-input" />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Category">
          <select value={form.category} onChange={e => update('category', e.target.value)} className="form-select">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
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
        <FormField label="Drainage">
          <select value={form.drainage} onChange={e => update('drainage', e.target.value)} className="form-select">
            {DRAINAGE_OPTIONS.map(d => <option key={d}>{d}</option>)}
          </select>
        </FormField>
      </div>

      <FormField label="Current Crop">
        <input type="text" value={form.currentCrop} onChange={e => update('currentCrop', e.target.value)} className="form-input" />
      </FormField>

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
