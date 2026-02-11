import { useApp } from '../../context/AppContext'
import FilterDropdown from '../../components/shared/FilterDropdown'

export default function TaskFilterBar({ filters, onChange, onAddTask }) {
  const { fields } = useApp()

  return (
    <div className="p-4 border-b border-slate-100 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
          <span className="material-icons text-primary">assignment</span>
          Tasks
        </h2>
        <button
          onClick={onAddTask}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-emerald-950 rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors"
        >
          <span className="material-icons text-sm">add</span>
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
