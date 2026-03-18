import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatRelativeDate, isOverdue } from '../../utils/dates'
import { PriorityBadge, StatusBadge } from '../../components/shared/Badge'
import { isTaskVisibleToUser } from '../../utils/visibility'

export default function FieldTasksTab({ field }) {
  const { tasks, currentUser, staff } = useApp()
  const navigate = useNavigate()

  const linkedTasks = useMemo(() => tasks.filter(t => t.fieldIds.includes(field.id)), [tasks, field.id])

  const overdue = linkedTasks.filter(t =>
    t.status !== 'done' && t.status !== 'cancelled' && t.dueDate && isOverdue(t.dueDate)
  )
  const todo = linkedTasks.filter(t =>
    t.status === 'todo' && !(t.dueDate && isOverdue(t.dueDate))
  )
  const inProgress = linkedTasks.filter(t =>
    t.status === 'inProgress' && !(t.dueDate && isOverdue(t.dueDate))
  )

  return (
    <div style={{ padding: 20 }} className="flex flex-col gap-6">
      <TaskCategory label="Overdue" tasks={overdue} navigate={navigate} isOverdueSection currentUser={currentUser} staff={staff} />
      <TaskCategory label="To Do" tasks={todo} navigate={navigate} currentUser={currentUser} staff={staff} />
      <TaskCategory label="In Progress" tasks={inProgress} navigate={navigate} currentUser={currentUser} staff={staff} />
    </div>
  )
}

function TaskCategory({ label, tasks, navigate, isOverdueSection, currentUser, staff }) {
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
          {tasks.map(task => {
            const locked = !isTaskVisibleToUser(task, currentUser, staff)
            return <TaskCard key={task.id} task={task} navigate={navigate} isOverdue={isOverdueSection} locked={locked} />
          })}
        </div>
      )}
    </div>
  )
}

function TaskCard({ task, navigate, isOverdue, locked }) {
  return (
    <button
      onClick={locked ? undefined : () => navigate('/tasks', { state: { openTaskId: task.id } })}
      className="card w-full text-left"
      style={{
        padding: 12,
        cursor: locked ? 'not-allowed' : 'pointer',
        transition: 'border-color 120ms ease',
        opacity: locked ? 0.45 : 1,
        borderColor: isOverdue && !locked ? 'var(--color-red-400)' : undefined,
        background: isOverdue && !locked ? 'var(--color-red-100)' : undefined,
      }}
      onMouseEnter={e => {
        if (!locked) e.currentTarget.style.borderColor = isOverdue ? 'var(--color-red-500)' : 'var(--color-green-500)'
      }}
      onMouseLeave={e => {
        if (!locked) e.currentTarget.style.borderColor = isOverdue ? 'var(--color-red-400)' : 'var(--color-surface-300)'
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <p className="text-heading-4" style={{ color: 'var(--color-slate-900)', margin: 0 }}>{task.name}</p>
        <div className="flex items-center gap-2">
          {locked && (
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--color-slate-400)' }}>lock</span>
          )}
          <PriorityBadge priority={task.priority} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status={task.status} />
        <span className="text-body-small" style={{ color: 'var(--color-slate-500)' }}>{task.type}</span>
        <span className="text-body-small" style={{ color: isOverdue && !locked ? 'var(--color-red-400)' : 'var(--color-slate-400)' }}>
          {formatRelativeDate(task.dueDate)}
        </span>
        {locked && (
          <span className="text-body-small" style={{ color: 'var(--color-slate-400)', fontStyle: 'italic' }}>Other team</span>
        )}
      </div>
      {(task.assignedTo.length > 0 || task.assignedTeams?.length > 0) && (
        <div className="flex flex-wrap gap-1" style={{ marginTop: 4 }}>
          {task.assignedTo.map(name => (
            <span key={name} style={{ fontSize: 11, color: 'var(--color-slate-400)' }}>{name}</span>
          ))}
          {task.assignedTeams?.map(team => (
            <span key={team} className="flex items-center gap-1" style={{
              fontSize: 11, padding: '1px 6px', borderRadius: 99,
              background: 'rgba(100,116,139,0.10)', color: 'var(--color-slate-500)',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 10 }}>group</span>
              {team}
            </span>
          ))}
        </div>
      )}
    </button>
  )
}
