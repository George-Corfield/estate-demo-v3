import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ACTIONS = [
  { icon: 'event', label: 'Calendar Event', color: 'bg-indigo-500', action: 'calendar' },
  { icon: 'receipt_long', label: 'Add Expense', color: 'bg-amber-500', action: 'expense', disabled: true },
  { icon: 'note_add', label: 'Field Note', color: 'bg-emerald-500', action: 'fieldNote' },
  { icon: 'add_task', label: 'Add Task', color: 'bg-blue-500', action: 'task' },
]

export default function FAB() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleAction = (action) => {
    setOpen(false)
    switch (action) {
      case 'task':
        navigate('/tasks', { state: { createTask: true } })
        break
      case 'fieldNote':
        navigate('/fields', { state: { addNote: true } })
        break
      case 'calendar':
        navigate('/', { state: { openCalendar: true } })
        break
      default:
        break
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      {/* Main FAB button */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full bg-primary text-emerald-950 shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 ${
          open ? 'rotate-45' : ''
        }`}
      >
        <span className="material-icons text-2xl">add</span>
      </button>

      {/* Action buttons */}
      {open && ACTIONS.map((item, i) => (
        <button
          key={item.action}
          onClick={() => !item.disabled && handleAction(item.action)}
          disabled={item.disabled}
          className={`flex items-center gap-3 pl-4 pr-2 py-2 rounded-full shadow-lg transition-all duration-200 ${
            item.disabled
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-white text-slate-800 hover:shadow-xl'
          }`}
          style={{
            animation: `fadeInUp 0.2s ease-out ${i * 0.05}s both`,
          }}
        >
          <span className="text-sm font-medium">{item.label}</span>
          <span className={`material-icons text-white p-1.5 rounded-full text-sm ${item.disabled ? 'bg-slate-300' : item.color}`}>
            {item.icon}
          </span>
        </button>
      ))}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
