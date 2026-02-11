import { PRIORITY_COLORS, STATUS_COLORS } from '../../constants/colors'

export function PriorityBadge({ priority }) {
  const c = PRIORITY_COLORS[priority] || PRIORITY_COLORS.low
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  )
}

export function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.todo
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {c.label}
    </span>
  )
}
