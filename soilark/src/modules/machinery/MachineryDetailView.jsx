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
  { id: 'financials', label: 'Costs & Expenses' },
  { id: 'documents', label: 'Documents' },
]

const STATUS_OPTIONS = ['Available', 'In Use', 'Maintenance', 'Barn/Stored', 'Sold']

const DOC_ICONS = {
  certificate: 'verified',
  manual: 'menu_book',
  record: 'description',
}

export default function MachineryDetailView({ equipmentId, onBack }) {
  const { machinery, tasks, updateMachinery, addServiceRecord, showToast } = useApp()
  const [activeTab, setActiveTab] = useState('details')
  const [showServiceForm, setShowServiceForm] = useState(false)
  const navigate = useNavigate()

  const equipment = useMemo(() => machinery.find(m => m.id === equipmentId), [machinery, equipmentId])

  if (!equipment) return null

  const associatedTasks = tasks.filter(t =>
    t.assignedMachinery.includes(equipment.name)
  )

  const handleStatusChange = (newStatus) => {
    updateMachinery(equipment.id, { status: newStatus })
    showToast(`Status updated to ${newStatus}`)
  }

  const totalLifetimeCost = (equipment.financialTransactions || []).reduce((sum, t) => sum + t.amount, 0)
  const costPerHour = equipment.hours > 0 ? totalLifetimeCost / equipment.hours : 0
  const isOverdue = equipment.hours >= equipment.nextServiceDue

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-3"
        >
          <span className="material-icons text-base">arrow_back</span>
          Back to machinery
        </button>

        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">{equipment.name}</h2>
            <p className="text-sm text-slate-500">{equipment.make} {equipment.model} &middot; {equipment.year}</p>
          </div>
          <MachineryStatusBadge status={equipment.status} />
        </div>

        {/* Status changer */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                equipment.status === s
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="p-5 space-y-5">
            {/* Basic Info */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Equipment Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <PropItem label="Category" value={equipment.type} />
                <PropItem label="Serial Number" value={equipment.serialNumber} />
                <PropItem label="Fuel Type" value={equipment.fuelType} />
                <PropItem label="Operating Hours" value={`${equipment.hours.toLocaleString()} hrs`} />
                <PropItem label="Location" value={equipment.location} />
                <PropItem label="Assigned Operator" value={equipment.assignedOperator} />
              </div>
            </div>

            {/* Purchase & Financial */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Purchase & Value</h3>
              <div className="grid grid-cols-2 gap-3">
                <PropItem label="Date Purchased" value={formatShortDate(equipment.purchaseDate)} />
                <PropItem label="Purchase Price" value={formatGBP(equipment.purchasePrice)} />
                <PropItem label="Current Value" value={formatGBP(equipment.currentValue)} />
                <PropItem label="Depreciation" value={formatGBP(equipment.purchasePrice - equipment.currentValue)} />
              </div>
            </div>

            {/* Specifications */}
            {equipment.specifications && Object.keys(equipment.specifications).length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(equipment.specifications).map(([key, value]) => (
                    <PropItem
                      key={key}
                      label={key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                      value={typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Associated Tasks */}
            {associatedTasks.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Associated Tasks ({associatedTasks.length})
                </h3>
                <div className="space-y-1">
                  {associatedTasks.map(task => (
                    <button
                      key={task.id}
                      onClick={() => navigate('/tasks', { state: { openTaskId: task.id } })}
                      className="w-full text-left text-sm text-slate-700 py-2 px-3 bg-slate-50 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors flex items-center justify-between"
                    >
                      <span>{task.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-medium">
                        {task.status === 'todo' ? 'To Do' : task.status === 'inProgress' ? 'In Progress' : 'Done'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {equipment.notes && (
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notes</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{equipment.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Service Tab */}
        {activeTab === 'service' && (
          <div className="p-5 space-y-5">
            {/* Service Status */}
            <div className={`p-4 rounded-xl border ${isOverdue ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'}`}>
              <div className="flex items-center gap-3">
                <span className={`material-icons text-2xl ${isOverdue ? 'text-red-500' : 'text-emerald-500'}`}>
                  {isOverdue ? 'warning' : 'check_circle'}
                </span>
                <div>
                  <p className={`text-sm font-bold ${isOverdue ? 'text-red-800' : 'text-emerald-800'}`}>
                    {isOverdue ? 'Service Overdue' : 'Service Up to Date'}
                  </p>
                  <p className={`text-xs ${isOverdue ? 'text-red-600' : 'text-emerald-600'}`}>
                    Current: {equipment.hours.toLocaleString()} hrs &middot; Next due: {equipment.nextServiceDue.toLocaleString()} hrs
                    {!isOverdue && ` &middot; In ${(equipment.nextServiceDue - equipment.hours).toLocaleString()} hours`}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <PropItem label="Current Hours" value={`${equipment.hours.toLocaleString()}`} />
              <PropItem label="Next Service Due" value={`${equipment.nextServiceDue.toLocaleString()} hrs`} />
              <PropItem label="Last Service" value={formatShortDate(equipment.lastServiceDate)} />
            </div>

            {/* Record Service Button */}
            <button
              onClick={() => setShowServiceForm(!showServiceForm)}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-emerald-950 rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors"
            >
              <span className="material-icons text-sm">add</span>
              Record Service
            </button>

            {/* Inline Service Form */}
            {showServiceForm && (
              <ServiceForm
                equipmentId={equipment.id}
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

            {/* Service History */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Service Record</h3>
              <div className="space-y-0">
                {equipment.serviceHistory.map((svc, i) => (
                  <div key={svc.id} className="flex gap-4 pb-6 relative">
                    {/* Timeline connector */}
                    {i < equipment.serviceHistory.length - 1 && (
                      <div className="absolute left-[11px] top-8 bottom-0 w-px bg-slate-200" />
                    )}
                    <div className="shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="material-icons text-primary text-xs">build</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm font-semibold text-slate-800">{svc.type}</p>
                        <span className="text-xs text-slate-400">{formatShortDate(svc.date)}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-1">{svc.notes}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        {svc.hoursAtService && <span>{svc.hoursAtService.toLocaleString()} hrs</span>}
                        <span>{formatGBP(svc.cost)}</span>
                        <span>{svc.technician}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Financials Tab */}
        {activeTab === 'financials' && (
          <div className="p-5 space-y-5">
            {/* Cost Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Total Lifetime Cost</p>
                <p className="text-xl font-bold text-slate-900">{formatGBP(totalLifetimeCost)}</p>
                <p className="text-xs text-slate-400 mt-1">Purchase: {formatGBP(equipment.purchasePrice)}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Cost Per Hour</p>
                <p className="text-xl font-bold text-slate-900">{formatGBP(costPerHour)}</p>
                <p className="text-xs text-slate-400 mt-1">{equipment.hours.toLocaleString()} hrs logged</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Next Service Est.</p>
                <p className="text-xl font-bold text-slate-900">
                  {equipment.serviceHistory.length > 0
                    ? formatGBP(equipment.serviceHistory[0].cost)
                    : '—'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {isOverdue ? 'Overdue' : `In ${(equipment.nextServiceDue - equipment.hours).toLocaleString()} hrs approx.`}
                </p>
              </div>
            </div>

            {/* Linked Transactions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Linked Transactions</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider py-2">Date</th>
                    <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider py-2">Category</th>
                    <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider py-2">Description</th>
                    <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider py-2">Provider</th>
                    <th className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(equipment.financialTransactions || []).map((txn, i) => (
                    <tr key={i} className="border-b border-slate-50">
                      <td className="py-3 text-sm text-slate-600">{formatShortDate(txn.date)}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                          txn.category === 'Fuel' ? 'bg-amber-100 text-amber-700'
                          : txn.category === 'Parts' ? 'bg-blue-100 text-blue-700'
                          : txn.category === 'Insurance' ? 'bg-purple-100 text-purple-700'
                          : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {txn.category}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-slate-600">{txn.description}</td>
                      <td className="py-3 text-sm text-slate-500">{txn.provider}</td>
                      <td className="py-3 text-sm font-medium text-slate-800 text-right">{formatGBP(txn.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="p-5 space-y-5">
            {/* Serial Plate Photo */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Serial Plate Photo</h3>
              <div className="w-full h-48 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                <span className="material-icons text-3xl mb-2">add_a_photo</span>
                <p className="text-sm">Upload serial plate photo</p>
              </div>
            </div>

            {/* Document Repository */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Document Repository</h3>
              <div className="space-y-2">
                {(equipment.documents || []).map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <span className="material-icons text-primary text-xl">
                      {DOC_ICONS[doc.type] || 'description'}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{doc.name}</p>
                      <p className="text-xs text-slate-400">{formatShortDate(doc.date)}</p>
                    </div>
                    <span className="material-icons text-slate-300 text-sm">chevron_right</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Internal Asset ID */}
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Internal Asset ID</p>
              <p className="text-sm font-mono text-slate-600">{equipment.id.toUpperCase()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MachineryStatusBadge({ status }) {
  const colors = MACHINERY_STATUS_COLORS[status] || MACHINERY_STATUS_COLORS['Available']
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.dot }} />
      {status}
    </span>
  )
}

function PropItem({ label, value }) {
  return (
    <div className="p-3 bg-slate-50 rounded-lg">
      <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value || '—'}</p>
    </div>
  )
}

function ServiceForm({ equipmentId, currentHours, onSave, onCancel }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Regular Service',
    cost: '',
    technician: '',
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
      technician: form.technician,
      notes: form.notes,
      hoursAtService: parseInt(form.hoursAtService) || currentHours,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
      <h4 className="text-sm font-bold text-slate-800">Record Service</h4>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
            required
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase">Service Type</label>
          <select
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
            className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
          >
            {SERVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase">Hours at Service</label>
          <input
            type="number"
            value={form.hoursAtService}
            onChange={e => setForm({ ...form, hoursAtService: e.target.value })}
            className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase">Cost</label>
          <input
            type="number"
            step="0.01"
            value={form.cost}
            onChange={e => setForm({ ...form, cost: e.target.value })}
            placeholder="0.00"
            className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
            required
          />
        </div>
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase">Technician</label>
        <input
          type="text"
          value={form.technician}
          onChange={e => setForm({ ...form, technician: e.target.value })}
          placeholder="Name or company"
          className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
          required
        />
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase">Notes</label>
        <textarea
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
          placeholder="Work performed..."
          rows={2}
          className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-emerald-950 text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors"
        >
          Save Record
        </button>
      </div>
    </form>
  )
}
