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
    <aside style={{ width: 320, background: 'var(--color-parchment-50)', borderLeft: '1px solid var(--color-parchment-300)', display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--color-parchment-300)' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
          <h3 className="text-heading-3" style={{ color: 'var(--color-ink-900)', margin: 0 }}>Add New Event</h3>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-earth-400)' }}>close</span>
          </button>
        </div>
        <p className="text-body-small" style={{ color: 'var(--color-earth-400)' }}>Select a date on the calendar or enter it below</p>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <form onSubmit={handleSubmit} style={{ padding: 24 }} className="flex flex-col gap-3">
          <div>
            <label className="form-label">Date</label>
            <input
              type="date"
              value={dateInputValue}
              onChange={handleDateInput}
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">Type</label>
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              className="form-select"
            >
              <option value="appointment">Appointment</option>
              <option value="event">Event</option>
              <option value="reminder">Reminder</option>
            </select>
          </div>
          <div>
            <label className="form-label">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Event title..."
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Optional details..."
              rows={2}
              className="form-textarea"
            />
          </div>
          <div>
            <label className="form-label">Time</label>
            <input
              type="time"
              value={form.time}
              onChange={e => setForm({ ...form, time: e.target.value })}
              className="form-input"
            />
          </div>
          <div style={{ paddingTop: 4 }}>
            <button
              type="submit"
              disabled={!selectedDate || !form.title.trim()}
              className="btn btn-primary w-full"
              style={{ opacity: (!selectedDate || !form.title.trim()) ? 0.4 : 1 }}
            >
              Create Event
            </button>
          </div>
        </form>

        {/* Agenda for selected date */}
        {selectedDate && (
          <div style={{ padding: '0 24px 24px' }}>
            <div style={{ borderTop: '1px solid var(--color-parchment-300)', paddingTop: 20 }}>
              <p className="text-label" style={{ color: 'var(--color-earth-400)', marginBottom: 16 }}>
                Agenda for {formatAgendaDate(selectedDate)}
              </p>
              {dayEvents.length === 0 ? (
                <p className="text-body-small" style={{ color: 'var(--color-earth-400)', textAlign: 'center', padding: '16px 0' }}>No events on this day</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {dayEvents.map(event => {
                    const dotColor = EVENT_TYPE_COLORS[event.type] || 'var(--color-sage-500)'
                    return (
                      <div key={event.id} className="flex items-start gap-3 card" style={{ padding: 12 }}>
                        <div style={{ width: 6, alignSelf: 'stretch', borderRadius: 3, backgroundColor: dotColor, flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <h4 className="text-heading-4" style={{ color: 'var(--color-ink-900)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</h4>
                          {event.time && <p className="text-body-small" style={{ color: 'var(--color-earth-400)' }}>{event.time}</p>}
                          {event.fieldName && <p className="text-body-small" style={{ color: 'var(--color-earth-500)' }}>{event.fieldName}</p>}
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
