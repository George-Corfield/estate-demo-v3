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
    <div style={{ padding: 20 }}>
      {/* Add note button/form */}
      <div style={{ marginBottom: 20 }}>
        {showForm ? (
          <form onSubmit={handleSubmit} className="card" style={{ padding: 16 }}>
            <div className="flex flex-col gap-3">
              <div>
                <label className="form-label">Activity Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Soil Sampling"
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">Details</label>
                <textarea
                  value={form.details}
                  onChange={e => setForm({ ...form, details: e.target.value })}
                  placeholder="Describe the activity..."
                  rows={3}
                  className="form-textarea"
                />
              </div>
              <div>
                <label className="form-label">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary flex-1">Save Note</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full"
            style={{
              padding: '10px 0',
              border: '2px dashed var(--color-parchment-300)',
              borderRadius: 'var(--radius-md)',
              background: 'transparent',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--color-earth-500)',
              cursor: 'pointer',
              transition: 'all 120ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--color-sage-500)'
              e.currentTarget.style.color = 'var(--color-sage-500)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--color-parchment-300)'
              e.currentTarget.style.color = 'var(--color-earth-500)'
            }}
          >
            + Add Field Note
          </button>
        )}
      </div>

      {/* Timeline */}
      <h3 className="text-label mb-4" style={{ color: 'var(--color-earth-400)' }}>
        Activity History
        <span style={{ color: 'var(--color-earth-400)', marginLeft: 4 }}>({activities.length})</span>
      </h3>

      {activities.length === 0 ? (
        <p className="text-body" style={{ color: 'var(--color-earth-400)', textAlign: 'center', padding: '32px 0' }}>No activity recorded yet</p>
      ) : (
        <div className="flex flex-col">
          {activities.map((activity, i) => (
            <div key={activity.id} className="flex gap-4 relative">
              <div className="flex-none flex flex-col items-center">
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: i === 0 ? 'var(--color-sage-500)' : 'var(--color-parchment-300)',
                    boxShadow: i === 0 ? '0 0 0 4px rgba(78,140,53,0.15)' : 'none',
                  }}
                />
                {i < activities.length - 1 && (
                  <div className="flex-1 mt-1" style={{ width: 1, background: 'var(--color-parchment-300)' }} />
                )}
              </div>
              <div style={{ paddingBottom: 24 }}>
                <p className="text-heading-4" style={{ color: 'var(--color-ink-900)', margin: 0 }}>{activity.title}</p>
                <p className="text-body-small" style={{ color: 'var(--color-earth-400)', marginTop: 2 }}>
                  {formatShortDate(activity.date)} · {activity.user}
                </p>
                {activity.details && (
                  <p className="text-body-small" style={{ color: 'var(--color-earth-600)', marginTop: 6 }}>{activity.details}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
