import { useEffect, useRef } from 'react'
import { formatDateKey, isToday, isSameDay, DAYS_SHORT, MONTHS } from '../../utils/dates'
import { EVENT_FILTER_COLORS, EVENT_TYPE_TO_FILTER, EVENT_SUBTYPE_ICONS, EVENT_TYPE_BG } from '../../constants/colors'

function formatHeading(date) {
  const d = new Date(date)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  const diff = Math.round((d - now) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  const day = new Date(date)
  return `${DAYS_SHORT[day.getDay()]} ${day.getDate()} ${MONTHS[day.getMonth()]}`
}

function buildDateGroups(events) {
  const map = new Map()
  events.forEach(ev => {
    const key = formatDateKey(ev.date)
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(ev)
  })
  const sorted = Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  return sorted
}

export default function MobileAgendaList({ events, selectedDate, onDayTap, onEventTap }) {
  const listRef = useRef(null)
  const headingRefs = useRef({})

  // Build groups: show from 30 days ago to 90 days ahead
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const windowStart = new Date(today)
  windowStart.setDate(windowStart.getDate() - 30)
  const windowEnd = new Date(today)
  windowEnd.setDate(windowEnd.getDate() + 90)

  const filteredEvents = events.filter(ev => {
    const d = new Date(ev.date)
    d.setHours(0, 0, 0, 0)
    return d >= windowStart && d <= windowEnd
  })

  const groups = buildDateGroups(filteredEvents)

  // Scroll to selected date or today on mount / selectedDate change
  useEffect(() => {
    if (!listRef.current) return
    const targetKey = selectedDate ? formatDateKey(selectedDate) : formatDateKey(new Date())
    const el = headingRefs.current[targetKey]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [selectedDate])

  if (groups.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-slate-400)', padding: 32 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 36, marginBottom: 8 }}>event_busy</span>
        <p style={{ fontSize: 14 }}>No events in this period</p>
      </div>
    )
  }

  return (
    <div ref={listRef} style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
      {groups.map(([dateKey, dayEvents]) => {
        const dateObj = new Date(dateKey + 'T00:00:00')
        const isSelected = selectedDate && isSameDay(dateObj, selectedDate)
        const isTodayDate = isToday(dateObj)

        return (
          <div
            key={dateKey}
            ref={el => { headingRefs.current[dateKey] = el }}
          >
            {/* Date heading */}
            <button
              onClick={() => onDayTap(dateObj)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px 16px 6px',
                background: isSelected
                  ? 'rgba(19,236,19,0.08)'
                  : isTodayDate
                  ? 'rgba(19,236,19,0.04)'
                  : 'var(--color-surface-100)',
                border: 'none',
                borderBottom: '1px solid var(--color-surface-200)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{
                fontSize: 12,
                fontWeight: 700,
                color: isSelected || isTodayDate
                  ? 'var(--color-green-600)'
                  : 'var(--color-slate-500)',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}>
                {formatHeading(dateObj)}
              </span>
              <span style={{
                fontSize: 11,
                color: 'var(--color-slate-400)',
                fontWeight: 500,
              }}>
                {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
              </span>
            </button>

            {/* Events */}
            {dayEvents.map(event => {
              const filterKey = EVENT_TYPE_TO_FILTER[event.type] || 'event'
              const dotColor = EVENT_FILTER_COLORS[filterKey]?.dot || 'var(--color-slate-300)'
              const colors = EVENT_TYPE_BG[event.type] || { bg: 'var(--color-surface-100)', text: 'var(--color-slate-600)' }
              const icon = EVENT_SUBTYPE_ICONS[event.subType] || EVENT_SUBTYPE_ICONS[event.type] || 'event'

              return (
                <button
                  key={event.id}
                  onClick={() => onEventTap(dateObj)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 16px',
                    background: 'var(--color-surface-50)',
                    border: 'none',
                    borderBottom: '1px solid var(--color-surface-200)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  {/* Coloured left border accent */}
                  <div style={{
                    width: 3,
                    alignSelf: 'stretch',
                    borderRadius: 2,
                    background: dotColor,
                    flexShrink: 0,
                  }} />

                  {/* Icon */}
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: colors.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: colors.text }}>
                      {icon}
                    </span>
                  </div>

                  {/* Content */}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--color-slate-900)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {event.title}
                    </div>
                    {(event.fieldName || event.machineryName) && (
                      <div style={{ fontSize: 11, color: 'var(--color-slate-400)', marginTop: 1 }}>
                        {event.fieldName || event.machineryName}
                      </div>
                    )}
                  </div>

                  {/* Right: time + priority */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    {event.time && (
                      <span style={{ fontSize: 11, color: 'var(--color-slate-400)' }}>{event.time}</span>
                    )}
                    {event.priority === 'high' && (
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-amber-400)' }} />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )
      })}

      {/* Bottom padding */}
      <div style={{ height: 24 }} />
    </div>
  )
}
