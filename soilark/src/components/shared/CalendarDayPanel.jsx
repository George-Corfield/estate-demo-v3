import { useMemo, useState } from 'react'
import { formatDateKey, DAYS_SHORT, MONTHS } from '../../utils/dates'
import { getEventsForDate } from '../../utils/events'
import { EVENT_TYPE_COLORS, EVENT_SUBTYPE_ICONS } from '../../constants/colors'
import EventForm from './EventForm'

function formatAgendaDate(date) {
  const d = new Date(date)
  const dayName = DAYS_SHORT[d.getDay()]
  const day = d.getDate()
  const month = MONTHS[d.getMonth()]
  return `${dayName}, ${day} ${month}`
}

function formatAgendaDateShort(date) {
  const d = new Date(date)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[d.getMonth()]} ${d.getDate()}`
}

function getUpNextEvents(allEvents, currentDate) {
  const currentKey = formatDateKey(currentDate)
  const upcoming = allEvents
    .filter(e => formatDateKey(e.date) > currentKey)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
  return upcoming.slice(0, 1)
}

function getRelativeDay(eventDate, referenceDate) {
  const event = new Date(eventDate)
  const ref = new Date(referenceDate)
  event.setHours(0, 0, 0, 0)
  ref.setHours(0, 0, 0, 0)
  const diffDays = Math.round((event - ref) / (1000 * 60 * 60 * 24))
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === 0) return 'Today'
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`
  return formatAgendaDateShort(eventDate)
}

export default function CalendarDayPanel({ date, events, allEvents, onClose, onAddEvent, showForm, onFormComplete, bookingMachine = null, onBookingConfirmed }) {
  const dayEvents = getEventsForDate(events, date)
  const upNext = useMemo(() => getUpNextEvents(allEvents || events, date), [allEvents, events, date])
  const [bookingPhase, setBookingPhase] = useState('confirm') // 'confirm' | 'time'
  const [bookingTime, setBookingTime] = useState('09:00')

  const handleFormComplete = () => {
    onFormComplete?.()
  }

  return (
    <aside style={{ width: 320, background: 'var(--color-surface-50)', borderLeft: '1px solid var(--color-surface-300)', display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100%' }}>
      {/* Agenda header */}
      <div style={{ padding: 24, flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
        <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
          <div>
            <p className="text-label" style={{ color: 'var(--color-slate-400)' }}>Agenda</p>
            <h3 className="text-heading-3" style={{ color: 'var(--color-slate-900)', margin: 0 }}>{formatAgendaDate(date)}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-neutral">{formatAgendaDateShort(date)}</span>
            <button onClick={onClose} className="btn btn-ghost" style={{ padding: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-slate-400)' }}>close</span>
            </button>
          </div>
        </div>

        {/* Event form */}
        {showForm && (
          <div style={{ marginBottom: 24, background: 'var(--color-surface-100)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-300)', overflow: 'hidden' }}>
            <EventForm date={date} onComplete={handleFormComplete} />
          </div>
        )}

        {/* Today's Events header */}
        <p className="text-label" style={{ color: 'var(--color-slate-400)', marginBottom: 12 }}>Today's Events</p>

        {/* Timeline events */}
        {dayEvents.length === 0 && !showForm ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-slate-400)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 32, marginBottom: 8, display: 'block' }}>event_busy</span>
            <p className="text-body">No events for this day</p>
          </div>
        ) : (
          <div style={{ position: 'relative' }} className="flex flex-col gap-6">
            <div style={{ position: 'absolute', left: 11, top: 8, bottom: 8, width: 2, background: 'var(--color-surface-200)' }} />
            {dayEvents.map((event) => {
              const dotColor = EVENT_TYPE_COLORS[event.type] || 'var(--color-green-500)'
              return (
                <div key={event.id} style={{ position: 'relative', paddingLeft: 32 }}>
                  {/* Timeline dot */}
                  <div
                    style={{
                      position: 'absolute', left: 0, top: 6,
                      width: 24, height: 24,
                      background: 'var(--color-surface-50)',
                      border: `2px solid ${dotColor}`,
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      zIndex: 10,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 12, color: dotColor }}>
                      {EVENT_SUBTYPE_ICONS[event.subType] || 'event'}
                    </span>
                  </div>

                  {/* Time */}
                  {event.time && (
                    <div className="flex justify-between items-start" style={{ marginBottom: 4 }}>
                      <span className="text-label-small" style={{ color: 'var(--color-slate-400)' }}>{event.time}</span>
                      {event.priority === 'high' && (
                        <span style={{ width: 6, height: 6, background: 'var(--color-amber-400)', borderRadius: '50%' }} />
                      )}
                    </div>
                  )}

                  {/* Event content */}
                  <h4 className="text-heading-4 flex items-center gap-1" style={{ color: 'var(--color-slate-900)', margin: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                      {EVENT_SUBTYPE_ICONS[event.subType] || 'event'}
                    </span>
                    {event.title}
                  </h4>
                  {event.fieldName && (
                    <p className="text-body-small" style={{ color: 'var(--color-slate-500)' }}>{event.fieldName}</p>
                  )}
                  {event.details && (
                    <p className="text-body-small" style={{ color: 'var(--color-slate-500)', marginTop: 2 }}>{event.details}</p>
                  )}
                  {event.description && (
                    <p className="text-body-small" style={{ color: 'var(--color-slate-500)', marginTop: 2 }}>{event.description}</p>
                  )}

                  {/* Assignees */}
                  {event.assignedTo && event.assignedTo.length > 0 && (
                    <div className="flex" style={{ marginTop: 8, gap: -6 }}>
                      {event.assignedTo.slice(0, 2).map((person, pIdx) => (
                        <div
                          key={pIdx}
                          style={{
                            width: 24, height: 24, borderRadius: '50%',
                            background: 'var(--color-green-600)',
                            border: '2px solid var(--color-surface-50)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 8, color: 'white', fontWeight: 700, textTransform: 'uppercase',
                            marginLeft: pIdx > 0 ? -6 : 0,
                          }}
                        >
                          {person.split(' ').map(w => w[0]).join('')}
                        </div>
                      ))}
                      {event.assignedTo.length > 2 && (
                        <div
                          style={{
                            width: 24, height: 24, borderRadius: '50%',
                            background: 'var(--color-surface-200)',
                            border: '2px solid var(--color-surface-50)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 8, color: 'var(--color-slate-600)', fontWeight: 700,
                            marginLeft: -6,
                          }}
                        >
                          +{event.assignedTo.length - 2}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Up Next section */}
        {/* {upNext.length > 0 && (
          <div style={{ marginTop: 48, paddingTop: 48, borderTop: '1px solid var(--color-surface-300)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
              <p className="text-label" style={{ color: 'var(--color-slate-400)' }}>Coming Up</p>
              <span className="badge badge-healthy">{upNext.length} Event</span>
            </div>
            {upNext.map(event => {
              const dotColor = EVENT_TYPE_COLORS[event.type] || 'var(--color-green-500)'
              return (
                <div key={event.id} className="card" style={{ padding: 16 }}>
                  <div className="flex items-start gap-3">
                    <div style={{ width: 6, alignSelf: 'stretch', borderRadius: 3, backgroundColor: dotColor }} />
                    <div>
                      <h4 className="text-heading-4 flex items-center gap-1" style={{ color: 'var(--color-slate-900)', margin: 0 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14, color: dotColor }}>
                          {EVENT_SUBTYPE_ICONS[event.subType] || 'event'}
                        </span>
                        {event.title}
                      </h4>
                      <p className="text-body-small" style={{ color: 'var(--color-slate-500)', marginTop: 4 }}>
                        {event.fieldName && `${event.fieldName} \u00b7 `}
                        {getRelativeDay(event.date, date)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )} */}
      </div>

      {/* Booking footer */}
      {bookingMachine ? (
        <div style={{
          padding: 16,
          borderTop: '2px solid rgba(245,158,11,0.4)',
          background: 'rgba(245,158,11,0.06)',
          flexShrink: 0,
        }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined" style={{ fontSize: 15, color: 'var(--color-amber-700, #92400e)' }}>build</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-amber-700, #92400e)' }}>{bookingMachine.name}</span>
          </div>
          {bookingPhase === 'confirm' ? (
            <button
              onClick={() => setBookingPhase('time')}
              style={{
                width: '100%',
                padding: '8px 0',
                background: 'rgba(245,158,11,0.2)',
                border: '1px solid rgba(245,158,11,0.4)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--color-amber-700, #92400e)',
                cursor: 'pointer',
              }}
            >
              Confirm Date
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <input
                type="time"
                value={bookingTime}
                onChange={e => setBookingTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(245,158,11,0.4)',
                  background: 'white',
                  fontSize: 13,
                  color: 'var(--color-slate-700)',
                }}
              />
              <button
                onClick={() => onBookingConfirmed?.(bookingMachine, formatDateKey(date), bookingTime)}
                style={{
                  width: '100%',
                  padding: '8px 0',
                  background: 'rgba(245,158,11,0.8)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Book Service
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: 24, borderTop: '1px solid var(--color-surface-300)', background: 'var(--color-surface-50)' }}>
          <button
            onClick={onAddEvent}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
            Add Event
          </button>
        </div>
      )}
    </aside>
  )
}
