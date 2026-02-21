import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { formatDateKey } from '../../utils/dates'

export default function EventForm({ date, onComplete }) {
  const { addCustomEvent, showToast } = useApp()
  const [form, setForm] = useState({
    type: 'appointment',
    title: '',
    description: '',
    time: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return

    addCustomEvent({
      id: `custom-${Date.now()}`,
      date: formatDateKey(date),
      title: form.title,
      type: form.type,
      description: form.description,
      time: form.time,
    })

    showToast('Event created')
    onComplete?.()
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: 16 }} className="flex flex-col gap-3">
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
      <div className="flex gap-2" style={{ paddingTop: 4 }}>
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
          Create Event
        </button>
        <button type="button" onClick={onComplete} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  )
}
