import { useApp } from '../../context/AppContext'
import FilterDropdown from '../../components/shared/FilterDropdown'

export default function TaskFilterBar({ filters, onChange, onAddTask }) {
  const { fields } = useApp()

  return (
    <div style={{ padding: 16, borderBottom: '1px solid var(--color-parchment-300)' }} className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-3 flex items-center gap-2" style={{ color: 'var(--color-ink-900)', margin: 0 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-sage-500)' }}>assignment</span>
          Tasks
        </h2>
        <button onClick={onAddTask} className="btn btn-primary">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
          Add Task
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        <FilterDropdown
          label="All Priorities"
          value={filters.priority}
          options={['high', 'medium', 'low']}
          onChange={(v) => onChange({ ...filters, priority: v })}
        />
        <FilterDropdown
          label="All Types"
          value={filters.type}
          options={['Planting', 'Harvesting', 'Fertilizing', 'Maintenance']}
          onChange={(v) => onChange({ ...filters, type: v })}
        />
        <FilterDropdown
          label="All Fields"
          value={filters.field}
          options={fields.map(f => ({ value: f.id, label: f.name }))}
          onChange={(v) => onChange({ ...filters, field: v })}
        />
      </div>
    </div>
  )
}
