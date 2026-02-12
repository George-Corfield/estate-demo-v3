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
  const { tasks, fields, moveTask, addComment, showToast } = useApp()
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
      <div className="p-4 border-b border-slate-100">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-3"
        >
          <span className="material-icons text-base">arrow_back</span>
          Back to tasks
        </button>
        <h2 className="text-lg font-bold text-slate-900 mb-2">{task.name}</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
          <span className="text-xs text-slate-400">{task.type}</span>
        </div>
      </div>

      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Details tab */}
        {activeTab === 'details' && (
          <div className="p-5 space-y-5">
            {/* Status changer */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</h3>
              <div className="flex gap-2">
                {STATUS_FLOW.map(s => (
                  <button
                    key={s.value}
                    onClick={() => handleStatusChange(s.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      task.status === s.value
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                    }`}
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
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{task.description}</p>
              </div>
            )}

            {/* Fields */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Fields ({taskFields.length})
              </h3>
              <div className="space-y-1">
                {taskFields.map(f => (
                  <button
                    key={f.id}
                    onClick={() => navigate('/fields', { state: { openFieldId: f.id } })}
                    className="w-full text-left text-sm text-slate-700 py-1 px-3 bg-slate-50 rounded hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer"
                  >
                    {f.name} — {f.sizeHectares} ha
                  </button>
                ))}
              </div>
            </div>

            {/* Staff */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Assigned Staff</h3>
              <div className="space-y-1">
                {task.assignedTo.map(name => (
                  <div key={name} className="flex items-center gap-2 text-sm text-slate-700 py-1">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
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
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Machinery</h3>
                {task.assignedMachinery.map(m => (
                  <div key={m} className="text-sm text-slate-700 py-1 px-3 bg-slate-50 rounded">
                    {m}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Type fields tab */}
        {activeTab === 'typeFields' && (
          <div className="p-5">
            <TaskTypeFields task={task} />
          </div>
        )}

        {/* Comments tab */}
        {activeTab === 'comments' && (
          <div className="p-5">
            <form onSubmit={handleAddComment} className="flex gap-2 mb-5">
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-emerald-950 text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors"
              >
                Post
              </button>
            </form>

            <div className="space-y-4">
              {[...(task.comments || [])].reverse().map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                    {comment.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-800">{comment.author}</span>
                      <span className="text-xs text-slate-400">{formatShortDate(comment.date)}</span>
                    </div>
                    <p className="text-sm text-slate-600">{comment.text}</p>
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
    <div className="p-3 bg-slate-50 rounded-lg">
      <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value}</p>
    </div>
  )
}
