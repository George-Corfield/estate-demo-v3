import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ROLES } from '../../constants/roles'
import { formatRelativeDate, formatShortDate } from '../../utils/dates'
import { PriorityBadge, StatusBadge } from '../../components/shared/Badge'
import TabBar from '../../components/shared/TabBar'
import TaskTypeFields from './TaskTypeFields'

const TABS = [
  { id: 'details', label: 'Details' },
  { id: 'typeFields', label: 'Type Fields' },
  { id: 'comments', label: 'Comments' },
]

const PAUSE_REASONS = [
  'Weather Change',
  'Machine Issue',
  'Waiting for Materials',
  'Waiting for Manager Instruction',
]

const STATUS_FLOW = [
  { value: 'todo', label: 'To Do' },
  { value: 'inProgress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'paused', label: 'Paused' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function TaskDetailView({ taskId, onBack }) {
  const { tasks, fields, machinery, staff, moveTask, addComment, showToast, currentUser } = useApp()
  const isManager = currentUser.role === ROLES.FARM_MANAGER
  const [activeTab, setActiveTab] = useState('details')
  const [newComment, setNewComment] = useState('')
  const [expandedPanel, setExpandedPanel] = useState(null) // 'paused' | 'cancelled' | null
  const [pauseReason, setPauseReason] = useState('')
  const [pauseNote, setPauseNote] = useState('')
  const [pausePhoto, setPausePhoto] = useState(null)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelNote, setCancelNote] = useState('')
  const [cancelPhoto, setCancelPhoto] = useState(null)
  const navigate = useNavigate()

  const task = useMemo(() => tasks.find(t => t.id === taskId), [tasks, taskId])

  if (!task) return null

  const taskFields = fields.filter(f => task.fieldIds.includes(f.id))
  const isCancelled = task.status === 'cancelled'

  const handleStatusChange = (newStatus) => {
    if (isCancelled) return
    if (newStatus === 'paused' || newStatus === 'cancelled') {
      // Toggle the inline panel open/closed
      if (expandedPanel === newStatus) {
        setExpandedPanel(null)
      } else {
        setExpandedPanel(newStatus)
        // Reset form fields when opening
        if (newStatus === 'paused') { setPauseReason(''); setPauseNote(''); setPausePhoto(null) }
        if (newStatus === 'cancelled') { setCancelReason(''); setCancelNote(''); setCancelPhoto(null) }
      }
      return
    }
    setExpandedPanel(null)
    moveTask(task.id, newStatus)
    showToast(`Task moved to ${STATUS_FLOW.find(s => s.value === newStatus)?.label}`)
  }

  const handlePauseSubmit = () => {
    if (!pauseReason) return
    moveTask(task.id, 'paused', { reason: pauseReason, note: pauseNote, photo: pausePhoto })
    showToast('Task paused')
    setExpandedPanel(null)
  }

  const handleCancelSubmit = () => {
    if (!cancelReason.trim()) return
    moveTask(task.id, 'cancelled', { reason: cancelReason, note: cancelNote, photo: cancelPhoto })
    showToast('Task cancelled')
    setExpandedPanel(null)
  }

  const handlePhotoChange = (e, setter) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setter({ name: file.name, data: reader.result })
    reader.readAsDataURL(file)
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    addComment(task.id, {
      id: `cmt-${Date.now()}`,
      date: new Date().toISOString(),
      author: 'John Smith',
      text: newComment,
    })
    setNewComment('')
    showToast('Comment added')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div style={{ padding: 16, borderBottom: '1px solid var(--color-surface-300)' }}>
        <button
          onClick={onBack}
          className="btn btn-ghost flex items-center gap-1 mb-3"
          style={{ padding: '4px 8px', fontSize: 13 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          Back to tasks
        </button>
        <h2 className="text-heading-3 mb-2" style={{ color: 'var(--color-slate-900)', margin: '0 0 8px 0' }}>{task.name}</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
          <span className="text-body-small" style={{ color: 'var(--color-slate-400)' }}>{task.type}</span>
        </div>
      </div>

      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Details tab */}
        {activeTab === 'details' && (
          <div style={{ padding: 20 }} className="flex flex-col gap-5">
            {/* Status changer */}
            <div>
              <h3 className="text-label mb-2" style={{ color: 'var(--color-slate-400)' }}>Status</h3>
              {isCancelled ? (
                <div>
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 12,
                      fontFamily: 'var(--font-body)',
                      fontWeight: 500,
                      background: 'rgba(239,68,68,0.1)',
                      color: 'var(--color-red-600)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      opacity: 0.7,
                    }}
                  >
                    Cancelled
                  </div>
                  <p className="text-body-small" style={{ color: 'var(--color-slate-400)', marginTop: 8 }}>
                    This task has been cancelled and cannot be reactivated.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2 flex-wrap">
                    {STATUS_FLOW.map(s => {
                      const isActive = task.status === s.value
                      const isExpanding = expandedPanel === s.value
                      let activeBg = 'rgba(78,140,53,0.15)'
                      let activeColor = 'var(--color-green-500)'
                      let activeBorder = 'rgba(78,140,53,0.3)'
                      if (s.value === 'paused') {
                        activeBg = 'rgba(245,158,11,0.15)'
                        activeColor = 'var(--color-amber-700, #92400e)'
                        activeBorder = 'rgba(245,158,11,0.3)'
                      } else if (s.value === 'cancelled') {
                        activeBg = 'rgba(239,68,68,0.1)'
                        activeColor = 'var(--color-red-600, #dc2626)'
                        activeBorder = 'rgba(239,68,68,0.3)'
                      }
                      return (
                        <button
                          key={s.value}
                          onClick={() => handleStatusChange(s.value)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 12,
                            fontFamily: 'var(--font-body)',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 120ms ease',
                            background: (isActive || isExpanding) ? activeBg : 'var(--color-surface-50)',
                            color: (isActive || isExpanding) ? activeColor : 'var(--color-slate-500)',
                            border: `1px solid ${(isActive || isExpanding) ? activeBorder : 'var(--color-surface-300)'}`,
                          }}
                        >
                          {s.label}
                        </button>
                      )
                    })}
                  </div>

                  {/* Inline Pause panel */}
                  {expandedPanel === 'paused' && (
                    <div
                      style={{
                        padding: 16,
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(245,158,11,0.3)',
                        background: 'rgba(245,158,11,0.04)',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-amber-700, #92400e)' }}>pause_circle</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-amber-700, #92400e)', fontFamily: 'var(--font-body)' }}>Pause Task</span>
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <label className="form-label">Reason</label>
                        <div className="flex flex-col gap-2">
                          {PAUSE_REASONS.map(r => (
                            <label
                              key={r}
                              className="flex items-center gap-2"
                              style={{
                                padding: '8px 12px',
                                borderRadius: 'var(--radius-sm)',
                                border: `1px solid ${pauseReason === r ? 'var(--color-amber-400, #f59e0b)' : 'var(--color-surface-300)'}`,
                                background: pauseReason === r ? 'var(--color-amber-100, #fef3c7)' : 'white',
                                cursor: 'pointer',
                                fontSize: 13,
                                fontFamily: 'var(--font-body)',
                                color: 'var(--color-slate-700)',
                                transition: 'all 120ms ease',
                              }}
                            >
                              <input
                                type="radio"
                                name="pauseReason"
                                value={r}
                                checked={pauseReason === r}
                                onChange={() => setPauseReason(r)}
                                style={{ accentColor: 'var(--color-amber-400, #f59e0b)' }}
                              />
                              {r}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <label className="form-label">Note (optional)</label>
                        <textarea
                          value={pauseNote}
                          onChange={e => setPauseNote(e.target.value)}
                          placeholder="Add any additional details..."
                          rows={2}
                          className="form-textarea"
                        />
                      </div>

                      <div style={{ marginBottom: 14 }}>
                        <label className="form-label">Photo (optional)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handlePhotoChange(e, setPausePhoto)}
                          className="form-input"
                          style={{ padding: 6 }}
                        />
                        {pausePhoto && (
                          <p className="text-body-small" style={{ color: 'var(--color-slate-500)', marginTop: 4 }}>{pausePhoto.name}</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handlePauseSubmit}
                          disabled={!pauseReason}
                          style={{
                            padding: '8px 16px',
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            fontFamily: 'var(--font-body)',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: pauseReason ? 'pointer' : 'not-allowed',
                            opacity: pauseReason ? 1 : 0.5,
                            background: 'var(--color-amber-400, #f59e0b)',
                            color: 'var(--color-amber-700, #92400e)',
                            transition: 'all 120ms ease',
                          }}
                        >
                          Pause Task
                        </button>
                        <button
                          onClick={() => setExpandedPanel(null)}
                          className="btn btn-secondary"
                          style={{ fontSize: 13 }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Inline Cancel panel */}
                  {expandedPanel === 'cancelled' && (
                    <div
                      style={{
                        padding: 16,
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        background: 'rgba(239,68,68,0.03)',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-red-600, #dc2626)' }}>cancel</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-red-600, #dc2626)', fontFamily: 'var(--font-body)' }}>Cancel Task</span>
                      </div>

                      <div
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--color-red-100, #fef2f2)',
                          color: 'var(--color-red-600, #dc2626)',
                          fontSize: 13,
                          marginBottom: 14,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>warning</span>
                        This action is permanent. The task cannot be reactivated.
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <label className="form-label">
                          Reason <span style={{ color: 'var(--color-red-400)' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={cancelReason}
                          onChange={e => setCancelReason(e.target.value)}
                          placeholder="Enter reason for cancellation..."
                          className="form-input"
                        />
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <label className="form-label">Note (optional)</label>
                        <textarea
                          value={cancelNote}
                          onChange={e => setCancelNote(e.target.value)}
                          placeholder="Add any additional details..."
                          rows={2}
                          className="form-textarea"
                        />
                      </div>

                      <div style={{ marginBottom: 14 }}>
                        <label className="form-label">Photo (optional)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handlePhotoChange(e, setCancelPhoto)}
                          className="form-input"
                          style={{ padding: 6 }}
                        />
                        {cancelPhoto && (
                          <p className="text-body-small" style={{ color: 'var(--color-slate-500)', marginTop: 4 }}>{cancelPhoto.name}</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleCancelSubmit}
                          disabled={!cancelReason.trim()}
                          style={{
                            padding: '8px 16px',
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            fontFamily: 'var(--font-body)',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: cancelReason.trim() ? 'pointer' : 'not-allowed',
                            opacity: cancelReason.trim() ? 1 : 0.5,
                            background: 'var(--color-red-600, #dc2626)',
                            color: 'white',
                            transition: 'all 120ms ease',
                          }}
                        >
                          Cancel Task
                        </button>
                        <button
                          onClick={() => setExpandedPanel(null)}
                          className="btn btn-secondary"
                          style={{ fontSize: 13 }}
                        >
                          Go Back
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Properties */}
            <div className="grid grid-cols-2 gap-3">
              <PropItem label="Due Date" value={formatShortDate(task.dueDate)} />
              <PropItem label="Priority" value={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} />
              <PropItem label="Type" value={task.type} />
              <PropItem label="Status" value={formatRelativeDate(task.dueDate)} />
            </div>

            {/* Description */}
            {task.description && (
              <div>
                <h3 className="text-label mb-2" style={{ color: 'var(--color-slate-400)' }}>Description</h3>
                <p className="text-body" style={{ color: 'var(--color-slate-600)' }}>{task.description}</p>
              </div>
            )}

            {/* Fields */}
            <div>
              <h3 className="text-label mb-2" style={{ color: 'var(--color-slate-400)' }}>Fields ({taskFields.length})</h3>
              <div className="flex flex-col gap-1">
                {taskFields.map(f => (
                  <button
                    key={f.id}
                    onClick={() => navigate('/fields', { state: { openFieldId: f.id } })}
                    className="w-full text-left text-body"
                    style={{
                      padding: '4px 12px',
                      background: 'var(--color-surface-100)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-slate-600)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 120ms ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(78,140,53,0.08)'; e.currentTarget.style.color = 'var(--color-green-500)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface-100)'; e.currentTarget.style.color = 'var(--color-slate-600)' }}
                  >
                    {f.name} — <span className="text-data" style={{ fontSize: 12 }}>{f.sizeHectares} ha</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Staff */}
            <div>
              <h3 className="text-label mb-2" style={{ color: 'var(--color-slate-400)' }}>Assigned Staff</h3>
              <div className="flex flex-col gap-1">
                {task.assignedTo.map(name => {
                  const member = staff.find(s => s.name === name)
                  const avatar = (
                    <div
                      className="flex items-center justify-center shrink-0"
                      style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(78,140,53,0.15)', color: 'var(--color-green-600)', fontSize: 10, fontWeight: 700 }}
                    >
                      {name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )
                  return (isManager && member) ? (
                    <button
                      key={name}
                      onClick={() => navigate('/staff', { state: { openStaffId: member.id } })}
                      className="flex items-center gap-2 text-body w-full text-left"
                      style={{
                        padding: '4px 12px',
                        background: 'var(--color-surface-100)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-slate-600)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 120ms ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(78,140,53,0.08)'; e.currentTarget.style.color = 'var(--color-green-500)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface-100)'; e.currentTarget.style.color = 'var(--color-slate-600)' }}
                    >
                      {avatar}
                      {name}
                    </button>
                  ) : (
                    <div key={name} className="flex items-center gap-2 text-body py-1" style={{ padding: '4px 12px', color: 'var(--color-slate-600)' }}>
                      {avatar}
                      {name}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Assigned Teams */}
            {task.assignedTeams?.length > 0 && (
              <div>
                <h3 className="text-label mb-2" style={{ color: 'var(--color-slate-400)' }}>Assigned Teams</h3>
                <div className="flex flex-wrap gap-2">
                  {task.assignedTeams.map(team => (
                    <span key={team} className="flex items-center gap-1" style={{
                      fontSize: 12, padding: '4px 10px', borderRadius: 99,
                      background: 'var(--color-surface-100)', color: 'var(--color-slate-600)',
                      border: '1px solid var(--color-surface-300)',
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 13 }}>group</span>
                      {team}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Machinery */}
            {task.assignedMachinery.length > 0 && (
              <div>
                <h3 className="text-label mb-2" style={{ color: 'var(--color-slate-400)' }}>Machinery</h3>
                <div className="flex flex-col gap-1">
                  {task.assignedMachinery.map(m => {
                    const match = machinery.find(eq => eq.name === m)
                    return (match && isManager) ? (
                      <button
                        key={m}
                        onClick={() => navigate('/machinery', { state: { openEquipmentId: match.id } })}
                        className="w-full text-left text-body flex items-center gap-2"
                        style={{
                          padding: '4px 12px',
                          background: 'var(--color-surface-100)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--color-slate-600)',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 120ms ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(78,140,53,0.08)'; e.currentTarget.style.color = 'var(--color-green-500)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface-100)'; e.currentTarget.style.color = 'var(--color-slate-600)' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-slate-400)' }}>agriculture</span>
                        {m}
                      </button>
                    ) : (
                      <div key={m} className="text-body flex items-center gap-2" style={{ padding: '4px 12px', background: 'var(--color-surface-100)', borderRadius: 'var(--radius-sm)', color: 'var(--color-slate-600)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-slate-400)' }}>agriculture</span>
                        {m}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Type fields tab */}
        {activeTab === 'typeFields' && (
          <div style={{ padding: 20 }}>
            <TaskTypeFields task={task} />
          </div>
        )}

        {/* Comments tab */}
        {activeTab === 'comments' && (
          <div style={{ padding: 20 }}>
            <form onSubmit={handleAddComment} className="flex gap-2 mb-5">
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="form-input flex-1"
              />
              <button type="submit" className="btn btn-primary">Post</button>
            </form>

            <div className="flex flex-col gap-4">
              {[...(task.comments || [])].reverse().map((comment, index) => (
                <div key={comment.id} className="flex gap-3 py-4"
                  style={{borderTop: index !== 0 ? '1px solid var(--color-slate-300)' : 'none'}}
                >
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-surface-200)', color: 'var(--color-slate-500)', fontSize: 12, fontWeight: 700 }}
                  >
                    {comment.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-heading-4" style={{ color: 'var(--color-slate-900)' }}>{comment.author}</span>
                      <span className="text-body-small" style={{ color: 'var(--color-slate-400)' }}>{formatShortDate(comment.date)}</span>
                    </div>
                    <p className="text-body" style={{ color: 'var(--color-slate-600)' }}>{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PropItem({ label, value }) {
  return (
    // <div style={{ padding: 12, background: 'var(--color-surface-100)', border: '1px solid var(--color-surface-300)', borderRadius: 'var(--radius-md)' }}>
    <div style={{ padding: 12, background: 'var(--color-surface-100)', borderRadius: 'var(--radius-md)' }}>
      <p className="text-label" style={{ color: 'var(--color-slate-400)', marginBottom: 4 }}>{label}</p>
      <p className="text-body" style={{ color: 'var(--color-slate-900)', fontWeight: 500, margin: 0 }}>{value}</p>
    </div>
  )
}
