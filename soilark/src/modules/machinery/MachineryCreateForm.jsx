import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { EQUIPMENT_TYPES, EQUIPMENT_STATUSES } from '../../data/machinery'

const FUEL_TYPES = ['Diesel', 'Petrol', 'N/A']

export default function MachineryCreateForm({ onCancel, onSave }) {
  const { addMachinery, showToast } = useApp()
  const [form, setForm] = useState({
    make: '',
    model: '',
    type: 'Tractor',
    year: new Date().getFullYear(),
    status: 'Active',
    serialNumber: '',
    numberPlate: '',
    purchaseDate: '',
    purchasePrice: '',
    hours: '',
    fuelType: 'Diesel',
    notes: '',
  })

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.make.trim() || !form.model.trim()) return

    const hours = parseInt(form.hours) || 0
    const equipment = {
      id: `mach-${Date.now()}`,
      name: `${form.make} ${form.model}`,
      type: form.type,
      make: form.make,
      model: form.model,
      year: parseInt(form.year),
      serialNumber: form.serialNumber || `${form.make.substring(0, 2).toUpperCase()}-${form.model.substring(0, 2).toUpperCase()}-${form.year}`,
      status: form.status,
      hours,
      purchaseDate: form.purchaseDate || null,
      purchasePrice: parseFloat(form.purchasePrice) || 0,
      currentValue: parseFloat(form.purchasePrice) || 0,
      fuelType: form.fuelType,
      numberPlate: form.numberPlate,
      lastServiceDate: null,
      nextServiceDue: hours + 250,
      specifications: {},
      serviceHistory: [],
      documents: [],
      financialTransactions: [],
      notes: form.notes,
    }

    addMachinery(equipment)
    showToast(`${equipment.name} added to fleet`)
    onSave()
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
      <h3 className="text-heading-4" style={{ color: 'var(--color-ink-900)', margin: 0 }}>Add Equipment</h3>

      {/* Required Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="form-label">Make *</label>
          <input type="text" value={form.make} onChange={e => update('make', e.target.value)} placeholder="e.g. John Deere" className="form-input" required />
        </div>
        <div>
          <label className="form-label">Model *</label>
          <input type="text" value={form.model} onChange={e => update('model', e.target.value)} placeholder="e.g. 6155R" className="form-input" required />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="form-label">Type *</label>
          <select value={form.type} onChange={e => update('type', e.target.value)} className="form-select">
            {EQUIPMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Year *</label>
          <input type="number" value={form.year} onChange={e => update('year', e.target.value)} min="1950" max={new Date().getFullYear() + 1} className="form-input" required />
        </div>
        <div>
          <label className="form-label">Status *</label>
          <select value={form.status} onChange={e => update('status', e.target.value)} className="form-select">
            {EQUIPMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Optional Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="form-label">Serial Number</label>
          <input type="text" value={form.serialNumber} onChange={e => update('serialNumber', e.target.value)} placeholder="Manufacturer serial number" className="form-input" />
        </div>
        <div>
          <label className="form-label">Number Plate</label>
          <input type="text" value={form.numberPlate} onChange={e => update('numberPlate', e.target.value)} placeholder="e.g. AB12 CDE" className="form-input" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="form-label">Purchase Date</label>
          <input type="date" value={form.purchaseDate} onChange={e => update('purchaseDate', e.target.value)} className="form-input" />
        </div>
        <div>
          <label className="form-label">Purchase Cost (£)</label>
          <input type="number" step="0.01" value={form.purchasePrice} onChange={e => update('purchasePrice', e.target.value)} placeholder="0.00" className="form-input" />
        </div>
        <div>
          <label className="form-label">Operating Hours</label>
          <input type="number" value={form.hours} onChange={e => update('hours', e.target.value)} placeholder="0" className="form-input" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="form-label">Fuel Type</label>
          <select value={form.fuelType} onChange={e => update('fuelType', e.target.value)} className="form-select">
            {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Notes</label>
          <input type="text" value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Additional information..." className="form-input" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  )
}
