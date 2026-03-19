import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { EQUIPMENT_TYPES } from '../../data/machinery'

const MOCK_VEHICLES = [
  { make: 'John Deere',  model: '6155R',      type: 'Tractor',          year: 2021, serialNumber: 'JD6R-2021-8821' },
  { make: 'New Holland', model: 'T6.180',     type: 'Tractor',          year: 2020, serialNumber: 'NH-T6-2020-4432' },
  { make: 'Claas',       model: 'Axion 870',  type: 'Tractor',          year: 2022, serialNumber: 'CL-AX-2022-9901' },
  { make: 'Krone',       model: 'BiG M 450',  type: 'Forage Harvester', year: 2019, serialNumber: 'KR-BM-2019-3310' },
]

function mockLookup(registration) {
  const idx = registration.charCodeAt(0) % 4
  return { ...MOCK_VEHICLES[idx], registration }
}

function EditableCard({ label, value, onChange, isSelect }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const commit = () => {
    onChange(draft)
    setEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') { setDraft(value); setEditing(false) }
  }

  return (
    <div style={{
      background: 'var(--color-slate-50)',
      border: '1px solid var(--color-slate-200)',
      borderRadius: 8,
      padding: '12px 14px',
      position: 'relative',
      minHeight: 64,
    }}>
      <div style={{ fontSize: 11, color: 'var(--color-slate-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
      {editing ? (
        isSelect ? (
          <select
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            className="form-select"
            style={{ marginTop: 2, padding: '2px 6px', fontSize: 14 }}
          >
            {EQUIPMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        ) : (
          <input
            autoFocus
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            className="form-input"
            style={{ marginTop: 2, padding: '2px 6px', fontSize: 14 }}
          />
        )
      ) : (
        <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-slate-900)' }}>{value}</div>
      )}
      {!editing && (
        <button
          type="button"
          onClick={() => { setDraft(value); setEditing(true) }}
          style={{
            position: 'absolute', top: 8, right: 8,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-slate-400)', padding: 2, display: 'flex',
          }}
          title="Edit"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
        </button>
      )}
    </div>
  )
}

export default function MachineryCreateForm({ onCancel, onSave }) {
  const { addMachinery, showToast, staff } = useApp()
  const [phase, setPhase] = useState('method')
  const [regInput, setRegInput] = useState('')
  const [fields, setFields] = useState(null)
  const [optional, setOptional] = useState({ hours: '', operator: '' })

  const updateField = (key, value) => setFields(prev => ({ ...prev, [key]: value }))

  // Phase 1 — Route A: scan (simulated)
  const handleScan = () => {
    showToast('Reading plate...')
    setTimeout(() => {
      showToast('Vehicle details found', 'success')
      setTimeout(() => {
        setFields(mockLookup('SCAN-XXXX'))
        setPhase('review')
      }, 100)
    }, 1500)
  }

  // Phase 1 — Route B: enter registration
  const handleRegLookup = () => {
    const reg = regInput.trim().toUpperCase()
    if (!reg) return
    showToast('Vehicle details found', 'success')
    setTimeout(() => {
      setFields(mockLookup(reg))
      setPhase('review')
    }, 100)
  }

  const handleRegKeyDown = (e) => {
    if (e.key === 'Enter') handleRegLookup()
  }

  // Phase 3 — save
  const handleSave = () => {
    const hours = parseInt(optional.hours) || 0
    const equipment = {
      id: `mach-${Date.now()}`,
      name: `${fields.make} ${fields.model}`,
      make: fields.make,
      model: fields.model,
      type: fields.type,
      year: parseInt(fields.year),
      serialNumber: fields.serialNumber,
      numberPlate: fields.registration,
      status: 'Available',
      hours,
      assignedOperator: optional.operator || undefined,
      fuelType: 'Diesel',
      purchaseDate: null,
      purchasePrice: 0,
      currentValue: 0,
      lastServiceDate: null,
      nextServiceDue: hours + 250,
      serviceSchedule: { type: 'hours', interval: 250 },
      specifications: {},
      serviceHistory: [],
      documents: [],
      financialTransactions: [],
      history: [],
      notes: '',
    }
    addMachinery(equipment)
    showToast(`${fields.make} ${fields.model} added to fleet`, 'success')
    onSave()
  }

  // ── Phase 1: method selection ──────────────────────────────────────────────
  if (phase === 'method') {
    return (
      <div className="card flex flex-col gap-4">
        <h3 className="text-heading-4" style={{ color: 'var(--color-slate-900)', margin: 0 }}>Add Equipment</h3>
        <p style={{ color: 'var(--color-slate-500)', fontSize: 14, margin: 0 }}>
          Look up vehicle details automatically, or enter a registration number to get started.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* Option A */}
          <button
            type="button"
            onClick={handleScan}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 10, padding: '28px 16px',
              background: 'var(--color-slate-50)',
              border: '2px dashed var(--color-slate-300)',
              borderRadius: 10, cursor: 'pointer',
              color: 'var(--color-slate-700)',
              transition: 'border-color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'var(--color-slate-100)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-slate-300)'; e.currentTarget.style.background = 'var(--color-slate-50)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--color-primary)' }}>photo_camera</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Scan Serial Plate</div>
              <div style={{ fontSize: 12, color: 'var(--color-slate-500)', marginTop: 2 }}>Upload a photo of the plate</div>
            </div>
          </button>
          {/* Option B */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 10, padding: '28px 16px',
            background: 'var(--color-slate-50)',
            border: '1px solid var(--color-slate-200)',
            borderRadius: 10,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--color-slate-500)' }}>pin</span>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-slate-700)' }}>Enter Registration</div>
            <div style={{ display: 'flex', gap: 6, width: '100%' }}>
              <input
                type="text"
                value={regInput}
                onChange={e => setRegInput(e.target.value)}
                onKeyDown={handleRegKeyDown}
                placeholder="e.g. AB12 CDE"
                className="form-input"
                style={{ flex: 1, textTransform: 'uppercase' }}
              />
              <button type="button" onClick={handleRegLookup} className="btn btn-primary" style={{ padding: '0 10px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>search</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
        </div>
      </div>
    )
  }

  // ── Phase 2: review auto-filled fields ────────────────────────────────────
  if (phase === 'review') {
    return (
      <div className="card flex flex-col gap-4">
        <div>
          <h3 className="text-heading-4" style={{ color: 'var(--color-slate-900)', margin: 0 }}>Confirm Vehicle Details</h3>
          <p style={{ color: 'var(--color-slate-500)', fontSize: 13, marginTop: 4, marginBottom: 0 }}>
            Details retrieved automatically. Click the pencil icon to correct any field.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <EditableCard label="Make" value={fields.make} onChange={v => updateField('make', v)} />
          <EditableCard label="Model" value={fields.model} onChange={v => updateField('model', v)} />
          <EditableCard label="Registration" value={fields.registration} onChange={v => updateField('registration', v)} />
          <EditableCard label="Serial / VIN" value={fields.serialNumber} onChange={v => updateField('serialNumber', v)} />
          <EditableCard label="Machine Type" value={fields.type} onChange={v => updateField('type', v)} isSelect />
          <EditableCard label="Year" value={String(fields.year)} onChange={v => updateField('year', v)} />
        </div>

        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
          <button type="button" onClick={() => setPhase('optional')} className="btn btn-primary">Confirm Details</button>
        </div>
      </div>
    )
  }

  // ── Phase 3: optional fields ───────────────────────────────────────────────
  return (
    <div className="card flex flex-col gap-4">
      <div>
        <h3 className="text-heading-4" style={{ color: 'var(--color-slate-900)', margin: 0 }}>Operational Details</h3>
        <p style={{ color: 'var(--color-slate-500)', fontSize: 13, marginTop: 4, marginBottom: 0 }}>
          Optional — these can be updated later.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label className="form-label">Operating Hours</label>
          <input
            type="number"
            value={optional.hours}
            onChange={e => setOptional(prev => ({ ...prev, hours: e.target.value }))}
            placeholder="0"
            className="form-input"
            min="0"
          />
        </div>
        <div>
          <label className="form-label">Assigned Operator</label>
          <select
            value={optional.operator}
            onChange={e => setOptional(prev => ({ ...prev, operator: e.target.value }))}
            className="form-select"
          >
            <option value="">— None —</option>
            {staff.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
        <button type="button" onClick={handleSave} className="btn btn-primary">Save Machine</button>
      </div>
    </div>
  )
}
