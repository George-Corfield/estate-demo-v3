import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { formatGBP } from '../../utils/currency'
import { EQUIPMENT_CATEGORY_TABS, MACHINERY_STATUS_COLORS } from '../../data/machinery'

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

function getMaintenanceProgress(equipment) {
  const { hours, nextServiceDue, serviceHistory } = equipment
  if (!nextServiceDue) return null
  const lastServiceHours = serviceHistory.length > 0 ? serviceHistory[0].hoursAtService : 0
  const interval = nextServiceDue - lastServiceHours
  if (interval <= 0) return { percent: 100, status: 'overdue' }
  const elapsed = hours - lastServiceHours
  const percent = Math.min(Math.round((elapsed / interval) * 100), 100)
  if (hours >= nextServiceDue) return { percent: 100, status: 'overdue' }
  if (percent >= 85) return { percent, status: 'warning' }
  return { percent, status: 'ok' }
}

function getProgressColor(status) {
  if (status === 'overdue') return 'bg-red-500'
  if (status === 'warning') return 'bg-amber-500'
  return 'bg-emerald-500'
}

function getProgressLabel(equipment) {
  const { hours, nextServiceDue } = equipment
  if (!nextServiceDue) return null
  if (hours >= nextServiceDue) return 'OVERDUE'
  const remaining = nextServiceDue - hours
  return `NEXT SERVICE`
}

export default function MachineryListView({ onEquipmentClick, onAddEquipment, selectedEquipmentId, compact }) {
  const { machinery } = useApp()
  const [activeTab, setActiveTab] = useState('All Assets')
  const [search, setSearch] = useState('')

  const stats = useMemo(() => {
    const total = machinery.length
    const totalValue = machinery.reduce((sum, m) => sum + (m.currentValue || 0), 0)
    const servicesDue = machinery.filter(m => m.hours >= m.nextServiceDue).length
    const monthlyCosts = machinery.reduce((sum, m) => {
      const thisMonth = new Date().toISOString().slice(0, 7)
      const monthTxns = (m.financialTransactions || []).filter(t => t.date.startsWith(thisMonth))
      return sum + monthTxns.reduce((s, t) => s + t.amount, 0)
    }, 0)
    return { total, totalValue, servicesDue, monthlyCosts }
  }, [machinery])

  const filtered = useMemo(() => {
    let items = machinery
    if (activeTab !== 'All Assets') {
      const typeMap = {
        Tractors: 'Tractor',
        Mowers: 'Mower',
        Seeders: 'Seeder',
        Vehicles: 'Vehicle',
      }
      const type = typeMap[activeTab]
      if (type) items = items.filter(m => m.type === type)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.make.toLowerCase().includes(q) ||
        m.model.toLowerCase().includes(q) ||
        m.serialNumber.toLowerCase().includes(q)
      )
    }
    return items
  }, [machinery, activeTab, search])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* KPI Summary Cards — hidden in compact mode */}
      {!compact && (
        <div className="p-5 border-b border-slate-100">
          <div className="grid grid-cols-4 gap-3">
            <KpiCard
              icon="inventory_2"
              label="Total Equipment"
              value={`${stats.total} Units`}
              sub={machinery.filter(m => {
                const year = new Date().getFullYear()
                return m.purchaseDate && m.purchaseDate.startsWith(String(year))
              }).length > 0 ? `+${machinery.filter(m => m.purchaseDate?.startsWith(String(new Date().getFullYear()))).length} this year` : null}
            />
            <KpiCard
              icon="account_balance"
              label="Total Asset Value"
              value={formatGBP(stats.totalValue)}
            />
            <KpiCard
              icon="warning"
              label="Services Due"
              value={stats.servicesDue > 0 ? `${stats.servicesDue} Overdue` : 'None'}
              alert={stats.servicesDue > 0}
            />
            <KpiCard
              icon="payments"
              label="Monthly Costs"
              value={formatGBP(stats.monthlyCosts)}
            />
          </div>
        </div>
      )}

      {/* Category Tabs + Search */}
      <div className="px-5 pt-4 pb-3 border-b border-slate-100 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          {EQUIPMENT_CATEGORY_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
            <input
              type="text"
              placeholder="Search inventory..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
            />
          </div>
          <button
            onClick={onAddEquipment}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-emerald-950 rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors shrink-0"
          >
            <span className="material-icons text-sm">add</span>
            Add Asset
          </button>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3 w-12"></th>
              <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-3">Machine Name & Serial</th>
              <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-3">Type</th>
              <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-3">Status</th>
              <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-3">Hours</th>
              <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-3 min-w-[180px]">Maintenance Progress</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(equipment => {
              const progress = getMaintenanceProgress(equipment)
              const statusColor = MACHINERY_STATUS_COLORS[equipment.status] || MACHINERY_STATUS_COLORS['Available']
              const icon = TYPE_ICON_MAP[equipment.type] || 'build'
              const progressLabel = getProgressLabel(equipment)

              const isSelected = equipment.id === selectedEquipmentId

              return (
                <tr
                  key={equipment.id}
                  onClick={() => onEquipmentClick(equipment.id)}
                  className={`border-b border-slate-50 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-primary/5 border-l-2 border-l-primary'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="px-5 py-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <span className="material-icons text-slate-500 text-xl">{icon}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <p className="text-sm font-semibold text-slate-900">{equipment.name}</p>
                    <p className="text-xs text-slate-400">SN: {equipment.serialNumber}</p>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="material-icons text-slate-400 text-sm">{icon}</span>
                      <span className="text-sm text-slate-600">{equipment.type}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor.dot }} />
                      {equipment.status}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <span className="text-sm font-medium text-slate-700">
                      {equipment.hours.toLocaleString()} hrs
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    {progress && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${
                            progress.status === 'overdue' ? 'text-red-600' : 'text-slate-400'
                          }`}>
                            {progressLabel}
                          </span>
                          <span className={`text-[10px] font-bold ${
                            progress.status === 'overdue' ? 'text-red-600'
                            : progress.status === 'warning' ? 'text-amber-600'
                            : 'text-slate-500'
                          }`}>
                            {progress.percent}%
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${getProgressColor(progress.status)}`}
                            style={{ width: `${progress.percent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <span className="material-icons text-4xl mb-2 block">inventory_2</span>
            <p className="text-sm">No equipment found</p>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="px-5 py-3 text-xs text-slate-400">
            Showing {filtered.length} of {machinery.length} assets
          </div>
        )}
      </div>
    </div>
  )
}

function KpiCard({ icon, label, value, sub, alert }) {
  return (
    <div className={`p-4 rounded-xl border ${alert ? 'border-red-200 bg-red-50/50' : 'border-slate-100 bg-white'}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`material-icons text-lg ${alert ? 'text-red-500' : 'text-slate-400'}`}>{icon}</span>
        {sub && (
          <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">
            {sub}
          </span>
        )}
      </div>
      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">{label}</p>
      <p className={`text-lg font-bold ${alert ? 'text-red-700' : 'text-slate-900'}`}>{value}</p>
    </div>
  )
}
