import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { formatDateKey } from '../../utils/dates'

export default function EventForm({ date, onComplete }) {
  const { fields, tasks, addCustomEvent, showToast } = useApp()
  const [form, setForm] = useState({
    type: 'task',
    title: '',
    description: '',
    time: '',
    fieldId: '',
    taskId: '',
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
      fieldId: form.fieldId,
      taskId: form.taskId,
      fieldName: form.fieldId ? fields.find(f => f.id === form.fieldId)?.name : null,
    })

    showToast('Event created')
    onComplete?.()
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3">
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase">Type</label>
        <select
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
          className="mt-1 w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
        >
          <option value="task">Task</option>
          <option value="field">Field Activity</option>
          <option value="custom">Appointment</option>
          <option value="service">Reminder</option>
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
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Time</label>
          <input
            type="time"
            value={form.time}
            onChange={e => setForm({ ...form, time: e.target.value })}
            className="mt-1 w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Field</label>
          <select
            value={form.fieldId}
            onChange={e => setForm({ ...form, fieldId: e.target.value })}
            className="mt-1 w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
          >
            <option value="">None</option>
            {fields.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="flex-1 py-2 bg-primary text-emerald-950 text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors"
        >
          Create Event
        </button>
        <button
          type="button"
          onClick={onComplete}
          className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
