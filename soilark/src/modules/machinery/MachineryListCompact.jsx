import { useApp } from '../../context/AppContext'
import { MACHINERY_STATUS_COLORS } from '../../data/machinery'

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

export default function MachineryListCompact({ selectedId, onEquipmentClick }) {
  const { machinery } = useApp()

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--color-surface-50)' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-surface-300)' }}>
        <h3 className="text-label" style={{ color: 'var(--color-slate-400)', margin: 0 }}>
          Equipment ({machinery.length})
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {machinery.map(equipment => {
          const icon = TYPE_ICON_MAP[equipment.type] || 'build'
          const badgeClass = MACHINERY_STATUS_COLORS[equipment.status] || 'badge-neutral'
          const isActive = equipment.id === selectedId

          return (
            <div
              key={equipment.id}
              onClick={() => onEquipmentClick(equipment.id)}
              className="flex items-center gap-3"
              style={{
                padding: '10px 12px',
                cursor: 'pointer',
                borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                background: isActive ? 'rgba(19, 236, 19, 0.06)' : 'transparent',
                borderBottom: '1px solid var(--color-surface-200)',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--color-surface-100)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              <div style={{ width: 32, height: 32, borderRadius: '6px', background: 'var(--color-surface-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--color-slate-700)', fontSize: 16 }}>{icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 m-0 text-sm leading-tight truncate">{equipment.name}</p>
                <p className="text-xs text-slate-500 m-0 truncate">{equipment.make} {equipment.model}</p>
              </div>
              <span className={`badge ${badgeClass}`} style={{ fontSize: 10, padding: '2px 6px', flexShrink: 0 }}>
                {equipment.status}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
