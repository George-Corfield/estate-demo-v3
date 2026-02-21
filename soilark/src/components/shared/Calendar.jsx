import { useState, useMemo, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { getMonthDays, isToday, isSameDay, MONTHS, DAYS_SHORT_MON } from '../../utils/dates'
import { aggregateEvents, getEventsForDate } from '../../utils/events'
import { EVENT_TYPE_BG, EVENT_FILTER_COLORS, EVENT_TYPE_TO_FILTER, EVENT_SUBTYPE_ICONS } from '../../constants/colors'
import CalendarDayPanel from './CalendarDayPanel'
import NewEventPanel from './NewEventPanel'

const MAX_VISIBLE_EVENTS = 2

const FILTER_KEYS = ['task', 'service', 'event']

export default function Calendar({ onDaySelect, selectedDate: externalSelectedDate, navigateToDate, mode = 'view', onToggleView, initialAddEvent = false }) {
  const { fields, tasks, customEvents } = useApp()
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState(null)
  const [filters, setFilters] = useState({ task: true, service: true, event: true })
  const [panelMode, setPanelMode] = useState(initialAddEvent ? 'newEvent' : null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (navigateToDate) {
      const dateStr = navigateToDate.split('#')[0]
      const d = new Date(dateStr)
      setCurrentMonth(d.getMonth())
      setCurrentYear(d.getFullYear())
      setSelectedDate(d)
      setPanelMode('agenda')
    }
  }, [navigateToDate])

  const activeSelectedDate = externalSelectedDate || selectedDate

  const allEvents = useMemo(
    () => aggregateEvents(fields, tasks, customEvents),
    [fields, tasks, customEvents]
  )

  const events = useMemo(
    () => allEvents.filter(e => {
      const filterGroup = EVENT_TYPE_TO_FILTER[e.type] || 'event'
      return filters[filterGroup] !== false
    }),
    [allEvents, filters]
  )

  const days = useMemo(
    () => getMonthDays(currentYear, currentMonth, true),
    [currentYear, currentMonth]
  )

  const handlePrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(y => y - 1)
    } else {
      setCurrentMonth(m => m - 1)
    }
  }

  const handleNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(y => y + 1)
    } else {
      setCurrentMonth(m => m + 1)
    }
  }

  const handleToday = () => {
    const now = new Date()
    setCurrentMonth(now.getMonth())
    setCurrentYear(now.getFullYear())
  }

  const handleDayClick = (date) => {
    if (mode === 'select' && onDaySelect) {
      onDaySelect(date)
      return
    }
    if (panelMode === 'newEvent') {
      setSelectedDate(date)
      return
    }
    if (isSameDay(selectedDate, date)) {
      setSelectedDate(null)
      setPanelMode(null)
    } else {
      setSelectedDate(date)
      setPanelMode('agenda')
    }
  }

  const toggleFilter = (key) => {
    setFilters(f => ({ ...f, [key]: !f[key] }))
  }

  const handleNewEvent = () => {
    setPanelMode('newEvent')
  }

  const closePanel = () => {
    setSelectedDate(null)
    setPanelMode(null)
    setShowForm(false)
  }

  return (
    <div className="relative h-full" style={{ background: 'var(--color-parchment-50)' }}>
      {/* Main calendar area */}
      <div className="flex flex-col overflow-hidden h-full">
        {/* Header */}
        <header className="flex items-center justify-between" style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-parchment-300)' }}>
          <div className="flex items-center gap-4">
            <div
              className="flex items-center p-1"
              style={{ background: 'var(--color-parchment-100)', border: '1px solid var(--color-parchment-300)', borderRadius: 'var(--radius-sm)' }}
            >
              <button onClick={handlePrev} className="p-1.5" style={{ borderRadius: 'var(--radius-sm)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-earth-500)' }}>chevron_left</span>
              </button>
              <h2 className="text-heading-4 px-4" style={{ margin: 0 }}>
                {MONTHS[currentMonth]} {currentYear}
              </h2>
              <button onClick={handleNext} className="p-1.5" style={{ borderRadius: 'var(--radius-sm)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-earth-500)' }}>chevron_right</span>
              </button>
            </div>
            <button onClick={handleToday} className="btn btn-secondary">Today</button>

            {/* Legend filters */}
            <div className="flex gap-3 items-center ml-2">
              {FILTER_KEYS.map(key => {
                const fc = EVENT_FILTER_COLORS[key]
                return (
                  <button
                    key={key}
                    onClick={() => toggleFilter(key)}
                    className="flex items-center gap-1.5 text-label-small"
                    style={{ opacity: filters[key] ? 1 : 0.4, transition: 'opacity 120ms ease', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: fc.dot }} />
                    {fc.label}
                  </button>
                )
              })}
            </div>

            {/* New Event button */}
            <button onClick={handleNewEvent} className="btn btn-primary ml-2">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
              New Event
            </button>
          </div>

          {/* View toggle — hidden when overlay panel is open */}
          {onToggleView && !panelMode && (
            <button onClick={onToggleView} className="btn btn-secondary">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>map</span>
              Map
            </button>
          )}
        </header>

        {/* Calendar grid */}
        <div className="flex-1 overflow-auto" style={{ padding: 24 }}>
          <div
            className="h-full flex flex-col overflow-hidden"
            style={{
              minHeight: 600,
              border: '1px solid var(--color-parchment-300)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-parchment-100)',
            }}
          >
            {/* Day headers */}
            <div className="grid grid-cols-7" style={{ borderBottom: '1px solid var(--color-parchment-300)', background: 'var(--color-parchment-200)' }}>
              {DAYS_SHORT_MON.map(day => (
                <div key={day} className="py-3 text-center text-label" style={{ color: 'var(--color-earth-400)' }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 flex-1">
              {days.map((day, i) => {
                const dayEvents = getEventsForDate(events, day.date)
                const today = isToday(day.date)
                const selected = isSameDay(activeSelectedDate, day.date)
                const visibleEvents = dayEvents.slice(0, MAX_VISIBLE_EVENTS)
                const overflowCount = dayEvents.length - MAX_VISIBLE_EVENTS

                return (
                  <button
                    key={i}
                    onClick={() => handleDayClick(day.date)}
                    className="text-left flex flex-col"
                    style={{
                      borderRight: '1px solid var(--color-parchment-300)',
                      borderBottom: '1px solid var(--color-parchment-300)',
                      padding: 8,
                      minHeight: 120,
                      transition: 'background 120ms ease',
                      background: !day.isCurrentMonth ? 'var(--color-parchment-200)'
                        : selected ? 'var(--color-parchment-50)'
                        : today ? 'rgba(78,140,53,0.06)'
                        : 'var(--color-parchment-50)',
                      outline: selected ? '2px solid var(--color-sage-500)' : 'none',
                      outlineOffset: -2,
                      zIndex: selected ? 10 : 'auto',
                      cursor: 'pointer',
                      border: 'none',
                      borderRight: '1px solid var(--color-parchment-300)',
                      borderBottom: '1px solid var(--color-parchment-300)',
                    }}
                  >
                    {today ? (
                      <span
                        className="flex items-center justify-center"
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: 'var(--color-sage-500)',
                          color: 'white',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                          fontWeight: 500,
                        }}
                      >
                        {day.date.getDate()}
                      </span>
                    ) : (
                      <span
                        className="text-data"
                        style={{
                          fontSize: 12,
                          color: !day.isCurrentMonth ? 'var(--color-parchment-300)'
                            : selected ? 'var(--color-sage-600)'
                            : 'var(--color-earth-400)',
                          fontWeight: 500,
                        }}
                      >
                        {day.date.getDate()}
                      </span>
                    )}

                    {day.isCurrentMonth && visibleEvents.length > 0 && (
                      <div className="mt-1 flex flex-col gap-1">
                        {visibleEvents.map(event => {
                          const colors = EVENT_TYPE_BG[event.type] || { bg: 'var(--color-parchment-200)', text: 'var(--color-earth-500)' }
                          return (
                            <div
                              key={event.id}
                              className="text-label-small truncate flex items-center gap-1"
                              style={{
                                padding: '2px 6px',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: colors.bg,
                                color: colors.text,
                              }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: 11 }}>
                                {EVENT_SUBTYPE_ICONS[event.subType] || 'event'}
                              </span>
                              {event.title}
                            </div>
                          )
                        })}
                        {overflowCount > 0 && (
                          <span className="text-body-small px-1" style={{ color: 'var(--color-earth-400)', fontSize: 8 }}>
                            +{overflowCount} more
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay panels — positioned absolute to avoid squashing the calendar */}
      {panelMode === 'agenda' && selectedDate && mode === 'view' && (
        <>
          <div onClick={closePanel} style={{ position: 'absolute', inset: 0, zIndex: 19 }} />
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, zIndex: 20, boxShadow: 'var(--shadow-lg)' }}>
            <CalendarDayPanel
              date={selectedDate}
              events={events}
              allEvents={allEvents}
              onClose={closePanel}
              onAddEvent={() => { setShowForm(true) }}
              showForm={showForm}
              onFormComplete={() => setShowForm(false)}
            />
          </div>
        </>
      )}
      {panelMode === 'newEvent' && mode === 'view' && (
        <>
          <div onClick={closePanel} style={{ position: 'absolute', inset: 0, zIndex: 19 }} />
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, zIndex: 20, boxShadow: 'var(--shadow-lg)' }}>
            <NewEventPanel
              selectedDate={selectedDate}
              events={events}
              onDateSelect={(date) => setSelectedDate(date)}
              onClose={closePanel}
            />
          </div>
        </>
      )}
    </div>
  )
}
