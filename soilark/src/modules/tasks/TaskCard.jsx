import { useApp } from '../../context/AppContext'
import { formatRelativeDate, isOverdue } from '../../utils/dates'
import { PRIORITY_COLORS } from '../../constants/colors'

export default function TaskCard({ task, onClick }) {
  const { fields } = useApp()
  const priorityColor = PRIORITY_COLORS[task.priority]
  const overdue = task.status !== 'done' && isOverdue(task.dueDate)
  const taskFields = fields.filter(f => task.fieldIds.includes(f.id))

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 bg-white border border-slate-200 rounded-lg hover:border-primary/30 hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: priorityColor.dot }}
        />
        <span className="text-sm font-semibold text-slate-800 leading-tight line-clamp-2">
          {task.name}
        </span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-medium">
          {task.type}
        </span>
        {taskFields.length > 0 && (
          <span className="text-[10px] text-slate-400 truncate">
            {taskFields.map(f => f.name).join(', ')}
          </span>
        )}
      </div>
      <p className={`text-[10px] mt-1.5 font-medium ${overdue ? 'text-red-500' : 'text-slate-400'}`}>
        {task.status === 'done' ? `Completed ${task.completedDate}` : formatRelativeDate(task.dueDate)}
      </p>
    </button>
  )
}
