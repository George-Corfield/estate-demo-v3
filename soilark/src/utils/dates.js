const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAYS_SHORT_MON = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function ordinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}

export function formatOrdinalDate(date) {
  const d = new Date(date)
  const day = d.getDate()
  const hours = String(d.getHours()).padStart(2, '0')
  const mins = String(d.getMinutes()).padStart(2, '0')
  return `${DAYS[d.getDay()]} ${day}${ordinalSuffix(day)} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${hours}:${mins}`
}

export function formatShortDate(date) {
  const d = new Date(date)
  const day = d.getDate()
  return `${DAYS_SHORT[d.getDay()]} ${day} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`
}

export function formatFullDate(date) {
  const d = new Date(date)
  const day = d.getDate()
  return `${DAYS_SHORT[d.getDay()]} ${day}${ordinalSuffix(day)} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export function formatRelativeDate(dateStr) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  const diffMs = target - now
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Due today'
  if (diffDays === 1) return 'Due tomorrow'
  if (diffDays > 1) return `Due in ${diffDays} days`
  if (diffDays === -1) return 'Overdue by 1 day'
  return `Overdue by ${Math.abs(diffDays)} days`
}

export function isOverdue(dateStr) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return target < now
}

export function getMonthDays(year, month, startOnMonday = false) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const days = []

  // Calculate padding for previous month
  let padCount
  if (startOnMonday) {
    // Monday=0 offset: Sun(0)->6, Mon(1)->0, Tue(2)->1, ...
    padCount = (firstDay + 6) % 7
  } else {
    padCount = firstDay
  }

  for (let i = padCount - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    })
  }

  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    })
  }

  // Next month padding (fill to 5 or 6 rows)
  const targetLength = days.length > 35 ? 42 : 35
  const remaining = targetLength - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    })
  }

  return days
}

export function isSameDay(d1, d2) {
  if (!d1 || !d2) return false
  const a = new Date(d1)
  const b = new Date(d2)
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function isToday(date) {
  return isSameDay(date, new Date())
}

export function formatDateKey(date) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export { MONTHS, MONTHS_SHORT, DAYS_SHORT, DAYS_SHORT_MON }
