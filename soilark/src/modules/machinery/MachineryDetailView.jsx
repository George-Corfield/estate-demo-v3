import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatGBP } from '../../utils/currency'
import { formatShortDate, formatDateWithTime } from '../../utils/dates'
import TabBar from '../../components/shared/TabBar'
import { MACHINERY_STATUS_COLORS, SERVICE_TYPES } from '../../data/machinery'
import ObservationThread from '../../components/shared/ObservationThread'

const HISTORY_TYPE_CONFIG = {
  task_assigned: { icon: 'task', color: '#3b82f6' },
  task_status:   { icon: 'task_alt', color: '#6366f1' },
  service_recorded: { icon: 'build', color: '#f59e0b' },
  details_update: { icon: 'edit', color: '#64748b' },
}

const TABS = [
  { id: 'summary', label: 'Summary' },
  { id: 'service', label: 'Service & Maintenance' },
  { id: 'history', label: 'Timeline / History' },
]

export default function MachineryDetailView({ equipmentId, onClose, onServiceDateClick }) {
  const { machinery, tasks, addServiceRecord, updateMachinery, showToast } = useApp()
  const [activeTab, setActiveTab] = useState('summary')
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const navigate = useNavigate()

  const equipment = useMemo(() => machinery.find(m => m.id === equipmentId), [machinery, equipmentId])

  if (!equipment) return null

  const associatedTasks = tasks.filter(t =>
    t.assignedMachinery.includes(equipment.name)
  )
  const inProgressTask = associatedTasks.find(t => t.status === 'inProgress')

  const schedule = equipment.serviceSchedule || { type: 'hours', interval: 250 }
  const isOverdue = schedule.type === 'hours'
    ? equipment.hours >= equipment.nextServiceDue
    : new Date() >= new Date(equipment.nextServiceDue)
  const badgeClass = MACHINERY_STATUS_COLORS[equipment.status] || 'badge-neutral'

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Panel Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--color-surface-300)',
        background: 'var(--color-surface-100)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="btn btn-ghost shrink-0"
            style={{ padding: 4, marginTop: 2 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-slate-400)' }}>arrow_back</span>
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-heading-3" style={{ color: 'var(--color-slate-900)', margin: 0 }}>{equipment.name}</h2>
                <p className="text-body-small" style={{ color: 'var(--color-slate-500)', margin: 0 }}>
                  {equipment.make} {equipment.model} &middot; {equipment.year}
                </p>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <span className={`badge ${badgeClass}`}>{equipment.status}</span>
                <div style={{ padding: '8px 0px 0px 0px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-ghost">Edit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div style={{ padding: 20 }} className='flex flex-col gap-5'>
            <div className='grid grid-cols-2 gap-3'>
              <FieldRow label="Machine Name" value={equipment.name} />
              <FieldRow label="Type" value={equipment.type} />
              <FieldRow label="Make / Model" value={`${equipment.make} ${equipment.model}`} />
              <FieldRow label="Registration / ID" value={equipment.numberPlate || equipment.serialNumber || '—'} />
              <div style={{ padding: 12, background: 'var(--color-surface-100)', borderRadius: 'var(--radius-md)' }}>
                <p className="text-label" style={{ color: 'var(--color-slate-400)', marginBottom: 4 }}>Status</p>
                <span className={`badge ${badgeClass}`}>{equipment.status}</span>
              </div>
              <FieldRow
                label="Next Service Due"
                value={schedule.type === 'hours'
                  ? `${Number(equipment.nextServiceDue).toLocaleString()} hrs`
                  : formatShortDate(equipment.nextServiceDue)}
              />
              {equipment.assignedOperator && (
                <FieldRow label="Assigned Operator" value={equipment.assignedOperator} />
              )}
            </div>
            {inProgressTask && (
              <div>
                <p className="text-label" style={{ color: 'var(--color-slate-400)', marginBottom: 8 }}>Current Task</p>
                <button
                  onClick={() => navigate('/tasks', { state: { openTaskId: inProgressTask.id } })}
                  className="w-full text-left flex items-center justify-between"
                  style={{
                    padding: '8px 12px',
                    background: 'var(--color-surface-100)',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    color: 'var(--color-slate-900)',
                    transition: 'all 120ms ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(78,140,53,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface-100)' }}
                >
                  <span>{inProgressTask.name}</span>
                  <span className="badge badge-healthy">In Progress</span>
                </button>
              </div>
            )}

            {/* Notes — collapsible */}
            <div style={{ borderTop: '1px solid var(--color-surface-300)', paddingTop: 12 }}>
              <button
                onClick={() => setShowNotes(v => !v)}
                className="w-full flex items-center justify-between"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-label" style={{ color: 'var(--color-slate-400)' }}>NOTES</span>
                  {(equipment.observations || []).length > 0 && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 18,
                        height: 18,
                        borderRadius: 9,
                        background: 'var(--color-surface-300)',
                        color: 'var(--color-slate-500)',
                        fontSize: 11,
                        fontFamily: 'var(--font-body)',
                        fontWeight: 600,
                        padding: '0 5px',
                      }}
                    >
                      {(equipment.observations || []).length}
                    </span>
                  )}
                </div>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 18, color: 'var(--color-slate-400)', transition: 'transform 150ms ease', transform: showNotes ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  expand_more
                </span>
              </button>
              {showNotes && (
                <div style={{ marginTop: 12 }}>
                  <ObservationThread
                    entityType="machinery"
                    entityId={equipment.id}
                    observations={equipment.observations || []}
                    legacyComments={[]}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Service Tab */}
        {activeTab === 'service' && (
          <div style={{ padding: 16 }} className="flex flex-col gap-5">
            {/* Service Summary — field rows instead of stat cards */}
            <ServiceScheduleSettings
              equipment={equipment}
              onUpdate={(updates) => {
                updateMachinery(equipment.id, updates)
                showToast('Service schedule updated')
              }}
            />
            <div style={{ border: '1px solid var(--color-surface-300)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <FieldRow label="Current Hours" value={equipment.hours.toLocaleString()} mono />
              <FieldRow
                label="Next Service Due"
                value={
                  schedule.type === 'hours'
                    ? `${Number(equipment.nextServiceDue).toLocaleString()} hrs`
                    : formatShortDate(equipment.nextServiceDue)
                }
                mono
                highlight={isOverdue}
              />
              <FieldRow
                label="Last Service"
                value={equipment.lastServiceDate ? formatShortDate(equipment.lastServiceDate) : '—'}
                mono
              />
            </div>

            {/* Record Service Button — above history */}
            <button
              onClick={() => setShowServiceForm(!showServiceForm)}
              className="btn btn-ghost"
              style={{ alignSelf: 'flex-start' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
              Record service
            </button>

            {/* Inline Service Form */}
            {showServiceForm && (
              <ServiceForm
                currentHours={equipment.hours}
                onSave={(record) => {
                  addServiceRecord(equipment.id, record)
                  const hours = record.hoursAtService || equipment.hours
                  let nextServiceDue
                  if (schedule.type === 'hours') {
                    nextServiceDue = hours + schedule.interval
                  } else {
                    const serviceDate = new Date(record.date)
                    if (schedule.type === 'months') {
                      serviceDate.setMonth(serviceDate.getMonth() + schedule.interval)
                    } else {
                      serviceDate.setFullYear(serviceDate.getFullYear() + schedule.interval)
                    }
                    nextServiceDue = serviceDate.toISOString().split('T')[0]
                  }
                  updateMachinery(equipment.id, {
                    lastServiceDate: record.date,
                    hours,
                    nextServiceDue,
                  })
                  setShowServiceForm(false)
                  showToast('Service record added')
                }}
                onCancel={() => setShowServiceForm(false)}
              />
            )}

            {/* Service History — card list instead of data-table */}
            <div>
              <h3 className="text-label mb-3" style={{ color: 'var(--color-slate-400)' }}>Service History</h3>
              {equipment.serviceHistory.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {equipment.serviceHistory.map(svc => (
                    <div
                      key={svc.id}
                      className="card"
                      style={{ padding: '12px 16px', cursor: 'pointer', transition: 'all var(--duration-fast) ease' }}
                      onClick={() => onServiceDateClick?.(svc.date)}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-200)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '' }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-heading-4" style={{ color: 'var(--color-slate-900)' }}>{svc.type}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-slate-400)', whiteSpace: 'nowrap' }}>
                          {formatShortDate(svc.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-slate-500)' }}>
                        {svc.hoursAtService && <span>{svc.hoursAtService.toLocaleString()} hrs</span>}
                        <span>{formatGBP(svc.cost)}</span>
                      </div>
                      {svc.notes && (
                        <p className="text-body-small" style={{ color: 'var(--color-slate-500)', marginTop: 4 }}>{svc.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-body" style={{ color: 'var(--color-slate-400)' }}>No service records</p>
              )}
            </div>
          </div>
        )}

        {/* Timeline / History Tab */}
        {activeTab === 'history' && (
          <div style={{ padding: '16px 16px 8px' }}>
            {(equipment.history || []).length === 0 ? (
              <p className="text-body" style={{ color: 'var(--color-slate-400)' }}>No history recorded yet.</p>
            ) : (
              <div className="flex flex-col">
                {(equipment.history || []).map((entry, i) => {
                  const config = HISTORY_TYPE_CONFIG[entry.type] || HISTORY_TYPE_CONFIG.details_update
                  const isClickable = !!entry.taskId
                  const isLast = i === (equipment.history || []).length - 1
                  return (
                    <div key={entry.id} className="flex gap-4 relative">
                      {/* Timeline dot + connecting line */}
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
                        {!isLast && (
                          <div className="flex-1 mt-1" style={{ width: 1, background: 'var(--color-surface-300)' }} />
                        )}
                      </div>

                      {/* Entry content */}
                      <div
                        onClick={isClickable ? () => navigate('/tasks', { state: { openTaskId: entry.taskId } }) : undefined}
                        style={{
                          paddingBottom: 24,
                          flex: 1,
                          minWidth: 0,
                          cursor: isClickable ? 'pointer' : 'default',
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-heading-4" style={{ color: 'var(--color-slate-900)', margin: 0 }}>
                            {entry.description}
                          </p>
                          {isClickable && (
                            <span className="material-symbols-outlined" style={{ fontSize: 15, color: 'var(--color-slate-300)', flexShrink: 0, marginTop: 2 }}>arrow_forward</span>
                          )}
                        </div>
                        <p className="text-body-small" style={{ color: 'var(--color-slate-400)', marginTop: 2 }}>
                          {formatDateWithTime(entry.timestamp)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* Collapsible service schedule settings panel */
function ServiceScheduleSettings({ equipment, onUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const schedule = equipment.serviceSchedule || { type: 'hours', interval: 250 }
  const [selectedType, setSelectedType] = useState(schedule.type)
  const [interval, setInterval] = useState(String(schedule.interval))
  const [reminderEnabled, setReminderEnabled] = useState(schedule.reminderEnabled || false)
  const [reminderLeadTime, setReminderLeadTime] = useState(
    String(schedule.reminderLeadTime ?? (schedule.type === 'hours' ? 25 : 7))
  )

  const summaryText = schedule.type === 'hours'
    ? `Every ${schedule.interval.toLocaleString()} hours`
    : schedule.type === 'months'
      ? `Every ${schedule.interval} month${schedule.interval !== 1 ? 's' : ''}`
      : `Every ${schedule.interval} year${schedule.interval !== 1 ? 's' : ''}`

  const reminderUnit = schedule.type === 'hours' ? 'hours' : 'days'

  const handleSave = () => {
    const parsed = parseInt(interval) || 1
    const newSchedule = {
      type: selectedType,
      interval: parsed,
      reminderEnabled,
      reminderLeadTime: parseInt(reminderLeadTime) || 1,
    }

    let nextServiceDue
    if (selectedType === 'hours') {
      const lastServiceRecord = equipment.serviceHistory?.[0]
      const lastHours = lastServiceRecord?.hoursAtService || equipment.hours
      nextServiceDue = lastHours + parsed
    } else {
      const lastDate = equipment.lastServiceDate || new Date().toISOString().split('T')[0]
      const date = new Date(lastDate)
      if (selectedType === 'months') {
        date.setMonth(date.getMonth() + parsed)
      } else {
        date.setFullYear(date.getFullYear() + parsed)
      }
      nextServiceDue = date.toISOString().split('T')[0]
    }

    onUpdate({ serviceSchedule: newSchedule, nextServiceDue })
    setExpanded(false)
  }

  const options = [
    { value: 'hours', label: 'Hourly Service', unit: 'hours' },
    { value: 'months', label: 'Monthly Service', unit: 'months' },
    { value: 'years', label: 'Annual Service', unit: 'years' },
  ]

  return (
    <div style={{
      border: '1px solid var(--color-surface-300)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
    }}>
      {/* Collapsed header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
        style={{
          padding: '12px 16px',
          background: 'var(--color-surface-100)',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-slate-400)' }}>settings</span>
          <span className="text-label" style={{ color: 'var(--color-slate-400)' }}>Service Schedule</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <span style={{ fontSize: 13, color: 'var(--color-slate-900)', fontWeight: 500 }}>{summaryText}</span>
            <span style={{ fontSize: 11, color: 'var(--color-slate-400)' }}>
              {schedule.reminderEnabled
                ? `Reminder: ${schedule.reminderLeadTime} ${reminderUnit} before`
                : 'No reminders'}
            </span>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-slate-400)' }}>
            {expanded ? 'expand_less' : 'expand_more'}
          </span>
        </div>
      </button>

      {/* Expanded settings */}
      {expanded && (
        <div style={{
          padding: '16px',
          borderTop: '1px solid var(--color-surface-300)',
          background: 'var(--color-surface-50)',
        }}>
          <div className="flex flex-col gap-3">
            {options.map(opt => (
              <label
                key={opt.value}
                className="flex items-center gap-3"
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: selectedType === opt.value ? 'rgba(78,140,53,0.08)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 120ms ease',
                }}
              >
                <input
                  type="radio"
                  name="scheduleType"
                  value={opt.value}
                  checked={selectedType === opt.value}
                  onChange={() => {
                    setSelectedType(opt.value)
                    if (opt.value !== schedule.type) {
                      setInterval(opt.value === 'hours' ? '250' : opt.value === 'months' ? '6' : '1')
                      setReminderLeadTime(opt.value === 'hours' ? '25' : '7')
                    }
                  }}
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <span style={{ fontSize: 13, color: 'var(--color-slate-900)', flex: 1 }}>{opt.label}</span>
                {selectedType === opt.value && (
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 12, color: 'var(--color-slate-500)' }}>Every</span>
                    <input
                      type="number"
                      min="1"
                      value={interval}
                      onChange={e => setInterval(e.target.value)}
                      className="form-input"
                      style={{ width: 64, padding: '4px 8px', fontSize: 13, textAlign: 'center' }}
                    />
                    <span style={{ fontSize: 12, color: 'var(--color-slate-500)' }}>{opt.unit}</span>
                  </div>
                )}
              </label>
            ))}
          </div>
          {/* Service reminders */}
          <div style={{ marginTop: 12 }} className="flex flex-col gap-3">
            <label
              className="flex items-center gap-3"
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: reminderEnabled ? 'rgba(78,140,53,0.08)' : 'transparent',
                cursor: 'pointer',
                transition: 'background 120ms ease',
              }}
            >
              <div
                onClick={(e) => { e.preventDefault(); setReminderEnabled(!reminderEnabled) }}
                style={{
                  width: 36,
                  height: 20,
                  borderRadius: 10,
                  background: reminderEnabled ? 'var(--color-primary)' : 'var(--color-surface-300)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background 150ms ease',
                  flexShrink: 0,
                }}
              >
                <div style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: 2,
                  left: reminderEnabled ? 18 : 2,
                  transition: 'left 150ms ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </div>
              <span style={{ fontSize: 13, color: 'var(--color-slate-900)', flex: 1 }}>Service reminders</span>
              <span style={{ fontSize: 12, color: 'var(--color-slate-500)' }}>{reminderEnabled ? 'On' : 'Off'}</span>
            </label>
            {reminderEnabled && (
              <div
                className="flex items-center gap-2"
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-surface-100)',
                }}
              >
                <span style={{ fontSize: 12, color: 'var(--color-slate-500)' }}>Remind me</span>
                <input
                  type="number"
                  min="1"
                  value={reminderLeadTime}
                  onChange={e => setReminderLeadTime(e.target.value)}
                  className="form-input"
                  style={{ width: 64, padding: '4px 8px', fontSize: 13, textAlign: 'center' }}
                />
                <span style={{ fontSize: 12, color: 'var(--color-slate-500)' }}>
                  {selectedType === 'hours' ? 'hours' : 'days'} before
                </span>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2" style={{ marginTop: 12 }}>
            <button
              type="button"
              onClick={() => {
                setSelectedType(schedule.type)
                setInterval(String(schedule.interval))
                setReminderEnabled(schedule.reminderEnabled || false)
                setReminderLeadTime(String(schedule.reminderLeadTime ?? (schedule.type === 'hours' ? 25 : 7)))
                setExpanded(false)
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="button" onClick={handleSave} className="btn btn-primary">Save</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* Field row component — label left, value right */
// function FieldRow({ label, value, mono, highlight }) {
//   return (
//     <div
//       className="flex items-center justify-between"
//       style={{
//         padding: '12px 16px',
//         borderBottom: '1px solid var(--color-surface-200)',
//       }}
//     >
//       <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-slate-400)' }}>
//         {label}
//       </span>
//       <span style={{
//         fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
//         fontSize: 13,
//         color: highlight ? 'var(--color-amber-400)' : 'var(--color-slate-900)',
//         textAlign: 'end'
//       }}>
//         {value || '—'}
//       </span>
//     </div>
//   )
// }

function FieldRow({ label, value, mono, highlight }) {
  return (
    <div style={{ padding: 12, background: 'var(--color-surface-100)', borderRadius: 'var(--radius-md)' }}>
      <p className="text-label" style={{ color: 'var(--color-slate-400)', marginBottom: 4 }}>{label}</p>
      <p className="text-body" style={{ color: 'var(--color-slate-900)', fontWeight: 500, margin: 0 }}>{value}</p>
    </div>
  )
}

/* Section divider with title */
// function FieldSection({ title, children }) {
//   return (
//     <div>
//       <div style={{ padding: '12px 16px', borderBottom: '2px solid var(--color-surface-300)' }}>
//         <h3 className="text-label" style={{ color: 'var(--color-slate-400)', margin: 0 }}>{title}</h3>
//       </div>
//       {children}
//     </div>
//   )
// }

function FieldSection({ title, children }) {
  return (
      <div>
        <div style={{ padding: '12px 16px', borderBottom: '2px solid var(--color-surface-300)' }}>
          <h3 className="text-label-large mb-2" style={{ color: 'var(--color-slate-400)', margin: 0}}>{title}</h3>
        </div>
        <div className='grid grid-cols-2 gap-3' style={{paddingTop: '12px'}}>
          {children}
        </div>
      </div>

      
  )
}

/* Cost breakdown row */
function CostRow({ label, value, border }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: '12px 16px',
        background: 'var(--color-surface-100)',
        borderTop: border ? '1px solid var(--color-surface-200)' : undefined,
      }}
    >
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-slate-900)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-slate-900)' }}>{formatGBP(value)}</span>
    </div>
  )
}

/* Inline service record form */
function ServiceForm({ currentHours, onSave, onCancel }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Regular Service',
    cost: '',
    notes: '',
    hoursAtService: String(currentHours),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      id: `svc-${Date.now()}`,
      date: form.date,
      type: form.type,
      cost: parseFloat(form.cost) || 0,
      notes: form.notes,
      hoursAtService: parseInt(form.hoursAtService) || currentHours,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-3">
      <h4 className="text-heading-4" style={{ color: 'var(--color-slate-900)', margin: 0 }}>Record Service</h4>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="form-label">Date</label>
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="form-input" required />
        </div>
        <div>
          <label className="form-label">Type</label>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="form-select">
            {SERVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Hours at Service</label>
          <input type="number" value={form.hoursAtService} onChange={e => setForm({ ...form, hoursAtService: e.target.value })} className="form-input" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="form-label">Cost</label>
          <input type="number" step="0.01" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} placeholder="0.00" className="form-input" required />
        </div>
        <div>
          <label className="form-label">Notes</label>
          <input type="text" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Work performed..." className="form-input" />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  )
}
