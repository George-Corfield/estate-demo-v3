import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { getMonthDays, isToday, isSameDay, MONTHS, DAYS_SHORT_MON } from '../../utils/dates'
import { aggregateEvents, getEventsForDate } from '../../utils/events'
import { EVENT_TYPE_BG, EVENT_FILTER_COLORS, EVENT_TYPE_TO_FILTER, EVENT_SUBTYPE_ICONS } from '../../constants/colors'
import CalendarDayPanel from './CalendarDayPanel'
import NewEventPanel from './NewEventPanel'

const MAX_VISIBLE_EVENTS = 2

const FILTER_KEYS = ['task', 'service', 'event']

export default function Calendar({ onDaySelect, selectedDate: externalSelectedDate, mode = 'view', onToggleView, initialAddEvent = false }) {
  const { fields, tasks, customEvents } = useApp()
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState(null)
  const [filters, setFilters] = useState({ task: true, service: true, event: true })
  // panelMode: null | 'agenda' | 'newEvent'
  const [panelMode, setPanelMode] = useState(initialAddEvent ? 'newEvent' : null)
  const [showForm, setShowForm] = useState(false)

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
      // In new event mode, clicking a date selects it for the form
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
    <div className="flex h-full bg-white">
      {/* Main calendar area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="p-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1">
              <button onClick={handlePrev} className="p-1.5 hover:bg-white rounded-md transition-all">
                <span className="material-icons text-sm text-slate-500">chevron_left</span>
              </button>
              <h2 className="px-4 font-bold text-slate-800">
                {MONTHS[currentMonth]} {currentYear}
              </h2>
              <button onClick={handleNext} className="p-1.5 hover:bg-white rounded-md transition-all">
                <span className="material-icons text-sm text-slate-500">chevron_right</span>
              </button>
            </div>
            <button
              onClick={handleToday}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors"
            >
              Today
            </button>

            {/* Legend filters */}
            <div className="flex gap-3 items-center ml-2">
              {FILTER_KEYS.map(key => {
                const fc = EVENT_FILTER_COLORS[key]
                return (
                  <button
                    key={key}
                    onClick={() => toggleFilter(key)}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-opacity ${
                      filters[key] ? 'opacity-100' : 'opacity-40'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: fc.dot }} />
                    {fc.label}
                  </button>
                )
              })}
            </div>

            {/* New Event button */}
            <button
              onClick={handleNewEvent}
              className="flex items-center gap-2 bg-emerald-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-800 transition-colors ml-2"
            >
              <span className="material-icons text-lg">add</span>
              New Event
            </button>
          </div>

          {/* View toggle - right side */}
          {onToggleView && (
            <button
              onClick={onToggleView}
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <span className="material-icons text-base">map</span>
              Switch to Map
            </button>
          )}
        </header>

        {/* Calendar grid */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="h-full min-h-[600px] border border-slate-200 rounded-2xl overflow-hidden flex flex-col bg-slate-50/50">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80">
              {DAYS_SHORT_MON.map(day => (
                <div key={day} className="py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
                    className={`border-r border-b border-slate-200 p-2 text-left transition-colors min-h-[120px] flex flex-col ${
                      !day.isCurrentMonth ? 'bg-slate-50/60' :
                      selected ? 'bg-white ring-2 ring-primary ring-inset z-10' :
                      today ? 'bg-emerald-50/60' :
                      'bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    {today ? (
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">
                        {day.date.getDate()}
                      </span>
                    ) : (
                      <span className={`text-xs font-bold ${
                        !day.isCurrentMonth ? 'text-slate-300' :
                        selected ? 'text-emerald-600' :
                        'text-slate-400'
                      }`}>
                        {day.date.getDate()}
                      </span>
                    )}

                    {day.isCurrentMonth && visibleEvents.length > 0 && (
                      <div className="mt-1 flex flex-col gap-1">
                        {visibleEvents.map(event => {
                          const colors = EVENT_TYPE_BG[event.type] || { bg: '#dbeafe', text: '#1e40af' }
                          return (
                            <div
                              key={event.id}
                              className="px-2 py-1 text-[9px] font-bold rounded uppercase truncate flex items-center gap-1"
                              style={{ backgroundColor: colors.bg, color: colors.text }}
                            >
                              <span className="material-icons" style={{ fontSize: '11px' }}>
                                {EVENT_SUBTYPE_ICONS[event.subType] || 'event'}
                              </span>
                              {event.title}
                            </div>
                          )
                        })}
                        {overflowCount > 0 && (
                          <span className="text-[8px] text-slate-400 px-1 font-medium">
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

      {/* Sidebar panels */}
      {panelMode === 'agenda' && selectedDate && mode === 'view' && (
        <CalendarDayPanel
          date={selectedDate}
          events={events}
          allEvents={allEvents}
          onClose={closePanel}
          onAddEvent={() => { setShowForm(true) }}
          showForm={showForm}
          onFormComplete={() => setShowForm(false)}
        />
      )}
      {panelMode === 'newEvent' && mode === 'view' && (
        <NewEventPanel
          selectedDate={selectedDate}
          events={events}
          onDateSelect={(date) => setSelectedDate(date)}
          onClose={closePanel}
        />
      )}
    </div>
  )
}
