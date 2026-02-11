import { useState } from 'react'
import { formatFullDate } from '../../utils/dates'
import { getEventsForDate } from '../../utils/events'
import { EVENT_TYPE_COLORS } from '../../constants/colors'
import EventForm from './EventForm'

export default function CalendarDayPanel({ date, events, onClose }) {
  const [showForm, setShowForm] = useState(false)
  const dayEvents = getEventsForDate(events, date)

  return (
    <div className="w-[380px] border-l border-slate-200 bg-white flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm">{formatFullDate(date)}</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs font-medium text-primary hover:bg-primary/5 px-2 py-1 rounded transition-colors"
          >
            + Add Event
          </button>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <span className="material-icons text-slate-400 text-lg">close</span>
          </button>
        </div>
      </div>

      {/* Event form */}
      {showForm && (
        <div className="border-b border-slate-100">
          <EventForm date={date} onComplete={() => setShowForm(false)} />
        </div>
      )}

      {/* Events list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {dayEvents.length === 0 && !showForm ? (
          <div className="text-center py-12 text-slate-400">
            <span className="material-icons text-3xl mb-2 block">event_busy</span>
            <p className="text-sm">No events for this day</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-3 text-xs font-medium text-primary hover:underline"
            >
              + Add Event
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
                style={{ borderLeftWidth: '3px', borderLeftColor: EVENT_TYPE_COLORS[event.type] || EVENT_TYPE_COLORS.custom }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{event.title}</p>
                    <p className="text-xs text-slate-500 capitalize mt-0.5">{event.type}</p>
                  </div>
                </div>
                {event.fieldName && (
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <span className="material-icons text-xs">landscape</span>
                    {event.fieldName}
                  </p>
                )}
                {event.assignedTo && event.assignedTo.length > 0 && (
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <span className="material-icons text-xs">person</span>
                    {event.assignedTo.join(', ')}
                  </p>
                )}
                {event.details && (
                  <p className="text-xs text-slate-500 mt-2">{event.details}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
