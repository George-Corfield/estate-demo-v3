import { useMemo } from 'react'
import { formatDateKey, DAYS_SHORT, MONTHS } from '../../utils/dates'
import { getEventsForDate } from '../../utils/events'
import { EVENT_TYPE_COLORS } from '../../constants/colors'
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

export default function CalendarDayPanel({ date, events, allEvents, onClose, onAddEvent, showForm, onFormComplete }) {
  const dayEvents = getEventsForDate(events, date)
  const upNext = useMemo(() => getUpNextEvents(allEvents || events, date), [allEvents, events, date])

  const handleFormComplete = () => {
    onFormComplete?.()
  }

  return (
    <aside className="w-80 bg-slate-50/80 border-l border-slate-200 flex flex-col shrink-0 h-full">
      {/* Agenda header */}
      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agenda</p>
            <h3 className="text-lg font-bold text-slate-900">{formatAgendaDate(date)}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded font-bold uppercase">
              {formatAgendaDateShort(date)}
            </span>
            <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded transition-colors">
              <span className="material-icons text-slate-400 text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Event form */}
        {showForm && (
          <div className="mb-6 bg-white rounded-xl border border-slate-200 overflow-hidden">
            <EventForm date={date} onComplete={handleFormComplete} />
          </div>
        )}

        {/* Timeline events */}
        {dayEvents.length === 0 && !showForm ? (
          <div className="text-center py-12 text-slate-400">
            <span className="material-icons text-3xl mb-2 block">event_busy</span>
            <p className="text-sm">No events for this day</p>
          </div>
        ) : (
          <div className="space-y-6 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
            {dayEvents.map((event, idx) => {
              const dotColor = EVENT_TYPE_COLORS[event.type] || '#3b82f6'
              return (
                <div key={event.id} className="relative pl-8">
                  {/* Timeline dot */}
                  <div
                    className="absolute left-0 top-1.5 w-6 h-6 bg-white border-2 rounded-full flex items-center justify-center z-10"
                    style={{ borderColor: dotColor }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
                  </div>

                  {/* Time */}
                  {event.time && (
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-slate-400">{event.time}</span>
                      {event.priority === 'high' && (
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      )}
                    </div>
                  )}

                  {/* Event content */}
                  <h4 className="text-sm font-bold text-slate-800">{event.title}</h4>
                  {event.fieldName && (
                    <p className="text-xs text-slate-500">{event.fieldName}</p>
                  )}
                  {event.details && (
                    <p className="text-xs text-slate-500 mt-0.5">{event.details}</p>
                  )}

                  {/* Assignees */}
                  {event.assignedTo && event.assignedTo.length > 0 && (
                    <div className="flex mt-2 -space-x-1.5">
                      {event.assignedTo.slice(0, 2).map((person, pIdx) => (
                        <div
                          key={pIdx}
                          className="w-6 h-6 rounded-full bg-emerald-700 border-2 border-white flex items-center justify-center text-[8px] text-white font-bold uppercase"
                        >
                          {person.split(' ').map(w => w[0]).join('')}
                        </div>
                      ))}
                      {event.assignedTo.length > 2 && (
                        <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] text-slate-600 font-bold">
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
        {upNext.length > 0 && (
          <div className="mt-12 pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Up Next</p>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase">
                {upNext.length} Event
              </span>
            </div>
            {upNext.map(event => {
              const dotColor = EVENT_TYPE_COLORS[event.type] || '#3b82f6'
              return (
                <div key={event.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 self-stretch rounded-full" style={{ backgroundColor: dotColor }} />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{event.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {event.fieldName && `${event.fieldName} • `}
                        {getRelativeDay(event.date, date)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Bottom Add Event button */}
      <div className="p-6 border-t border-slate-200 bg-white">
        <button
          onClick={onAddEvent}
          className="w-full bg-emerald-800 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-900 transition-colors"
        >
          <span className="material-icons text-lg">add</span>
          Add Event
        </button>
      </div>
    </aside>
  )
}
