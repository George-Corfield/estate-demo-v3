import { useApp } from '../../context/AppContext'
import { formatRelativeDate, formatShortDate, isOverdue } from '../../utils/dates'
import { PRIORITY_COLORS } from '../../constants/colors'

function getDueDateColor(task) {
  if (task.status === 'done') return 'text-green-600 bg-green-50'
  if (isOverdue(task.dueDate)) return 'text-red-600 bg-red-50'
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(task.dueDate)
  target.setHours(0, 0, 0, 0)
  const diffDays = Math.round((target - now) / (1000 * 60 * 60 * 24))
  if (diffDays <= 2) return 'text-orange-600 bg-orange-50'
  if (diffDays <= 7) return 'text-amber-600 bg-amber-50'
  return 'text-green-600 bg-green-50'
}

export default function TaskCard({ task, onClick }) {
  const { fields } = useApp()
  const priorityColor = PRIORITY_COLORS[task.priority]
  const taskFields = fields.filter(f => task.fieldIds.includes(f.id))
  const dueDateColor = getDueDateColor(task)

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 bg-white border border-slate-200 rounded-lg hover:border-primary/30 hover:shadow-sm transition-all"
    >
      {/* Top row: heading with priority dot + priority label */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5"
            style={{ backgroundColor: priorityColor.dot }}
          />
          <span className="text-sm font-semibold text-slate-800 leading-tight line-clamp-2">
            {task.name}
          </span>
        </div>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0"
          style={{
            backgroundColor: priorityColor.bg,
            color: priorityColor.text,
          }}
        >
          {task.priority}
        </span>
      </div>

      {/* Job type */}
      <div className="mb-2">
        <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">
          {task.type}
        </span>
      </div>

      {/* Fields list */}
      {taskFields.length > 0 && (
        <div className="mb-2">
          {taskFields.map(f => (
            <p key={f.id} className="text-[11px] text-slate-500 leading-relaxed">
              {f.name}
            </p>
          ))}
        </div>
      )}

      {/* Due date with severity */}
      <div className={`text-[10px] font-medium px-2 py-1 rounded inline-block ${dueDateColor}`}>
        {task.status === 'done'
          ? `Completed ${task.completedDate}`
          : `${formatShortDate(task.dueDate)} · ${formatRelativeDate(task.dueDate)}`
        }
      </div>
    </button>
  )
}
