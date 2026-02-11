import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { initialStaff } from '../../data/staff'

const TASK_TYPES = ['Planting', 'Harvesting', 'Fertilizing', 'Maintenance', 'Feeding', 'Irrigation']
const PRIORITIES = ['low', 'medium', 'high']

export default function TaskCreateForm({
  selectedFieldIds,
  setSelectedFieldIds,
  dueDate,
  setDueDate,
  onCancel,
  onSave,
  onFocusDate,
}) {
  const { fields, addTask, showToast } = useApp()
  const [form, setForm] = useState({
    name: '',
    type: '',
    description: '',
    priority: 'medium',
    assignedTo: [],
  })

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const toggleStaff = (name) => {
    setForm(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(name)
        ? prev.assignedTo.filter(n => n !== name)
        : [...prev.assignedTo, name],
    }))
  }

  const toggleField = (id) => {
    setSelectedFieldIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.type || !dueDate || selectedFieldIds.length === 0) return

    addTask({
      id: `task-${Date.now()}`,
      name: form.name,
      type: form.type,
      status: 'todo',
      priority: form.priority,
      dueDate,
      description: form.description,
      assignedTo: form.assignedTo,
      assignedMachinery: [],
      fieldIds: selectedFieldIds,
      completedDate: null,
      typeFields: {},
      comments: [],
    })

    showToast('Task created')
    onSave()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">New Task</h2>
        <button onClick={onCancel} className="p-1 hover:bg-slate-100 rounded">
          <span className="material-icons text-slate-400">close</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
        {/* Name */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Task Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => update('name', e.target.value)}
            placeholder="e.g. Apply Spring Fertiliser"
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Task Type *</label>
          <select
            value={form.type}
            onChange={e => update('type', e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
            required
          >
            <option value="">Select type...</option>
            {TASK_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Fields */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">
            Fields * <span className="text-slate-400 normal-case">(click map or select below)</span>
          </label>
          {selectedFieldIds.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1 mb-2">
              {selectedFieldIds.map(id => {
                const f = fields.find(ff => ff.id === id)
                return f ? (
                  <span key={id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {f.name}
                    <button type="button" onClick={() => toggleField(id)} className="hover:text-red-500">
                      <span className="material-icons text-xs">close</span>
                    </button>
                  </span>
                ) : null
              })}
            </div>
          )}
          <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
            {fields.map(f => (
              <label key={f.id} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={selectedFieldIds.includes(f.id)}
                  onChange={() => toggleField(f.id)}
                  className="rounded border-slate-300 text-primary focus:ring-primary/30"
                />
                <span className="text-slate-700">{f.name}</span>
                <span className="text-xs text-slate-400 ml-auto">{f.category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Description</label>
          <textarea
            value={form.description}
            onChange={e => update('description', e.target.value)}
            placeholder="Optional details..."
            rows={3}
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none"
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">
            Due Date * <span className="text-slate-400 normal-case">(or click calendar)</span>
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            onFocus={onFocusDate}
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
            required
          />
        </div>

        {/* Priority */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Priority</label>
          <div className="flex gap-2 mt-1">
            {PRIORITIES.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => update('priority', p)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${
                  form.priority === p
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Staff */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Assign Staff</label>
          <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100 mt-1">
            {initialStaff.map(s => (
              <label key={s.id} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={form.assignedTo.includes(s.name)}
                  onChange={() => toggleStaff(s.name)}
                  className="rounded border-slate-300 text-primary focus:ring-primary/30"
                />
                <span className="text-slate-700">{s.name}</span>
                <span className="text-xs text-slate-400 ml-auto">{s.role}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-2 pt-2 pb-4">
          <button
            type="submit"
            className="flex-1 py-2.5 bg-primary text-emerald-950 text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors"
          >
            Create Task
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
