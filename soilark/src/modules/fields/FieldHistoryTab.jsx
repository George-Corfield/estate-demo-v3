import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { formatShortDate, formatDateKey } from '../../utils/dates'

export default function FieldHistoryTab({ field }) {
  const { addFieldActivity, showToast } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', details: '', date: formatDateKey(new Date()) })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return

    addFieldActivity(field.id, {
      id: `act-${Date.now()}`,
      date: form.date,
      title: form.title,
      details: form.details,
      user: 'John Smith',
    })

    showToast('Note added')
    setForm({ title: '', details: '', date: formatDateKey(new Date()) })
    setShowForm(false)
  }

  const activities = [...(field.activities || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  return (
    <div className="p-5">
      {/* Add note button/form */}
      <div className="mb-5">
        {showForm ? (
          <form onSubmit={handleSubmit} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Activity Title</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Soil Sampling"
                className="mt-1 w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Details</label>
              <textarea
                value={form.details}
                onChange={e => setForm({ ...form, details: e.target.value })}
                placeholder="Describe the activity..."
                rows={3}
                className="mt-1 w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="mt-1 w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-2 bg-primary text-emerald-950 text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors">
                Save Note
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-300 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:border-primary hover:text-primary transition-colors"
          >
            + Add Field Note
          </button>
        )}
      </div>

      {/* Timeline */}
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
        Activity History
        <span className="text-slate-400 ml-1">({activities.length})</span>
      </h3>

      {activities.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">No activity recorded yet</p>
      ) : (
        <div className="space-y-0">
          {activities.map((activity, i) => (
            <div key={activity.id} className="flex gap-4 relative">
              <div className="flex-none flex flex-col items-center">
                <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-primary ring-4 ring-primary/20' : 'bg-slate-300'}`} />
                {i < activities.length - 1 && (
                  <div className="w-px flex-1 bg-slate-200 mt-1" />
                )}
              </div>
              <div className="pb-6">
                <p className="text-sm font-semibold text-slate-800">{activity.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatShortDate(activity.date)} · {activity.user}
                </p>
                {activity.details && (
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{activity.details}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
