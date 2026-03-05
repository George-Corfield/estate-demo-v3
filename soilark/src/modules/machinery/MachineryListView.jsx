import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { EQUIPMENT_CATEGORY_TABS, EQUIPMENT_STATUSES, MACHINERY_STATUS_COLORS } from '../../data/machinery'
import TabBar from '../../components/shared/TabBar'
import MachineryCreateForm from './MachineryCreateForm'

const TYPE_ICON_MAP = {
  Tractor: 'agriculture',
  'Combine Harvester': 'precision_manufacturing',
  'Fertilizer Spreader': 'scatter_plot',
  'Forage Harvester': 'grass',
  Seeder: 'yard',
  Mower: 'content_cut',
  Vehicle: 'directions_car',
  Other: 'build',
}

const TAB_TYPE_MAP = {
  Tractors: 'Tractor',
  Mowers: 'Mower',
  'Seeders/Drills': 'Seeder',
  Vehicles: 'Vehicle',
  Combines: 'Combine Harvester',
  Spreaders: 'Fertilizer Spreader',
}

const KNOWN_TYPES = new Set(Object.values(TAB_TYPE_MAP))

const CATEGORY_TABS = EQUIPMENT_CATEGORY_TABS.map(t => ({ id: t, label: t }))

function exportCSV(machinery) {
  const headers = ['Name', 'Type', 'Make', 'Model', 'Year', 'Status', 'Hours', 'Serial Number']
  const rows = machinery.map(m => [m.name, m.type, m.make, m.model, m.year, m.status, m.hours, m.serialNumber])
  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'machinery-inventory.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default function MachineryListView({ onEquipmentClick, showInlineCreate, setShowInlineCreate }) {
  const { machinery } = useApp()
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = useMemo(() => {
    let items = machinery

    // Category tab filter
    if (activeTab !== 'All') {
      const mappedType = TAB_TYPE_MAP[activeTab]
      if (activeTab === 'Other') {
        items = items.filter(m => !KNOWN_TYPES.has(m.type))
      } else if (mappedType) {
        items = items.filter(m => m.type === mappedType)
      }
    }

    // Status filter
    if (statusFilter !== 'All') {
      items = items.filter(m => m.status === statusFilter)
    }

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.make.toLowerCase().includes(q) ||
        m.model.toLowerCase().includes(q)
      )
    }

    return items
  }, [machinery, activeTab, search, statusFilter])

  // Stat strip counts
  const totalEquipment = machinery.length
  const servicesDue = machinery.filter(m => m.hours >= m.nextServiceDue).length
  const inMaintenance = machinery.filter(m => m.status === 'Maintenance').length
  const activeCount = machinery.filter(m => m.status === 'Active').length

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div style={{ padding: 'var(--content-padding)' }} className="flex flex-col gap-5 flex-1 overflow-y-auto custom-scrollbar">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-heading-2" style={{ color: 'var(--color-slate-900)', margin: 0 }}>Machinery & Equipment</h1>
          <button onClick={() => setShowInlineCreate(true)} className="btn btn-primary">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
            Add Equipment
          </button>
        </div>

        {/* Stat Strip */}
        <div className="grid grid-cols-4 gap-4">
          <div className="stat-card">
            <p className="text-label" style={{ color: 'var(--color-slate-400)', marginBottom: 4 }}>Total Equipment</p>
            <p className="text-data-large" style={{ color: 'var(--color-green-600)' }}>{totalEquipment}</p>
          </div>
          <div className="stat-card">
            <p className="text-label" style={{ color: 'var(--color-slate-400)', marginBottom: 4 }}>Services Due</p>
            <p className="text-data-large" style={{ color: servicesDue > 0 ? 'var(--color-amber-400)' : 'var(--color-green-600)' }}>{servicesDue}</p>
          </div>
          <div className="stat-card">
            <p className="text-label" style={{ color: 'var(--color-slate-400)', marginBottom: 4 }}>In Maintenance</p>
            <p className="text-data-large" style={{ color: inMaintenance > 0 ? 'var(--color-amber-400)' : 'var(--color-green-600)' }}>{inMaintenance}</p>
          </div>
          <div className="stat-card">
            <p className="text-label" style={{ color: 'var(--color-slate-400)', marginBottom: 4 }}>Active</p>
            <p className="text-data-large" style={{ color: 'var(--color-green-600)' }}>{activeCount}</p>
          </div>
        </div>

        {/* Category Tabs */}
        <TabBar tabs={CATEGORY_TABS} activeTab={activeTab} onChange={setActiveTab} />

        {/* Filter & Search Row */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by name, make or model…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-input"
            style={{ maxWidth: 280 }}
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: 160 }}
          >
            <option value="All">All Statuses</option>
            {EQUIPMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex-1" />
          <button onClick={() => exportCSV(machinery)} className="btn btn-ghost">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
            Export inventory
          </button>
        </div>

        {/* Inline Create Form (Pattern A) */}
        {showInlineCreate && (
          <MachineryCreateForm
            onCancel={() => setShowInlineCreate(false)}
            onSave={() => setShowInlineCreate(false)}
          />
        )}

        {/* Equipment Card List */}
        <div className="flex flex-col gap-3">
          {filtered.map(equipment => {
            const icon = TYPE_ICON_MAP[equipment.type] || 'build';
            const badgeClass = MACHINERY_STATUS_COLORS[equipment.status] || 'badge-neutral';
            const isOverdue = equipment.hours >= equipment.nextServiceDue;

            return (
              <div
                key={equipment.id}
                onClick={() => onEquipmentClick(equipment.id)}
                className="group flex items-center p-4 mb-2"
                style={{ 
                  cursor: 'pointer', 
                  background: 'white',
                  borderBottom: `1px solid var(--color-slate-100)`,
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-50)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'white' }}
              >
                {/* 1. Identity Column (The "What") */}
                <div className="flex items-center gap-4 w-1/3 min-w-[250px]">
                  <div style={{ width: 40, height: 40, borderRadius: '8px', background: 'var(--color-surface-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--color-slate-700)', fontSize: 20 }}>{icon}</span>
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-slate-900 m-0 leading-tight">{equipment.name}</p>
                    <p className="text-xs text-slate-500 m-0 uppercase tracking-wider">
                      {equipment.make} • {equipment.model}
                    </p>
                  </div>
                </div>

                {/* 2. Operational Column (The "Usage") - Centered */}
                <div className="flex-1 flex flex-col items-center border-x border-slate-100 px-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total Usage</span>
                  <div>
                    <span className="text-lg font-mono font-bold text-slate-900">{equipment.hours.toLocaleString()}</span>
                    <span className="text-[10px] ml-1 text-slate-400">HRS</span>
                  </div>
                </div>

                {/* 3. Maintenance Column (The "Deadline") - Centered */}
                <div className="flex-1 flex flex-col items-center px-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Next Service</span>
                  {equipment.nextServiceDue ? (
                    <span 
                      className="font-semibold" 
                      style={{ color: isOverdue ? 'var(--color-red-50)' : 'var(color-slate-900)' }}
                    >
                      {equipment.nextServiceDue.toLocaleString()} <small className="text-[9px]">HRS</small>
                    </span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </div>

                {/* 4. Status Column (The "Condition") - Right Aligned */}
                <div className="w-[120px] flex justify-end">
                  <span className={`badge ${badgeClass} shadow-sm`}>
                    {equipment.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-slate-400)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 36, marginBottom: 8, display: 'block' }}>inventory_2</span>
            <p className="text-body">No equipment found</p>
          </div>
        )}

        {filtered.length > 0 && (
          <p className="text-body-small" style={{ color: 'var(--color-slate-400)' }}>
            Showing {filtered.length} of {machinery.length} items
          </p>
        )}
      </div>
    </div>
  )
}
