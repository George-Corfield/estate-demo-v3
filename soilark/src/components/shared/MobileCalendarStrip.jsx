import { useState, useRef } from 'react'
import { isToday, isSameDay, getMonthDays, MONTHS, DAYS_SHORT_MON } from '../../utils/dates'
import { EVENT_FILTER_COLORS, EVENT_TYPE_TO_FILTER } from '../../constants/colors'
import { getEventsForDate } from '../../utils/events'

function getWeekStart(date) {
  const d = new Date(date)
  // Monday-based week
  const day = d.getDay()
  const diff = (day + 6) % 7
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function formatDayAbbr(date) {
  return DAYS_SHORT_MON[(new Date(date).getDay() + 6) % 7].charAt(0)
}

function getTypeDots(events, date) {
  const dayEvents = getEventsForDate(events, date)
  const seen = new Set()
  const dots = []
  for (const ev of dayEvents) {
    const key = EVENT_TYPE_TO_FILTER[ev.type] || 'event'
    if (!seen.has(key)) {
      seen.add(key)
      dots.push(EVENT_FILTER_COLORS[key]?.dot || 'var(--color-slate-300)')
    }
    if (dots.length >= 3) break
  }
  return dots
}

export default function MobileCalendarStrip({ events, selectedDate, onDaySelect }) {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()))
  const [expanded, setExpanded] = useState(false)
  const [expandedMonth, setExpandedMonth] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })

  const swipeStartX = useRef(null)

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const handleSwipeStart = (e) => {
    swipeStartX.current = e.touches ? e.touches[0].clientX : e.clientX
  }

  const handleSwipeEnd = (e) => {
    if (swipeStartX.current === null) return
    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
    const dx = endX - swipeStartX.current
    if (Math.abs(dx) > 50) {
      if (dx < 0) {
        setWeekStart(prev => addDays(prev, 7))
      } else {
        setWeekStart(prev => addDays(prev, -7))
      }
    }
    swipeStartX.current = null
  }

  const handleToggleExpand = () => {
    if (!expanded) {
      // sync expanded month to current week
      setExpandedMonth({ year: weekStart.getFullYear(), month: weekStart.getMonth() })
    }
    setExpanded(e => !e)
  }

  const handleExpandedPrev = () => {
    setExpandedMonth(({ year, month }) => {
      if (month === 0) return { year: year - 1, month: 11 }
      return { year, month: month - 1 }
    })
  }

  const handleExpandedNext = () => {
    setExpandedMonth(({ year, month }) => {
      if (month === 11) return { year: year + 1, month: 0 }
      return { year, month: month + 1 }
    })
  }

  const handleDayTap = (date) => {
    onDaySelect(date)
    if (expanded) {
      setWeekStart(getWeekStart(date))
      setExpanded(false)
    }
  }

  const monthDays = expanded ? getMonthDays(expandedMonth.year, expandedMonth.month, true) : []

  const headerLabel = expanded
    ? `${MONTHS[expandedMonth.month]} ${expandedMonth.year}`
    : `${MONTHS[weekStart.getMonth()]} ${weekStart.getFullYear()}`

  return (
    <div style={{ background: 'var(--color-surface-50)', borderBottom: '1px solid var(--color-surface-300)' }}>
      {/* Month header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px 6px',
      }}>
        <button
          onClick={handleToggleExpand}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: 'var(--color-slate-700)',
            fontSize: 15,
            fontWeight: 700,
            padding: 0,
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 18,
              color: 'var(--color-slate-400)',
              transform: expanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 200ms ease',
            }}
          >
            expand_more
          </span>
          {headerLabel}
        </button>

        {expanded && (
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={handleExpandedPrev} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-slate-400)' }}>chevron_left</span>
            </button>
            <button onClick={handleExpandedNext} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-slate-400)' }}>chevron_right</span>
            </button>
          </div>
        )}
      </div>

      {/* Week strip or month grid */}
      {!expanded ? (
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 8px 10px', touchAction: 'pan-y' }}
          onTouchStart={handleSwipeStart}
          onTouchEnd={handleSwipeEnd}
        >
          {weekDays.map((date, i) => {
            const today = isToday(date)
            const selected = isSameDay(date, selectedDate)
            const dots = getTypeDots(events, date)
            return (
              <button
                key={i}
                onClick={() => handleDayTap(date)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  padding: '6px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 8,
                }}
              >
                <span style={{ fontSize: 10, color: 'var(--color-slate-400)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {formatDayAbbr(date)}
                </span>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: selected
                    ? 'var(--color-green-500)'
                    : today
                    ? 'rgba(19,236,19,0.15)'
                    : 'transparent',
                }}>
                  <span style={{
                    fontSize: 14,
                    fontWeight: selected || today ? 700 : 400,
                    color: selected
                      ? 'white'
                      : today
                      ? 'var(--color-green-600)'
                      : 'var(--color-slate-700)',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {date.getDate()}
                  </span>
                </div>
                {/* Type dots */}
                <div style={{ display: 'flex', gap: 2, height: 6, alignItems: 'center' }}>
                  {dots.map((color, idx) => (
                    <span key={idx} style={{ width: 5, height: 5, borderRadius: '50%', background: color }} />
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <div style={{ padding: '0 8px 10px' }}>
          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
            {DAYS_SHORT_MON.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 600, color: 'var(--color-slate-400)', letterSpacing: '0.04em', textTransform: 'uppercase', padding: '2px 0' }}>
                {d.charAt(0)}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px 0' }}>
            {monthDays.map((day, i) => {
              const today = isToday(day.date)
              const selected = isSameDay(day.date, selectedDate)
              const dots = day.isCurrentMonth ? getTypeDots(events, day.date) : []
              const count = day.isCurrentMonth ? getEventsForDate(events, day.date).length : 0

              return (
                <button
                  key={i}
                  onClick={() => day.isCurrentMonth && handleDayTap(day.date)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '4px 2px',
                    background: 'none',
                    border: 'none',
                    cursor: day.isCurrentMonth ? 'pointer' : 'default',
                    borderRadius: 6,
                    opacity: day.isCurrentMonth ? 1 : 0.25,
                    minHeight: 56,
                    justifyContent: 'flex-start',
                  }}
                >
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: selected
                      ? 'var(--color-green-500)'
                      : today
                      ? 'rgba(19,236,19,0.15)'
                      : 'transparent',
                  }}>
                    <span style={{
                      fontSize: 12,
                      fontWeight: selected || today ? 700 : 400,
                      color: selected
                        ? 'white'
                        : today
                        ? 'var(--color-green-600)'
                        : 'var(--color-slate-700)',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {day.date.getDate()}
                    </span>
                  </div>
                  {count > 0 && (
                    <div style={{ display: 'flex', gap: 2, marginTop: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {dots.map((color, idx) => (
                        <span key={idx} style={{ width: 4, height: 4, borderRadius: '50%', background: color }} />
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
