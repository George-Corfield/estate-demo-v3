import { PRIORITY_COLORS, STATUS_COLORS } from '../../constants/colors'

export function PriorityBadge({ priority }) {
  const c = PRIORITY_COLORS[priority] || PRIORITY_COLORS.low
  return (
    <span
      className="badge"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  )
}

export function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.todo
  return (
    <span
      className="badge"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {c.label}
    </span>
  )
}
