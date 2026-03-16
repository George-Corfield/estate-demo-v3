import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatRelativeDate, isOverdue } from '../../utils/dates'
import { PriorityBadge, StatusBadge } from '../../components/shared/Badge'

export default function FieldTasksTab({ field }) {
  const { tasks } = useApp()
  const navigate = useNavigate()

  const linkedTasks = useMemo(() => tasks.filter(t => t.fieldIds.includes(field.id)), [tasks, field.id])

  const overdue = linkedTasks.filter(t =>
    t.status !== 'done' && t.status !== 'cancelled' && t.dueDate && isOverdue(t.dueDate)
  )
  const todo = linkedTasks.filter(t =>
    t.status === 'todo' && !(t.dueDate && isOverdue(t.dueDate))
  )
  const inProgress = linkedTasks.filter(t =>
    t.status === 'in-progress' && !(t.dueDate && isOverdue(t.dueDate))
  )

  return (
    <div style={{ padding: 20 }} className="flex flex-col gap-6">
      <TaskCategory label="Overdue" tasks={overdue} navigate={navigate} isOverdueSection />
      <TaskCategory label="To Do" tasks={todo} navigate={navigate} />
      <TaskCategory label="In Progress" tasks={inProgress} navigate={navigate} />
    </div>
  )
}

function TaskCategory({ label, tasks, navigate, isOverdueSection }) {
  return (
    <div>
      <h3 className="text-label mb-3" style={{ color: isOverdueSection ? 'var(--color-red-500)' : 'var(--color-slate-600)' }}>
        {label}
        {tasks.length > 0 && <span style={{ marginLeft: 4 }}>({tasks.length})</span>}
      </h3>
      {tasks.length === 0 ? (
        <p className="text-body" style={{ color: 'var(--color-slate-400)' }}>No tasks</p>
      ) : (
        <div className="flex flex-col gap-2">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} navigate={navigate} isOverdue={isOverdueSection} />
          ))}
        </div>
      )}
    </div>
  )
}

function TaskCard({ task, navigate, isOverdue }) {
  return (
    <button
      onClick={() => navigate('/tasks', { state: { openTaskId: task.id } })}
      className="card w-full text-left"
      style={{
        padding: 12,
        cursor: 'pointer',
        transition: 'border-color 120ms ease',
        borderColor: isOverdue ? 'var(--color-red-400)' : undefined,
        background: isOverdue ? 'var(--color-red-100)' : undefined,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = isOverdue ? 'var(--color-red-500)' : 'var(--color-green-500)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = isOverdue ? 'var(--color-red-400)' : 'var(--color-surface-300)' }}
    >
      <div className="flex items-center justify-between mb-1">
        <p className="text-heading-4" style={{ color: 'var(--color-slate-900)', margin: 0 }}>{task.name}</p>
        <PriorityBadge priority={task.priority} />
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status={task.status} />
        <span className="text-body-small" style={{ color: 'var(--color-slate-500)' }}>{task.type}</span>
        <span className="text-body-small" style={{ color: isOverdue ? 'var(--color-red-400)' : 'var(--color-slate-400)' }}>
          {formatRelativeDate(task.dueDate)}
        </span>
      </div>
      {task.assignedTo.length > 0 && (
        <p className="text-body-small" style={{ color: 'var(--color-slate-400)', marginTop: 4 }}>
          Assigned: {task.assignedTo.join(', ')}
        </p>
      )}
    </button>
  )
}
