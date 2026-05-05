import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { aggregateEvents, getEventsForDate } from '../../utils/events'
import { EVENT_TYPE_TO_FILTER, EVENT_TYPE_COLORS, EVENT_SUBTYPE_ICONS } from '../../constants/colors'
import MobileCalendarStrip from './MobileCalendarStrip'
import MobileFilterBar from './MobileFilterBar'
import MobileAgendaList from './MobileAgendaList'
import MobileBottomSheet from './MobileBottomSheet'
import NewEventPanel from './NewEventPanel'

function SheetAgenda({ date, events }) {
  const dayEvents = getEventsForDate(events, date)

  if (dayEvents.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-slate-400)' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 32, marginBottom: 8, display: 'block' }}>event_busy</span>
        <p style={{ fontSize: 14 }}>No events for this day</p>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative' }} className="flex flex-col gap-5">
      <div style={{ position: 'absolute', left: 11, top: 8, bottom: 8, width: 2, background: 'var(--color-surface-200)' }} />
      {dayEvents.map(event => {
        const dotColor = EVENT_TYPE_COLORS[event.type] || 'var(--color-green-500)'
        return (
          <div key={event.id} style={{ position: 'relative', paddingLeft: 32 }}>
            <div style={{
              position: 'absolute', left: 0, top: 6,
              width: 24, height: 24,
              background: 'var(--color-surface-50)',
              border: `2px solid ${dotColor}`,
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 12, color: dotColor }}>
                {EVENT_SUBTYPE_ICONS[event.subType] || 'event'}
              </span>
            </div>
            {event.time && (
              <span style={{ fontSize: 11, color: 'var(--color-slate-400)', display: 'block', marginBottom: 2 }}>{event.time}</span>
            )}
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-slate-900)', margin: '0 0 2px' }}>
              {event.title}
            </h4>
            {event.fieldName && (
              <p style={{ fontSize: 12, color: 'var(--color-slate-500)', margin: 0 }}>{event.fieldName}</p>
            )}
            {(event.details || event.description) && (
              <p style={{ fontSize: 12, color: 'var(--color-slate-500)', margin: '2px 0 0' }}>{event.details || event.description}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function MobileCalendar({ onDaySelect, selectedDate: externalSelectedDate, mode = 'view' }) {
  const { fields, tasks, customEvents, machinery } = useApp()
  const [selectedDate, setSelectedDate] = useState(null)
  const [filters, setFilters] = useState({ task: true, service: true, event: true })
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetMode, setSheetMode] = useState('agenda') // 'agenda' | 'newEvent'

  const activeSelectedDate = externalSelectedDate || selectedDate

  const allEvents = useMemo(
    () => aggregateEvents(fields, tasks, customEvents, machinery),
    [fields, tasks, customEvents, machinery]
  )

  const filteredEvents = useMemo(
    () => allEvents.filter(e => {
      const filterGroup = EVENT_TYPE_TO_FILTER[e.type] || 'event'
      return filters[filterGroup] !== false
    }),
    [allEvents, filters]
  )

  const toggleFilter = (key) => {
    setFilters(f => ({ ...f, [key]: !f[key] }))
  }

  const handleDayTap = (date) => {
    if (mode === 'select' && onDaySelect) {
      onDaySelect(date)
      return
    }
    setSelectedDate(date)
    setSheetMode('agenda')
    setSheetOpen(true)
  }

  const handleAddEvent = () => {
    setSheetMode('newEvent')
  }

  const closeSheet = () => {
    setSheetOpen(false)
    setSheetMode('agenda')
  }

  const sheetDate = activeSelectedDate

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-surface-50)', overflow: 'hidden' }}>
      {/* Strip */}
      <MobileCalendarStrip
        events={filteredEvents}
        selectedDate={activeSelectedDate}
        onDaySelect={handleDayTap}
      />

      {/* Filter bar */}
      <MobileFilterBar filters={filters} onToggle={toggleFilter} />

      {/* Agenda list */}
      <MobileAgendaList
        events={filteredEvents}
        selectedDate={activeSelectedDate}
        onDayTap={handleDayTap}
        onEventTap={handleDayTap}
      />

      {/* Bottom sheet */}
      <MobileBottomSheet
        isOpen={sheetOpen}
        date={sheetDate}
        onClose={closeSheet}
        onAddEvent={handleAddEvent}
      >
        {sheetMode === 'newEvent' ? (
          <div style={{ margin: '-16px -20px' }}>
            <NewEventPanel
              selectedDate={sheetDate}
              events={filteredEvents}
              onDateSelect={setSelectedDate}
              onClose={closeSheet}
              isMobile
            />
          </div>
        ) : (
          <SheetAgenda
            date={sheetDate || new Date()}
            events={filteredEvents}
          />
        )}
      </MobileBottomSheet>
    </div>
  )
}
