import { useApp } from '../../context/AppContext'
import { formatRelativeDate, formatShortDate, isOverdue } from '../../utils/dates'
import { PRIORITY_COLORS } from '../../constants/colors'

function getDueDateStyle(task) {
  if (task.status === 'cancelled') return { color: 'var(--color-red-600)', background: 'var(--color-red-100)' }
  if (task.status === 'paused') return { color: 'var(--color-amber-700)', background: 'var(--color-amber-100)' }
  if (task.status === 'done') return { color: 'var(--color-green-600)', background: 'var(--color-green-100)' }
  if (isOverdue(task.dueDate)) return { color: 'var(--color-red-400)', background: 'var(--color-red-100)' }
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(task.dueDate)
  target.setHours(0, 0, 0, 0)
  const diffDays = Math.round((target - now) / (1000 * 60 * 60 * 24))
  if (diffDays <= 2) return { color: 'var(--color-amber-400)', background: 'var(--color-amber-100)' }
  if (diffDays <= 7) return { color: 'var(--color-amber-400)', background: 'var(--color-amber-100)' }
  return { color: 'var(--color-green-600)', background: 'var(--colour-green-100)' }
}

export default function TaskCard({ task, onClick }) {
  const { fields } = useApp()
  const priorityColor = PRIORITY_COLORS[task.priority]
  const taskFields = fields.filter(f => task.fieldIds.includes(f.id))
  const dueDateStyle = getDueDateStyle(task)
  const isCancelled = task.status === 'cancelled'

  return (
    <button
      onClick={onClick}
      className="card w-full text-left"
      style={{
        padding: 12,
        cursor: 'pointer',
        transition: 'border-color 120ms ease',
        opacity: isCancelled ? 0.5 : 1,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-green-500)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-surface-300)' }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-heading-4" style={{ color: 'var(--color-slate-900)', margin: 0, lineHeight: 1.3 }}>
          {task.name}
        </span>
        <span className="badge" style={{ backgroundColor: priorityColor.bg, color: priorityColor.text, flexShrink: 0 }}>
          {task.priority}
        </span>
      </div>

      {/* Job type */}
      <div className="mb-2">
        <span className="badge badge-neutral">{task.type}</span>
      </div>

      {/* Paused/Cancelled context */}
      {task.status === 'paused' && task.pauseReason && (
        <p className="text-body-small mb-2" style={{ color: 'var(--color-amber-700)', margin: '0 0 8px 0' }}>
          Paused — {task.pauseReason}
        </p>
      )}
      {isCancelled && task.cancelledDate && (
        <p className="text-body-small mb-2" style={{ color: 'var(--color-red-600)', margin: '0 0 8px 0' }}>
          Cancelled {task.cancelledDate}
        </p>
      )}

      {/* Fields list */}
      {taskFields.length > 0 && (
        <div className="mb-2">
          {taskFields.map(f => (
            <p key={f.id} className="text-body-small" style={{ color: 'var(--color-slate-500)' }}>
              {f.name}
            </p>
          ))}
        </div>
      )}

      {/* Due date */}
      <div
        className="text-label-small inline-block"
        style={{
          padding: '2px 8px',
          borderRadius: 'var(--radius-sm)',
          ...dueDateStyle,
        }}
      >
        {task.status === 'done'
          ? `Completed ${task.completedDate}`
          : task.status === 'cancelled'
            ? `Cancelled ${task.cancelledDate || ''}`
            : `${formatShortDate(task.dueDate)} · ${formatRelativeDate(task.dueDate)}`
        }
      </div>
    </button>
  )
}
