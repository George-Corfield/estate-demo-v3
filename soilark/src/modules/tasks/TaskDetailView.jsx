import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatRelativeDate, formatShortDate } from '../../utils/dates'
import { PriorityBadge, StatusBadge } from '../../components/shared/Badge'
import TabBar from '../../components/shared/TabBar'
import TaskTypeFields from './TaskTypeFields'

const TABS = [
  { id: 'details', label: 'Details' },
  { id: 'typeFields', label: 'Type Fields' },
  { id: 'comments', label: 'Comments' },
]

const STATUS_FLOW = [
  { value: 'todo', label: 'To Do' },
  { value: 'inProgress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

export default function TaskDetailView({ taskId, onBack }) {
  const { tasks, fields, machinery, moveTask, addComment, showToast } = useApp()
  const [activeTab, setActiveTab] = useState('details')
  const [newComment, setNewComment] = useState('')
  const navigate = useNavigate()

  const task = useMemo(() => tasks.find(t => t.id === taskId), [tasks, taskId])

  if (!task) return null

  const taskFields = fields.filter(f => task.fieldIds.includes(f.id))

  const handleStatusChange = (newStatus) => {
    moveTask(task.id, newStatus)
    showToast(`Task moved to ${STATUS_FLOW.find(s => s.value === newStatus)?.label}`)
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
      <div style={{ padding: 16, borderBottom: '1px solid var(--color-parchment-300)' }}>
        <button
          onClick={onBack}
          className="btn btn-ghost flex items-center gap-1 mb-3"
          style={{ padding: '4px 8px', fontSize: 13 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          Back to tasks
        </button>
        <h2 className="text-heading-3 mb-2" style={{ color: 'var(--color-ink-900)', margin: '0 0 8px 0' }}>{task.name}</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
          <span className="text-body-small" style={{ color: 'var(--color-earth-400)' }}>{task.type}</span>
        </div>
      </div>

      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Details tab */}
        {activeTab === 'details' && (
          <div style={{ padding: 20 }} className="flex flex-col gap-5">
            {/* Status changer */}
            <div>
              <h3 className="text-label mb-2" style={{ color: 'var(--color-earth-400)' }}>Status</h3>
              <div className="flex gap-2">
                {STATUS_FLOW.map(s => (
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
                      background: task.status === s.value ? 'rgba(78,140,53,0.15)' : 'var(--color-parchment-50)',
                      color: task.status === s.value ? 'var(--color-sage-500)' : 'var(--color-earth-500)',
                      border: `1px solid ${task.status === s.value ? 'rgba(78,140,53,0.3)' : 'var(--color-parchment-300)'}`,
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
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
                <h3 className="text-label mb-2" style={{ color: 'var(--color-earth-400)' }}>Description</h3>
                <p className="text-body" style={{ color: 'var(--color-earth-600)' }}>{task.description}</p>
              </div>
            )}

            {/* Fields */}
            <div>
              <h3 className="text-label mb-2" style={{ color: 'var(--color-earth-400)' }}>Fields ({taskFields.length})</h3>
              <div className="flex flex-col gap-1">
                {taskFields.map(f => (
                  <button
                    key={f.id}
                    onClick={() => navigate('/fields', { state: { openFieldId: f.id } })}
                    className="w-full text-left text-body"
                    style={{
                      padding: '4px 12px',
                      background: 'var(--color-parchment-100)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-earth-600)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 120ms ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(78,140,53,0.08)'; e.currentTarget.style.color = 'var(--color-sage-500)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-parchment-100)'; e.currentTarget.style.color = 'var(--color-earth-600)' }}
                  >
                    {f.name} — <span className="text-data" style={{ fontSize: 12 }}>{f.sizeHectares} ha</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Staff */}
            <div>
              <h3 className="text-label mb-2" style={{ color: 'var(--color-earth-400)' }}>Assigned Staff</h3>
              <div className="flex flex-col gap-1">
                {task.assignedTo.map(name => (
                  <div key={name} className="flex items-center gap-2 text-body py-1" style={{ color: 'var(--color-earth-600)' }}>
                    <div
                      className="flex items-center justify-center shrink-0"
                      style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(78,140,53,0.15)', color: 'var(--color-sage-600)', fontSize: 10, fontWeight: 700 }}
                    >
                      {name.split(' ').map(n => n[0]).join('')}
                    </div>
                    {name}
                  </div>
                ))}
              </div>
            </div>

            {/* Machinery */}
            {task.assignedMachinery.length > 0 && (
              <div>
                <h3 className="text-label mb-2" style={{ color: 'var(--color-earth-400)' }}>Machinery</h3>
                <div className="flex flex-col gap-1">
                  {task.assignedMachinery.map(m => {
                    const match = machinery.find(eq => eq.name === m)
                    return match ? (
                      <button
                        key={m}
                        onClick={() => navigate('/machinery', { state: { openEquipmentId: match.id } })}
                        className="w-full text-left text-body flex items-center gap-2"
                        style={{
                          padding: '4px 12px',
                          background: 'var(--color-parchment-100)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--color-earth-600)',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 120ms ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(78,140,53,0.08)'; e.currentTarget.style.color = 'var(--color-sage-500)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-parchment-100)'; e.currentTarget.style.color = 'var(--color-earth-600)' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-earth-400)' }}>agriculture</span>
                        {m}
                      </button>
                    ) : (
                      <div key={m} className="text-body flex items-center gap-2" style={{ padding: '4px 12px', background: 'var(--color-parchment-100)', borderRadius: 'var(--radius-sm)', color: 'var(--color-earth-600)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-earth-400)' }}>agriculture</span>
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
              {[...(task.comments || [])].reverse().map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-parchment-200)', color: 'var(--color-earth-500)', fontSize: 12, fontWeight: 700 }}
                  >
                    {comment.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-heading-4" style={{ color: 'var(--color-ink-900)' }}>{comment.author}</span>
                      <span className="text-body-small" style={{ color: 'var(--color-earth-400)' }}>{formatShortDate(comment.date)}</span>
                    </div>
                    <p className="text-body" style={{ color: 'var(--color-earth-600)' }}>{comment.text}</p>
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
    <div style={{ padding: 12, background: 'var(--color-parchment-100)', border: '1px solid var(--color-parchment-300)', borderRadius: 'var(--radius-md)' }}>
      <p className="text-label" style={{ color: 'var(--color-earth-400)', marginBottom: 4 }}>{label}</p>
      <p className="text-body" style={{ color: 'var(--color-ink-900)', fontWeight: 500, margin: 0 }}>{value}</p>
    </div>
  )
}
