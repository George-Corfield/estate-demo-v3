// LandArk Design System palette tokens
// LandArk "Lush & Sunlit" palette tokens
const sage500 = '#56AB2F'      // Brighter, more "living" green
const sage600 = '#3B7A1E'      // Deep forest for contrast
const ochre400 = '#F2A900'     // Pure golden harvest
const ochre300 = '#FFCC33'     // Sunlight/Daffodil yellow
const earth400 = '#B57E5D'     // Warmer terracotta
const earth500 = '#8B5A3C'     // Richer cocoa
const parchment100 = '#F9F7F2' // Cleaner, whiter base
const parchment200 = '#F0EAD6' // Less gray, more "cream"
const parchment300 = '#E6DCC3' // Deeper tan without the "mud"
const ink900 = '#1A1D16'       // Near-black with a hint of forest
const vibrantBlue = '#4A90E2'  // Added for "Services" to break the brown/green monotony

export const CATEGORY_COLORS = {
  Arable: { bg: '#FFCC33', border: '#F2A900', text: '#1A1D16' },
  Pastoral: { bg: '#56AB2F', border: '#3B7A1E', text: '#fff' },
  Grassland: { bg: '#A3CF62', border: '#56AB2F', text: '#1A1D16' },
  Forestry: { bg: '#8B5A3C', border: '#543A28', text: '#fff' },
}

export const PRIORITY_COLORS = {
  high: { bg: ochre400, text: '#fff' },
  medium: { bg: parchment300, text: earth500 },
  low: { bg: parchment200, text: earth500 },
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
  appointment: { bg: '#F6F1EE', text: '#8B5A3C' }, // Light earth tint
  event: { bg: '#F6F1EE', text: '#8B5A3C' },
  reminder: { bg: '#FEF6E5', text: '#D49A20' },
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
  todo: { bg: parchment300, text: earth500, label: 'To Do' },
  inProgress: { bg: sage500, text: '#fff', label: 'In Progress' },
  done: { bg: sage500, text: '#fff', label: 'Done' },
}
