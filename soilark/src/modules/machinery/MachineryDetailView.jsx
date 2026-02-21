import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatGBP } from '../../utils/currency'
import { formatShortDate } from '../../utils/dates'
import TabBar from '../../components/shared/TabBar'
import { MACHINERY_STATUS_COLORS, SERVICE_TYPES } from '../../data/machinery'

const TABS = [
  { id: 'details', label: 'Details' },
  { id: 'service', label: 'Service' },
  { id: 'costs', label: 'Costs' },
  { id: 'documents', label: 'Documents' },
]

export default function MachineryDetailView({ equipmentId, onClose, onServiceDateClick }) {
  const { machinery, tasks, addServiceRecord, updateMachinery, showToast } = useApp()
  const [activeTab, setActiveTab] = useState('details')
  const [showServiceForm, setShowServiceForm] = useState(false)
  const navigate = useNavigate()

  const equipment = useMemo(() => machinery.find(m => m.id === equipmentId), [machinery, equipmentId])

  if (!equipment) return null

  const associatedTasks = tasks.filter(t =>
    t.assignedMachinery.includes(equipment.name)
  )

  const isOverdue = equipment.hours >= equipment.nextServiceDue
  const badgeClass = MACHINERY_STATUS_COLORS[equipment.status] || 'badge-neutral'

  // Cost calculations
  const transactions = equipment.financialTransactions || []
  const totalLifetimeCost = transactions.reduce((sum, t) => sum + t.amount, 0)
  const costPerHour = equipment.hours > 0 ? totalLifetimeCost / equipment.hours : 0

  const purchaseDate = equipment.purchaseDate ? new Date(equipment.purchaseDate) : null
  const monthsSincePurchase = purchaseDate
    ? Math.max(1, Math.round((Date.now() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)))
    : 1
  const monthlyAverage = totalLifetimeCost / monthsSincePurchase

  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  const annualCost = transactions
    .filter(t => new Date(t.date) >= oneYearAgo)
    .reduce((sum, t) => sum + t.amount, 0)

  // Cost breakdown by category
  const serviceCost = transactions.filter(t => t.category === 'Service' || t.category === 'Parts').reduce((s, t) => s + t.amount, 0)
  const fuelCost = transactions.filter(t => t.category === 'Fuel').reduce((s, t) => s + t.amount, 0)
  const insuranceCost = transactions.filter(t => t.category === 'Insurance').reduce((s, t) => s + t.amount, 0)

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Panel Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--color-parchment-300)',
        background: 'var(--color-parchment-100)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div className="flex items-start gap-3">
          <button
            onClick={onClose}
            className="btn btn-ghost shrink-0"
            style={{ padding: 4, marginTop: 2 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-earth-400)' }}>arrow_back</span>
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-heading-3" style={{ color: 'var(--color-ink-900)', margin: 0 }}>{equipment.name}</h2>
                <p className="text-body-small" style={{ color: 'var(--color-earth-500)', margin: 0 }}>
                  {equipment.make} {equipment.model} &middot; {equipment.year}
                </p>
              </div>
              <span className={`badge ${badgeClass}`}>{equipment.status}</span>
            </div>
          </div>
        </div>
      </div>

      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Details Tab */}
        {activeTab === 'details' && (
          <div style={{ padding: '0' }}>
            {/* Edit button */}
            <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost">Edit</button>
            </div>

            {/* Equipment section */}
            <FieldSection title="Equipment">
              <FieldRow label="Category" value={equipment.type} />
              <FieldRow label="Make" value={equipment.make} />
              <FieldRow label="Model" value={equipment.model} />
              <FieldRow label="Year" value={String(equipment.year)} />
              <FieldRow label="Serial Number" value={equipment.serialNumber} />
              <FieldRow label="Fuel Type" value={equipment.fuelType} />
              <FieldRow label="Status" value={equipment.status} />
              {equipment.notes && <FieldRow label="Notes" value={equipment.notes} />}
            </FieldSection>

            {/* Purchase & Financial section */}
            <FieldSection title="Purchase & Financial">
              <FieldRow label="Date Purchased" value={equipment.purchaseDate ? formatShortDate(equipment.purchaseDate) : '—'} />
              <FieldRow label="Purchase Price" value={formatGBP(equipment.purchasePrice)} />
              <FieldRow label="Current Value" value={formatGBP(equipment.currentValue)} />
              <FieldRow label="Depreciation" value={formatGBP(equipment.purchasePrice - equipment.currentValue)} />
            </FieldSection>

            {/* Specifications section */}
            {equipment.specifications && Object.keys(equipment.specifications).length > 0 && (
              <FieldSection title="Specifications">
                {Object.entries(equipment.specifications).map(([key, value]) => (
                  <FieldRow
                    key={key}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                    value={typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                    mono
                  />
                ))}
              </FieldSection>
            )}

            {/* Associated Tasks */}
            {associatedTasks.length > 0 && (
              <div style={{ padding: '16px' }}>
                <h3 className="text-label" style={{ color: 'var(--color-earth-400)', marginBottom: 12 }}>
                  Associated Tasks ({associatedTasks.length})
                </h3>
                <div className="flex flex-col gap-1">
                  {associatedTasks.map(task => (
                    <button
                      key={task.id}
                      onClick={() => navigate('/tasks', { state: { openTaskId: task.id } })}
                      className="w-full text-left flex items-center justify-between"
                      style={{
                        padding: '8px 12px',
                        background: 'var(--color-parchment-100)',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        color: 'var(--color-ink-900)',
                        transition: 'all 120ms ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(78,140,53,0.08)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-parchment-100)' }}
                    >
                      <span>{task.name}</span>
                      <span className="badge badge-neutral">
                        {task.status === 'todo' ? 'To Do' : task.status === 'inProgress' ? 'In Progress' : 'Done'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Service Tab */}
        {activeTab === 'service' && (
          <div style={{ padding: 16 }} className="flex flex-col gap-5">
            {/* Service Summary — field rows instead of stat cards */}
            <div style={{ border: '1px solid var(--color-parchment-300)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <FieldRow label="Current Hours" value={equipment.hours.toLocaleString()} mono />
              <FieldRow
                label="Next Service Due"
                value={`${equipment.nextServiceDue.toLocaleString()} hrs`}
                mono
                highlight={isOverdue}
              />
              <FieldRow
                label="Last Service"
                value={equipment.lastServiceDate ? formatShortDate(equipment.lastServiceDate) : '—'}
                mono
              />
            </div>

            {/* Record Service Button — above history */}
            <button
              onClick={() => setShowServiceForm(!showServiceForm)}
              className="btn btn-ghost"
              style={{ alignSelf: 'flex-start' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
              Record service
            </button>

            {/* Inline Service Form */}
            {showServiceForm && (
              <ServiceForm
                currentHours={equipment.hours}
                onSave={(record) => {
                  addServiceRecord(equipment.id, record)
                  updateMachinery(equipment.id, {
                    lastServiceDate: record.date,
                    hours: record.hoursAtService || equipment.hours,
                    nextServiceDue: (record.hoursAtService || equipment.hours) + 250,
                  })
                  setShowServiceForm(false)
                  showToast('Service record added')
                }}
                onCancel={() => setShowServiceForm(false)}
              />
            )}

            {/* Service History — card list instead of data-table */}
            <div>
              <h3 className="text-label mb-3" style={{ color: 'var(--color-earth-400)' }}>Service History</h3>
              {equipment.serviceHistory.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {equipment.serviceHistory.map(svc => (
                    <div
                      key={svc.id}
                      className="card"
                      style={{ padding: '12px 16px', cursor: 'pointer', transition: 'all var(--duration-fast) ease' }}
                      onClick={() => onServiceDateClick?.(svc.date)}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-parchment-200)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '' }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-heading-4" style={{ color: 'var(--color-ink-900)' }}>{svc.type}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-earth-400)', whiteSpace: 'nowrap' }}>
                          {formatShortDate(svc.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-earth-500)' }}>
                        {svc.hoursAtService && <span>{svc.hoursAtService.toLocaleString()} hrs</span>}
                        <span>{formatGBP(svc.cost)}</span>
                      </div>
                      {svc.notes && (
                        <p className="text-body-small" style={{ color: 'var(--color-earth-500)', marginTop: 4 }}>{svc.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-body" style={{ color: 'var(--color-earth-400)' }}>No service records</p>
              )}
            </div>
          </div>
        )}

        {/* Costs Tab */}
        {activeTab === 'costs' && (
          <div style={{ padding: 16 }} className="flex flex-col gap-5">
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="stat-card">
                <p className="text-label" style={{ color: 'var(--color-earth-400)', marginBottom: 4 }}>Lifetime Cost</p>
                <p className="text-data-large" style={{ color: 'var(--color-sage-600)' }}>{formatGBP(totalLifetimeCost)}</p>
              </div>
              <div className="stat-card">
                <p className="text-label" style={{ color: 'var(--color-earth-400)', marginBottom: 4 }}>Monthly Average</p>
                <p className="text-data-large" style={{ color: 'var(--color-sage-600)' }}>{formatGBP(monthlyAverage)}</p>
              </div>
              <div className="stat-card">
                <p className="text-label" style={{ color: 'var(--color-earth-400)', marginBottom: 4 }}>Annual Cost</p>
                <p className="text-data-large" style={{ color: 'var(--color-sage-600)' }}>{formatGBP(annualCost)}</p>
              </div>
              <div className="stat-card">
                <p className="text-label" style={{ color: 'var(--color-earth-400)', marginBottom: 4 }}>Cost per Hour</p>
                <p className="text-data-large" style={{ color: 'var(--color-sage-600)' }}>{formatGBP(costPerHour)}</p>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div>
              <h3 className="text-label mb-3" style={{ color: 'var(--color-earth-400)' }}>Cost Breakdown</h3>
              <div style={{ border: '1px solid var(--color-parchment-300)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <CostRow label="Service & Maintenance" value={serviceCost} />
                <CostRow label="Fuel" value={fuelCost} border />
                <CostRow label="Insurance" value={insuranceCost} border />
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div style={{ padding: 16 }} className="flex flex-col gap-3">
            {(equipment.documents || []).map((doc, i) => (
              <div
                key={i}
                className="flex items-center gap-3"
                style={{ padding: '10px 16px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-earth-400)' }}>description</span>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-ink-900)', margin: 0 }}>{doc.name}</p>
                  <p className="text-label-small" style={{ color: 'var(--color-earth-400)', margin: 0 }}>{doc.type}</p>
                </div>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-earth-400)', cursor: 'pointer' }}>download</span>
              </div>
            ))}
            <button className="btn btn-ghost" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
              Upload document
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* Field row component — label left, value right */
function FieldRow({ label, value, mono, highlight }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--color-parchment-200)',
      }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-earth-400)' }}>
        {label}
      </span>
      <span style={{
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
        fontSize: 13,
        color: highlight ? 'var(--color-ochre-400)' : 'var(--color-ink-900)',
        textAlign: 'end'
      }}>
        {value || '—'}
      </span>
    </div>
  )
}

/* Section divider with title */
function FieldSection({ title, children }) {
  return (
    <div>
      <div style={{ padding: '12px 16px', borderBottom: '2px solid var(--color-parchment-300)' }}>
        <h3 className="text-label" style={{ color: 'var(--color-earth-400)', margin: 0 }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

/* Cost breakdown row */
function CostRow({ label, value, border }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: '12px 16px',
        background: 'var(--color-parchment-100)',
        borderTop: border ? '1px solid var(--color-parchment-200)' : undefined,
      }}
    >
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-ink-900)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-ink-900)' }}>{formatGBP(value)}</span>
    </div>
  )
}

/* Inline service record form */
function ServiceForm({ currentHours, onSave, onCancel }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Regular Service',
    cost: '',
    notes: '',
    hoursAtService: String(currentHours),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      id: `svc-${Date.now()}`,
      date: form.date,
      type: form.type,
      cost: parseFloat(form.cost) || 0,
      notes: form.notes,
      hoursAtService: parseInt(form.hoursAtService) || currentHours,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-3">
      <h4 className="text-heading-4" style={{ color: 'var(--color-ink-900)', margin: 0 }}>Record Service</h4>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="form-label">Date</label>
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="form-input" required />
        </div>
        <div>
          <label className="form-label">Type</label>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="form-select">
            {SERVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Hours at Service</label>
          <input type="number" value={form.hoursAtService} onChange={e => setForm({ ...form, hoursAtService: e.target.value })} className="form-input" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="form-label">Cost</label>
          <input type="number" step="0.01" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} placeholder="0.00" className="form-input" required />
        </div>
        <div>
          <label className="form-label">Notes</label>
          <input type="text" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Work performed..." className="form-input" />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  )
}
