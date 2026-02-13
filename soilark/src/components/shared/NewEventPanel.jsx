import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { formatDateKey, DAYS_SHORT, MONTHS } from '../../utils/dates'
import { getEventsForDate } from '../../utils/events'
import { EVENT_TYPE_COLORS } from '../../constants/colors'

function formatAgendaDate(date) {
  const d = new Date(date)
  return `${DAYS_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`
}

export default function NewEventPanel({ selectedDate, events, onDateSelect, onClose }) {
  const { addCustomEvent, showToast } = useApp()
  const [form, setForm] = useState({
    type: 'appointment',
    title: '',
    description: '',
    time: '',
  })

  const dayEvents = selectedDate ? getEventsForDate(events, selectedDate) : []

  const dateInputValue = selectedDate
    ? formatDateKey(selectedDate)
    : ''

  const handleDateInput = (e) => {
    const val = e.target.value
    if (val) {
      // Parse YYYY-MM-DD, add timezone offset to avoid off-by-one
      const [y, m, d] = val.split('-').map(Number)
      onDateSelect(new Date(y, m - 1, d))
    } else {
      onDateSelect(null)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !selectedDate) return

    addCustomEvent({
      id: `custom-${Date.now()}`,
      date: formatDateKey(selectedDate),
      title: form.title,
      type: form.type,
      description: form.description,
      time: form.time,
    })

    showToast('Event created')
    setForm({ type: 'appointment', title: '', description: '', time: '' })
  }

  return (
    <aside className="w-80 bg-slate-50/80 border-l border-slate-200 flex flex-col shrink-0 h-full">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-slate-900">Add New Event</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded transition-colors">
            <span className="material-icons text-slate-400 text-lg">close</span>
          </button>
        </div>
        <p className="text-xs text-slate-400">Select a date on the calendar or enter it below</p>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          {/* Date input */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Date</label>
            <input
              type="date"
              value={dateInputValue}
              onChange={handleDateInput}
              className="mt-1 w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Type</label>
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              className="mt-1 w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
            >
              <option value="appointment">Appointment</option>
              <option value="event">Event</option>
              <option value="reminder">Reminder</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Event title..."
              className="mt-1 w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Optional details..."
              rows={2}
              className="mt-1 w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Time</label>
            <input
              type="time"
              value={form.time}
              onChange={e => setForm({ ...form, time: e.target.value })}
              className="mt-1 w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
            />
          </div>
          <div className="pt-1">
            <button
              type="submit"
              disabled={!selectedDate || !form.title.trim()}
              className="w-full py-2.5 bg-emerald-800 text-white text-sm font-bold rounded-lg hover:bg-emerald-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Create Event
            </button>
          </div>
        </form>

        {/* Agenda for selected date */}
        {selectedDate && (
          <div className="px-6 pb-6">
            <div className="border-t border-slate-200 pt-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Agenda for {formatAgendaDate(selectedDate)}
                </p>
              </div>
              {dayEvents.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No events on this day</p>
              ) : (
                <div className="space-y-3">
                  {dayEvents.map(event => {
                    const dotColor = EVENT_TYPE_COLORS[event.type] || '#3b82f6'
                    return (
                      <div key={event.id} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-slate-200">
                        <div className="w-1.5 self-stretch rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 truncate">{event.title}</h4>
                          {event.time && <p className="text-xs text-slate-400">{event.time}</p>}
                          {event.fieldName && <p className="text-xs text-slate-500">{event.fieldName}</p>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
