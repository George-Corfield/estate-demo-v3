import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatDateWithTime, formatDateKey } from '../../utils/dates'

const TYPE_CONFIG = {
  task: { icon: 'task', color: 'var(--color-blue-500, #3b82f6)', label: 'Tasks' },
  calendar_event: { icon: 'event', color: 'var(--color-purple-500, #a855f7)', label: 'Events' },
  observation: { icon: 'visibility', color: 'var(--color-amber-500, #f59e0b)', label: 'Observations' },
  inspection: { icon: 'fact_check', color: 'var(--color-teal-500, #14b8a6)', label: 'Inspections' },
  note: { icon: 'note', color: 'var(--color-slate-500)', label: 'Notes' },
}

const FILTERS = [
  { id: 'all', label: 'All', icon: 'list' },
  { id: 'task', label: 'Tasks', icon: 'task' },
  { id: 'calendar_event', label: 'Events', icon: 'event' },
  { id: 'observation', label: 'Observations', icon: 'visibility' },
  { id: 'inspection', label: 'Inspections', icon: 'fact_check' },
  { id: 'note', label: 'Notes', icon: 'note' },
]

const TASK_ACTION_COLORS = {
  created: { bg: 'rgba(59,130,246,0.1)', text: 'var(--color-blue-500, #3b82f6)' },
  started: { bg: 'rgba(245,158,11,0.1)', text: 'var(--color-amber-500, #f59e0b)' },
  completed: { bg: 'rgba(34,197,94,0.1)', text: 'var(--color-green-500)' },
}

function LinkChip({ icon, label, onClick }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick() }}
      className="flex items-center gap-1"
      style={{
        padding: '2px 8px',
        borderRadius: 'var(--radius-full, 9999px)',
        border: '1px solid var(--color-surface-300)',
        background: 'var(--color-surface-100, #f8fafc)',
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--color-slate-700)',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        transition: 'all 120ms ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--color-green-500)'
        e.currentTarget.style.color = 'var(--color-green-600, #166534)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--color-surface-300)'
        e.currentTarget.style.color = 'var(--color-slate-700)'
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 13 }}>{icon}</span>
      {label}
    </button>
  )
}

function DetailRow({ icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-2" style={{ fontSize: 13, color: 'var(--color-slate-700)' }}>
      <span className="material-symbols-outlined" style={{ fontSize: 15, color: 'var(--color-slate-400)', marginTop: 1 }}>{icon}</span>
      <span style={{ color: 'var(--color-slate-500)', minWidth: 70 }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  )
}

export default function FieldHistoryTab({ field }) {
  const { addFieldActivity, showToast, customEvents, machinery, tasks, staff } = useApp()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const [form, setForm] = useState({
    title: '',
    details: '',
    date: formatDateKey(new Date()),
    time: '12:00',
    machineryUsed: '',
    inputUsed: '',
    quantity: '',
    rate: '',
    units: '',
    files: [],
  })

  const timeline = useMemo(() => {
    const entries = [...(field.activities || [])]

    const calendarEntries = (customEvents || [])
      .filter(evt => evt.fieldIds?.includes(field.id))
      .map(evt => ({
        id: `cal-${evt.id}`,
        timestamp: `${evt.date}T${evt.time || '09:00'}:00`,
        type: 'calendar_event',
        title: evt.title,
        completedBy: null,
        details: evt.description,
        notes: null,
        linkedTaskId: null,
        taskAction: null,
        linkedEventId: evt.id,
        machineryUsed: null,
        inputUsed: null,
        quantity: null,
        rate: null,
        units: null,
        evidence: [],
        source: 'calendar',
      }))

    return [...entries, ...calendarEntries].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    )
  }, [field.activities, customEvents, field.id])

  const filtered = activeFilter === 'all'
    ? timeline
    : timeline.filter(e => e.type === activeFilter)

  const findStaffByName = (name) => {
    if (!name || !staff) return null
    return staff.find(s => s.name === name)
  }

  const findMachineryByName = (name) => {
    if (!name || !machinery) return null
    const names = name.split(', ')
    return names.map(n => machinery.find(m => m.name === n)).filter(Boolean)
  }

  const findTask = (taskId) => {
    if (!taskId || !tasks) return null
    return tasks.find(t => t.id === taskId)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return

    const timestamp = `${form.date}T${form.time}:00`
    const evidence = form.files.map(f => ({ name: f.name, type: f.name.split('.').pop() || 'file' }))

    addFieldActivity(field.id, {
      id: `hist-${Date.now()}`,
      timestamp,
      type: 'note',
      title: form.title,
      completedBy: 'John Smith',
      details: form.details,
      notes: null,
      linkedTaskId: null,
      taskAction: null,
      linkedEventId: null,
      machineryUsed: form.machineryUsed || null,
      inputUsed: form.inputUsed || null,
      quantity: form.quantity ? Number(form.quantity) : null,
      rate: form.rate ? Number(form.rate) : null,
      units: form.units || null,
      evidence,
      source: 'manual',
    })

    showToast('Note added')
    setForm({ title: '', details: '', date: formatDateKey(new Date()), time: '12:00', machineryUsed: '', inputUsed: '', quantity: '', rate: '', units: '', files: [] })
    setShowForm(false)
  }

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  return (
    <div style={{ padding: 20 }}>
      {/* Add note button/form */}
      <div style={{ marginBottom: 20 }}>
        {showForm ? (
          <form onSubmit={handleSubmit} className="card" style={{ padding: 16 }}>
            <div className="flex flex-col gap-3">
              <div>
                <label className="form-label">Title</label>
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
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div style={{ width: 120 }}>
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Machinery Used</label>
                <select
                  value={form.machineryUsed}
                  onChange={e => setForm({ ...form, machineryUsed: e.target.value })}
                  className="form-input"
                >
                  <option value="">None</option>
                  {(machinery || []).map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="form-label">Input / Product</label>
                  <input
                    type="text"
                    value={form.inputUsed}
                    onChange={e => setForm({ ...form, inputUsed: e.target.value })}
                    placeholder="e.g. NPK 20-10-10"
                    className="form-input"
                  />
                </div>
                <div style={{ width: 90 }}>
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={e => setForm({ ...form, quantity: e.target.value })}
                    className="form-input"
                    step="any"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <div style={{ width: 90 }}>
                  <label className="form-label">Rate</label>
                  <input
                    type="number"
                    value={form.rate}
                    onChange={e => setForm({ ...form, rate: e.target.value })}
                    className="form-input"
                    step="any"
                  />
                </div>
                <div className="flex-1">
                  <label className="form-label">Units</label>
                  <input
                    type="text"
                    value={form.units}
                    onChange={e => setForm({ ...form, units: e.target.value })}
                    placeholder="e.g. kg/ha"
                    className="form-input"
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Attachments</label>
                <input
                  type="file"
                  multiple
                  onChange={e => setForm({ ...form, files: Array.from(e.target.files) })}
                  className="form-input"
                  style={{ padding: 6 }}
                />
                {form.files.length > 0 && (
                  <p className="text-body-small" style={{ color: 'var(--color-slate-500)', marginTop: 4 }}>
                    {form.files.length} file{form.files.length !== 1 ? 's' : ''} selected
                  </p>
                )}
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
              border: '2px dashed var(--color-surface-300)',
              borderRadius: 'var(--radius-md)',
              background: 'transparent',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--color-slate-500)',
              cursor: 'pointer',
              transition: 'all 120ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--color-green-500)'
              e.currentTarget.style.color = 'var(--color-green-500)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--color-surface-300)'
              e.currentTarget.style.color = 'var(--color-slate-500)'
            }}
          >
            + Add Field Note
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap" style={{ marginBottom: 16 }}>
        {FILTERS.map(f => {
          const isActive = activeFilter === f.id
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className="flex items-center gap-1"
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-full, 9999px)',
                border: `1px solid ${isActive ? 'var(--color-green-500)' : 'var(--color-surface-300)'}`,
                background: isActive ? 'rgba(78,140,53,0.1)' : 'transparent',
                color: isActive ? 'var(--color-green-600, #166534)' : 'var(--color-slate-500)',
                fontSize: 12,
                fontWeight: 500,
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
                transition: 'all 120ms ease',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{f.icon}</span>
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Timeline header */}
      <h3 className="text-label mb-4" style={{ color: 'var(--color-slate-400)' }}>
        History
        <span style={{ color: 'var(--color-slate-400)', marginLeft: 4 }}>({filtered.length})</span>
      </h3>

      {filtered.length === 0 ? (
        <p className="text-body" style={{ color: 'var(--color-slate-400)', textAlign: 'center', padding: '32px 0' }}>
          No entries found
        </p>
      ) : (
        <div className="flex flex-col">
          {filtered.map((entry, i) => {
            const config = TYPE_CONFIG[entry.type] || TYPE_CONFIG.note
            const isExpanded = expandedId === entry.id
            const matchedStaff = findStaffByName(entry.completedBy)
            const matchedMachinery = findMachineryByName(entry.machineryUsed)
            const matchedTask = findTask(entry.linkedTaskId)

            const hasExpandedContent = entry.details || entry.notes || entry.machineryUsed
              || entry.inputUsed || entry.quantity != null || entry.rate != null
              || entry.evidence?.length > 0 || entry.linkedTaskId || entry.completedBy

            return (
              <div key={entry.id} className="flex gap-4 relative">
                {/* Timeline dot */}
                <div className="flex-none flex flex-col items-center">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: `${config.color}20`,
                      flexShrink: 0,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: config.color }}>
                      {config.icon}
                    </span>
                  </div>
                  {i < filtered.length - 1 && (
                    <div className="flex-1 mt-1" style={{ width: 1, background: 'var(--color-surface-300)' }} />
                  )}
                </div>

                {/* Entry content — clickable */}
                <div
                  onClick={() => hasExpandedContent && toggleExpand(entry.id)}
                  style={{
                    paddingBottom: 24,
                    flex: 1,
                    minWidth: 0,
                    cursor: hasExpandedContent ? 'pointer' : 'default',
                  }}
                >
                  {/* Collapsed view — always visible */}
                  <div className="flex items-start gap-2 flex-wrap">
                    <p className="text-heading-4" style={{ color: 'var(--color-slate-900)', margin: 0 }}>
                      {entry.title}
                    </p>
                    {entry.taskAction && TASK_ACTION_COLORS[entry.taskAction] && (
                      <span
                        style={{
                          display: 'inline-flex',
                          padding: '1px 8px',
                          borderRadius: 'var(--radius-full, 9999px)',
                          fontSize: 11,
                          fontWeight: 600,
                          background: TASK_ACTION_COLORS[entry.taskAction].bg,
                          color: TASK_ACTION_COLORS[entry.taskAction].text,
                        }}
                      >
                        {entry.taskAction}
                      </span>
                    )}
                  </div>
                  <p className="text-body-small" style={{ color: 'var(--color-slate-400)', marginTop: 2 }}>
                    {formatDateWithTime(entry.timestamp)}
                    {entry.completedBy && ` · ${entry.completedBy}`}
                  </p>
                  {entry.details && (
                    <p className="text-body-small" style={{
                      color: 'var(--color-slate-600)',
                      marginTop: 6,
                      ...(isExpanded ? {
                        background: 'var(--color-surface-100, #f8fafc)',
                        borderLeft: '2px solid var(--color-surface-300)',
                        margin: '8px 0 0 0',
                        padding: '8px 12px',
                        borderRadius: '0 var(--radius-sm, 4px) 0 0',
                      } : {}),
                    }}>
                      {entry.details}
                    </p>
                  )}

                  {/* Expanded detail panel */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: '0 12px 12px 12px',
                        borderLeft: '2px solid var(--color-surface-300)',
                        background: 'var(--color-surface-100, #f8fafc)',
                        borderRadius: entry.details ? '0 0 var(--radius-sm, 4px) 0' : 'var(--radius-sm, 4px)',
                        ...(!entry.details ? { marginTop: 8, paddingTop: 12 } : {}),
                      }}
                    >
                      <div className="flex flex-col gap-3">
                        {/* Notes */}
                        {entry.notes && (
                          <p className="text-body-small" style={{ color: 'var(--color-slate-500)', margin: 0, fontStyle: 'italic', lineHeight: 1.5 }}>
                            {entry.notes}
                          </p>
                        )}

                        {/* Structured data */}
                        {(entry.inputUsed || entry.quantity != null || entry.rate != null) && (
                          <div className="flex flex-col gap-1" style={{ paddingTop: 2 }}>
                            <DetailRow icon="science" label="Input" value={entry.inputUsed} />
                            {entry.quantity != null && (
                              <DetailRow icon="scale" label="Quantity" value={`${entry.quantity}${entry.units ? ` ${entry.units}` : ''}`} />
                            )}
                            {entry.rate != null && (
                              <DetailRow icon="speed" label="Rate" value={`${entry.rate}${entry.units ? ` ${entry.units}` : ''}`} />
                            )}
                          </div>
                        )}

                        {/* Source badge */}
                        {entry.source && entry.source !== 'manual' && (
                          <div className="flex items-center gap-1" style={{ fontSize: 11, color: 'var(--color-slate-400)' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                              {entry.source === 'task-system' ? 'sync' : 'calendar_month'}
                            </span>
                            {entry.source === 'task-system' ? 'Auto-generated from task system' : 'From calendar'}
                          </div>
                        )}

                        {/* Evidence / Attachments */}
                        {entry.evidence?.length > 0 && (
                          <div style={{ paddingTop: 2 }}>
                            <p className="text-label" style={{ color: 'var(--color-slate-500)', marginBottom: 6, fontSize: 11 }}>Attachments</p>
                            <div className="flex flex-col gap-1">
                              {entry.evidence.map((file, fi) => (
                                <div
                                  key={fi}
                                  className="flex items-center gap-2"
                                  style={{
                                    padding: '4px 8px',
                                    borderRadius: 'var(--radius-sm, 4px)',
                                    background: 'white',
                                    border: '1px solid var(--color-surface-300)',
                                    fontSize: 12,
                                    color: 'var(--color-slate-700)',
                                  }}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--color-slate-400)' }}>
                                    {file.type === 'pdf' ? 'picture_as_pdf'
                                      : file.type === 'spreadsheet' ? 'table_chart'
                                      : file.type === 'image' ? 'image'
                                      : 'attach_file'}
                                  </span>
                                  {file.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Linked items — clickable chips */}
                        {(matchedTask || matchedMachinery?.length > 0 || matchedStaff) && (
                          <div style={{ paddingTop: 4 }}>
                            <p className="text-label" style={{ color: 'var(--color-slate-500)', marginBottom: 6, fontSize: 11 }}>Linked</p>
                            <div className="flex flex-wrap gap-2">
                              {matchedTask && (
                                <LinkChip
                                  icon="task"
                                  label={matchedTask.name}
                                  onClick={() => navigate('/tasks', { state: { openTaskId: matchedTask.id } })}
                                />
                              )}
                              {matchedMachinery?.map(m => (
                                <LinkChip
                                  key={m.id}
                                  icon="agriculture"
                                  label={m.name}
                                  onClick={() => navigate('/machinery', { state: { openEquipmentId: m.id } })}
                                />
                              ))}
                              {matchedStaff && (
                                <LinkChip
                                  icon="person"
                                  label={matchedStaff.name}
                                  onClick={() => navigate('/staff', { state: { openStaffId: matchedStaff.id } })}
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
