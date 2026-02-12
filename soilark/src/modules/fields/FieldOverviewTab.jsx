import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatRelativeDate } from '../../utils/dates'
import { PriorityBadge, StatusBadge } from '../../components/shared/Badge'
import FieldEditForm from './FieldEditForm'

export default function FieldOverviewTab({ field }) {
  const { tasks } = useApp()
  const [editing, setEditing] = useState(false)
  const navigate = useNavigate()

  const linkedTasks = tasks.filter(t => t.fieldIds.includes(field.id))

  if (editing) {
    return <FieldEditForm field={field} onCancel={() => setEditing(false)} onSave={() => setEditing(false)} />
  }

  return (
    <div className="p-5 space-y-6">
      {/* Properties grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Properties</h3>
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:bg-primary/5 px-2 py-1 rounded transition-colors"
          >
            <span className="material-icons text-xs">edit</span>
            Edit
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <PropItem label="Category" value={field.category} />
          <PropItem label="Size" value={`${field.sizeHectares} ha`} />
          <PropItem label="Soil Type" value={field.soilType} />
          <PropItem label="Drainage" value={field.drainage} />
          <PropItem label="Current Crop" value={field.currentCrop || '—'} />
          <PropItem label="Livestock" value={field.livestock || '—'} />
          <PropItem label="Last Worked" value={field.lastWorked ? formatRelativeDate(field.lastWorked) : '—'} />
        </div>
      </div>

      {/* Description */}
      {field.description && (
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{field.description}</p>
        </div>
      )}

      {/* Linked tasks */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Linked Tasks
          {linkedTasks.length > 0 && <span className="text-slate-400 ml-1">({linkedTasks.length})</span>}
        </h3>
        {linkedTasks.length === 0 ? (
          <p className="text-sm text-slate-400">No tasks linked to this field</p>
        ) : (
          <div className="space-y-2">
            {linkedTasks.map(task => (
              <button
                key={task.id}
                onClick={() => navigate('/tasks', { state: { openTaskId: task.id } })}
                className="w-full text-left p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-slate-800">{task.name}</p>
                  <PriorityBadge priority={task.priority} />
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <StatusBadge status={task.status} />
                  <span>{task.type}</span>
                  <span>{formatRelativeDate(task.dueDate)}</span>
                </div>
                {task.assignedTo.length > 0 && (
                  <p className="text-xs text-slate-400 mt-1">
                    Assigned: {task.assignedTo.join(', ')}
                  </p>
                )}
              </button>
            ))}
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
