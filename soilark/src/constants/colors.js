export const CATEGORY_COLORS = {
  Arable: { bg: '#fcd34d', border: '#f59e0b', text: '#92400e' },
  Pastoral: { bg: '#4ade80', border: '#22c55e', text: '#166534' },
  Grassland: { bg: '#86efac', border: '#4ade80', text: '#166534' },
  Forestry: { bg: '#6b7280', border: '#4b5563', text: '#1f2937' },
}

export const PRIORITY_COLORS = {
  high: { dot: '#ef4444', bg: '#fef2f2', text: '#991b1b' },
  medium: { dot: '#f97316', bg: '#fff7ed', text: '#9a3412' },
  low: { dot: '#3b82f6', bg: '#eff6ff', text: '#1e40af' },
}

export const EVENT_TYPE_COLORS = {
  task: '#22c55e',
  service: '#f59e0b',
  appointment: '#3b82f6',
  event: '#6366f1',
  reminder: '#f59e0b',
}

export const EVENT_TYPE_BG = {
  task: { bg: '#dcfce7', text: '#166534' },
  service: { bg: '#fef3c7', text: '#92400e' },
  appointment: { bg: '#dbeafe', text: '#1e40af' },
  event: { bg: '#e0e7ff', text: '#3730a3' },
  reminder: { bg: '#fef3c7', text: '#92400e' },
}

export const EVENT_FILTER_COLORS = {
  task: { dot: '#22c55e', label: 'Tasks' },
  service: { dot: '#f59e0b', label: 'Services' },
  event: { dot: '#3b82f6', label: 'Events' },
}

// Maps every event type to its filter group
export const EVENT_TYPE_TO_FILTER = {
  task: 'task',
  service: 'service',
  appointment: 'event',
  event: 'event',
  reminder: 'event',
}

export const STATUS_COLORS = {
  todo: { bg: '#f1f5f9', text: '#475569', label: 'To Do' },
  inProgress: { bg: '#dbeafe', text: '#1e40af', label: 'In Progress' },
  done: { bg: '#dcfce7', text: '#166534', label: 'Done' },
}
