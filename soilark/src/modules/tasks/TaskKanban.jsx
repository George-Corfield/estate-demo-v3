import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import TaskCard from './TaskCard'

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: 'var(--color-parchment-300)' },
  { id: 'inProgress', label: 'In Progress', color: 'var(--color-sage-500)' },
  { id: 'done', label: 'Done', color: 'var(--color-sage-600)' },
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
    <div className="flex flex-col gap-6" style={{ padding: 16 }}>
      {COLUMNS.map(col => {
        const columnTasks = filtered.filter(t => t.status === col.id)
        return (
          <div key={col.id}>
            {/* Section header */}
            <div className="flex items-center gap-2 mb-3 px-1">
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: col.color, flexShrink: 0 }} />
              <span className="text-label" style={{ color: 'var(--color-earth-400)' }}>{col.label}</span>
              <span className="badge badge-neutral" style={{ marginLeft: 4 }}>
                {columnTasks.length}
              </span>
              <div className="flex-1 h-px ml-2" style={{ background: 'var(--color-parchment-300)' }} />
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2">
              {columnTasks.map(task => (
                <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task.id)} />
              ))}
              {columnTasks.length === 0 && (
                <div
                  className="p-4 text-center"
                  style={{ border: '2px dashed var(--color-parchment-300)', borderRadius: 'var(--radius-md)' }}
                >
                  <p className="text-body-small" style={{ color: 'var(--color-earth-400)' }}>No tasks</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
