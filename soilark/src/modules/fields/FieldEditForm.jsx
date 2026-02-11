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
    sizeAcres: field.sizeAcres,
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
      sizeAcres: parseFloat(form.sizeAcres),
      sizeHectares: Math.round(parseFloat(form.sizeAcres) * 0.4047 * 10) / 10,
    })
    showToast(`${form.name} updated`)
    onSave()
  }

  const update = (key, value) => setForm({ ...form, [key]: value })

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-4">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Edit Field</h3>

      <FormField label="Field Name">
        <input type="text" value={form.name} onChange={e => update('name', e.target.value)} required className="input-field" />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Category">
          <select value={form.category} onChange={e => update('category', e.target.value)} className="input-field">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </FormField>
        <FormField label="Size (acres)">
          <input type="number" step="0.1" value={form.sizeAcres} onChange={e => update('sizeAcres', e.target.value)} className="input-field" />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Soil Type">
          <select value={form.soilType} onChange={e => update('soilType', e.target.value)} className="input-field">
            {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
          </select>
        </FormField>
        <FormField label="Drainage">
          <select value={form.drainage} onChange={e => update('drainage', e.target.value)} className="input-field">
            {DRAINAGE_OPTIONS.map(d => <option key={d}>{d}</option>)}
          </select>
        </FormField>
      </div>

      <FormField label="Current Crop">
        <input type="text" value={form.currentCrop} onChange={e => update('currentCrop', e.target.value)} className="input-field" />
      </FormField>

      <FormField label="Livestock">
        <input type="text" value={form.livestock} onChange={e => update('livestock', e.target.value)} className="input-field" />
      </FormField>

      <FormField label="Description">
        <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={3} className="input-field resize-none" />
      </FormField>

      <div className="flex gap-2 pt-2">
        <button type="submit" className="flex-1 py-2 bg-primary text-emerald-950 text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors">
          Save Changes
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
          Cancel
        </button>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          padding: 6px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: all 0.15s;
          margin-top: 4px;
        }
        .input-field:focus {
          border-color: #13ec13;
          box-shadow: 0 0 0 3px rgba(19, 236, 19, 0.15);
        }
      `}</style>
    </form>
  )
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 uppercase">{label}</label>
      {children}
    </div>
  )
}
