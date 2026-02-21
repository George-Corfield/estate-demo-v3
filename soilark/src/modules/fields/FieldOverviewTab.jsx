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
    <div style={{ padding: 20 }} className="flex flex-col gap-6">
      {/* Properties grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-label" style={{ color: 'var(--color-earth-400)' }}>Properties</h3>
          <button onClick={() => setEditing(true)} className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit</span>
            Edit
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <PropItem label="Category" value={field.category} />
          <PropItem label="Size" value={`${field.sizeHectares} ha`} mono />
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
          <h3 className="text-label mb-2" style={{ color: 'var(--color-earth-400)' }}>Description</h3>
          <p className="text-body" style={{ color: 'var(--color-earth-600)' }}>{field.description}</p>
        </div>
      )}

      {/* Linked tasks */}
      <div>
        <h3 className="text-label mb-3" style={{ color: 'var(--color-earth-400)' }}>
          Linked Tasks
          {linkedTasks.length > 0 && <span style={{ color: 'var(--color-earth-400)', marginLeft: 4 }}>({linkedTasks.length})</span>}
        </h3>
        {linkedTasks.length === 0 ? (
          <p className="text-body" style={{ color: 'var(--color-earth-400)' }}>No tasks linked to this field</p>
        ) : (
          <div className="flex flex-col gap-2">
            {linkedTasks.map(task => (
              <button
                key={task.id}
                onClick={() => navigate('/tasks', { state: { openTaskId: task.id } })}
                className="card w-full text-left"
                style={{ padding: 12, cursor: 'pointer', transition: 'border-color 120ms ease' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-sage-500)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-parchment-300)' }}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-heading-4" style={{ color: 'var(--color-ink-900)', margin: 0 }}>{task.name}</p>
                  <PriorityBadge priority={task.priority} />
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={task.status} />
                  <span className="text-body-small" style={{ color: 'var(--color-earth-500)' }}>{task.type}</span>
                  <span className="text-body-small" style={{ color: 'var(--color-earth-400)' }}>{formatRelativeDate(task.dueDate)}</span>
                </div>
                {task.assignedTo.length > 0 && (
                  <p className="text-body-small" style={{ color: 'var(--color-earth-400)', marginTop: 4 }}>
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

function PropItem({ label, value, mono }) {
  return (
    <div style={{ padding: 12, background: 'var(--color-parchment-100)', border: '1px solid var(--color-parchment-300)', borderRadius: 'var(--radius-md)' }}>
      <p className="text-label" style={{ color: 'var(--color-earth-400)', marginBottom: 4 }}>{label}</p>
      <p className={mono ? 'text-data' : 'text-body'} style={{ color: 'var(--color-ink-900)', fontWeight: 500, margin: 0 }}>{value}</p>
    </div>
  )
}
