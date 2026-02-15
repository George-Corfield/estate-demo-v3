import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { EQUIPMENT_TYPES, EQUIPMENT_STATUSES } from '../../data/machinery'
import { initialStaff } from '../../data/staff'

const FUEL_TYPES = ['Diesel', 'Petrol', 'N/A']

export default function MachineryCreateForm({ onCancel, onSave }) {
  const { addMachinery, showToast } = useApp()
  const [form, setForm] = useState({
    make: '',
    model: '',
    type: 'Tractor',
    year: new Date().getFullYear(),
    status: 'Available',
    serialNumber: '',
    purchaseDate: '',
    purchasePrice: '',
    currentValue: '',
    hours: '',
    fuelType: 'Diesel',
    location: '',
    assignedOperator: '',
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
      currentValue: parseFloat(form.currentValue) || parseFloat(form.purchasePrice) || 0,
      fuelType: form.fuelType,
      location: form.location || 'Main Barn',
      assignedOperator: form.assignedOperator || '',
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <button
          onClick={onCancel}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-3"
        >
          <span className="material-icons text-base">arrow_back</span>
          Cancel
        </button>
        <h2 className="text-lg font-bold text-slate-900">Add Equipment</h2>
        <p className="text-sm text-slate-500 mt-1">Register a new piece of machinery or equipment</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-5 space-y-5">
          {/* Required Fields */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Required Information
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Make" required>
                  <input
                    type="text"
                    value={form.make}
                    onChange={e => update('make', e.target.value)}
                    placeholder="e.g. John Deere"
                    className="form-input"
                    required
                  />
                </FormField>
                <FormField label="Model" required>
                  <input
                    type="text"
                    value={form.model}
                    onChange={e => update('model', e.target.value)}
                    placeholder="e.g. 6155R"
                    className="form-input"
                    required
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <FormField label="Type" required>
                  <select
                    value={form.type}
                    onChange={e => update('type', e.target.value)}
                    className="form-input"
                  >
                    {EQUIPMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </FormField>
                <FormField label="Year" required>
                  <input
                    type="number"
                    value={form.year}
                    onChange={e => update('year', e.target.value)}
                    min="1950"
                    max={new Date().getFullYear() + 1}
                    className="form-input"
                    required
                  />
                </FormField>
                <FormField label="Status" required>
                  <select
                    value={form.status}
                    onChange={e => update('status', e.target.value)}
                    className="form-input"
                  >
                    {EQUIPMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </FormField>
              </div>
            </div>
          </div>

          {/* Optional Fields */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Optional Details
            </h3>
            <div className="space-y-3">
              <FormField label="Serial Number">
                <input
                  type="text"
                  value={form.serialNumber}
                  onChange={e => update('serialNumber', e.target.value)}
                  placeholder="Manufacturer serial number"
                  className="form-input"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Purchase Date">
                  <input
                    type="date"
                    value={form.purchaseDate}
                    onChange={e => update('purchaseDate', e.target.value)}
                    className="form-input"
                  />
                </FormField>
                <FormField label="Operating Hours">
                  <input
                    type="number"
                    value={form.hours}
                    onChange={e => update('hours', e.target.value)}
                    placeholder="0"
                    className="form-input"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Purchase Cost (£)">
                  <input
                    type="number"
                    step="0.01"
                    value={form.purchasePrice}
                    onChange={e => update('purchasePrice', e.target.value)}
                    placeholder="0.00"
                    className="form-input"
                  />
                </FormField>
                <FormField label="Current Value (£)">
                  <input
                    type="number"
                    step="0.01"
                    value={form.currentValue}
                    onChange={e => update('currentValue', e.target.value)}
                    placeholder="0.00"
                    className="form-input"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Fuel Type">
                  <select
                    value={form.fuelType}
                    onChange={e => update('fuelType', e.target.value)}
                    className="form-input"
                  >
                    {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </FormField>
                <FormField label="Location">
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => update('location', e.target.value)}
                    placeholder="e.g. Main Barn"
                    className="form-input"
                  />
                </FormField>
              </div>

              <FormField label="Assigned Operator">
                <select
                  value={form.assignedOperator}
                  onChange={e => update('assignedOperator', e.target.value)}
                  className="form-input"
                >
                  <option value="">None</option>
                  {initialStaff.map(s => (
                    <option key={s.id} value={s.name}>{s.name} — {s.role}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Notes">
                <textarea
                  value={form.notes}
                  onChange={e => update('notes', e.target.value)}
                  placeholder="Additional information..."
                  rows={3}
                  className="form-input resize-none"
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="p-5 border-t border-slate-100 bg-white sticky bottom-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-sm font-bold text-emerald-950 bg-primary rounded-lg hover:bg-primary-dark transition-colors"
            >
              Add Equipment
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="mt-1 [&_.form-input]:w-full [&_.form-input]:px-3 [&_.form-input]:py-2 [&_.form-input]:border [&_.form-input]:border-slate-200 [&_.form-input]:rounded-lg [&_.form-input]:text-sm [&_.form-input]:focus:ring-2 [&_.form-input]:focus:ring-primary/30 [&_.form-input]:focus:border-primary [&_.form-input]:outline-none">
        {children}
      </div>
    </div>
  )
}
