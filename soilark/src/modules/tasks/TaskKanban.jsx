import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import TaskCard from './TaskCard'

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: '#64748b' },
  { id: 'inProgress', label: 'In Progress', color: '#3b82f6' },
  { id: 'done', label: 'Done', color: '#22c55e' },
]

export default function TaskKanban({ filters, onTaskClick }) {
  const { tasks } = useApp()

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      if (filters.priority !== 'all' && t.priority !== filters.priority) return false
      if (filters.type !== 'all' && t.type !== filters.type) return false
      if (filters.field !== 'all' && !t.fieldIds.includes(filters.field)) return false
      return true
    })
  }, [tasks, filters])

  return (
    <div className="flex gap-3 p-4 overflow-x-auto min-h-0">
      {COLUMNS.map(col => {
        const columnTasks = filtered.filter(t => t.status === col.id)
        return (
          <div key={col.id} className="min-w-[180px] flex-1 flex flex-col">
            {/* Column header */}
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{col.label}</span>
              <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-bold">
                {columnTasks.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-2 flex-1">
              {columnTasks.map(task => (
                <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task.id)} />
              ))}
              {columnTasks.length === 0 && (
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-lg text-center">
                  <p className="text-xs text-slate-400">No tasks</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
