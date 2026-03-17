// LandArk Design System palette tokens
// LandArk "Lush & Sunlit" palette tokens
const sage200 = '#dcfce7'
const sage300 = '#67c034'
const sage400 = '#66ba39'
const sage500 = '#56AB2F'      // Brighter, more "living" green
const sage600 = '#3B7A1E'      // Deep forest for contrast
const darkGreen = '#166534'
const ochre400 = '#F2A900'     // Pure golden harvest
const ochre300 = '#FFCC33'     // Sunlight/Daffodil yellow
const earth400 = '#B57E5D'     // Warmer terracotta
const earth500 = '#8B5A3C'     // Richer cocoa
const parchment100 = '#F9F7F2' // Cleaner, whiter base
const parchment200 = '#F0EAD6' // Less gray, more "cream"
const parchment300 = '#E6DCC3' // Deeper tan without the "mud"
const ink900 = '#1A1D16'       // Near-black with a hint of forest
const blue200 = '#DBEAFE'
const blue600 = '#1E40AF'  // Added for "Services" to break the brown/green monotony
const danger200 = '#FEF2F2'
const danger400 = '#EF4444'
const danger600 = '#991B1B'
const slate200 = '#F1F5F9'
const slate600 = '#475569'

const Surface50 = '#f6f8f6'
const Surface100 = '#f1f5f1'
const Surface200 = '#e2e8f0'
const Surface300 = '#cbd5e1'

const Green100 = '#dcfce7'
const Green300 = '#86efac'
const Green400 = '#4ade80'
const Green500 = '#13ec13'
const Green600 = '#0fb80f'
const Green700 = '#22c55e'
const Green800 = '#166534'

const Deep700 = '#047857'
const Deep800 = '#065f46'
const Deep900 = '#064e3b'
const Deep950 = '#022c22'

const Amber100 = '#fef3c7'
const Amber300 = '#fcd34d'
const Amber400 = '#f59e0b'
const Amber700 = '#92400e'

const Blue100 = '#dbeafe'
const Blue400 = '#3b82f6'
const Blue700 = '#1e40af'

const Red100 = '#fef2f2'
const Red400 = '#ef4444'
const Red600 = '#dc2626'
const Red700 = '#991b1b'

const Slate50 = '#f8fafc'
const Slate100 = '#f1f5f9'
const Slate200 = '#e2e8f0'
const Slate300 = '#cbd5e1'
const Slate400 = '#94a3b8'
const Slate500 = '#64748b'
const Slate600 = '#475569'
const Slate800 = '#1e293b'
const Slate900 = '#0f172a'

const Indigo500 = '#6366f1'
const Orange400 = '#f97316'
const Gray500 = '#6b7280'
const Primary = '#13ec13'


export const PRIORITY_COLORS = {
  high: { bg: Red100, text: Red700 },
  medium: { bg: Amber100, text: Amber700 },
  low: { bg: Blue100, text: Blue700 },
}

export const EVENT_TYPE_COLORS = {
  task: sage500,
  service: ochre400,
  appointment: earth400,
  event: earth400,
  reminder: ochre300,
}

export const EVENT_TYPE_BG = {
  // Using light tints instead of just parchment
  task: { bg: '#EBF5E8', text: '#3B7A1E' },      // Light green tint
  service: { bg: '#FEF6E5', text: '#D49A20' },   // Light gold tint
  appointment: { bg: '#eef2f6', text: '#3c628b' }, // Light earth tint
  event: { bg: '#F6F1EE', text: '#8B5A3C' },
  reminder: { bg: '#fee5e5', text: '#d42020' },
}

export const EVENT_FILTER_COLORS = {
  task: { dot: sage500, label: 'Tasks' },
  service: { dot: ochre400, label: 'Services' },
  event: { dot: earth400, label: 'Events' },
}

export const EVENT_SUBTYPE_ICONS = {
  // Events
  event:       'celebration',
  reminder:    'notifications',
  appointment: 'schedule',
  // Services
  service:     'build',
  mot:         'directions_car',
  // Tasks
  task:        'task_alt',
  planting:    'grass',
  harvesting:  'agriculture',
  fertilizing: 'science',
  maintenance: 'handyman',
  feeding:     'restaurant',
  irrigation:  'water_drop',
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
  todo: { bg: Slate200, text: Slate600, label: 'To Do' },
  inProgress: { bg: Blue100, text: Blue700, label: 'In Progress' },
  done: { bg: Green100, text: Deep700, label: 'Done' },
  paused: { bg: Amber100, text: Amber700, label: 'Paused' },
  cancelled: { bg: Red100, text: Red700, label: 'Cancelled' },
}
