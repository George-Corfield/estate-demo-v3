import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const ACTIONS = [
  { icon: 'add_task', label: 'Add Task', color: 'bg-blue-500', action: 'task' },
  { icon: 'visibility', label: 'Add Observation', color: 'bg-teal-500', action: 'observation' },
  { icon: 'note_add', label: 'Add Note', color: 'bg-emerald-500', action: 'note' },
  { icon: 'landscape', label: 'Add Field', color: 'bg-green-600', action: 'field' },
  { icon: 'receipt_long', label: 'Add Expense', color: 'bg-amber-500', action: 'expense' },
  { icon: 'build', label: 'Book Service', color: 'bg-indigo-500', action: 'bookService' },
  { icon: 'healing', label: 'Report Sick', color: 'bg-red-500', action: 'reportSick' },
]

const CLICK_BUFFER = 12 // px buffer around the FAB container for misclicks

export default function FAB() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const containerRef = useRef(null)

  // Close FAB when overview tray opens
  useEffect(() => {
    const handleTrayOpen = () => setOpen(false)
    window.addEventListener('overview-tray-open', handleTrayOpen)
    return () => window.removeEventListener('overview-tray-open', handleTrayOpen)
  }, [])

  // Close FAB when clicking outside (with buffer zone)
  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const inBuffer =
        e.clientX >= rect.left - CLICK_BUFFER &&
        e.clientX <= rect.right + CLICK_BUFFER &&
        e.clientY >= rect.top - CLICK_BUFFER &&
        e.clientY <= rect.bottom + CLICK_BUFFER
      if (!inBuffer) setOpen(false)
    }
    document.addEventListener('pointerdown', handleClickOutside)
    return () => document.removeEventListener('pointerdown', handleClickOutside)
  }, [open])

  const toggleOpen = useCallback(() => {
    const next = !open
    setOpen(next)
    if (next) {
      window.dispatchEvent(new CustomEvent('fab-open'))
    }
  }, [open])

  const handleAction = (action) => {
    setOpen(false)
    if (action === 'task') {
      const path = location.pathname
      if (path === '/tasks' || path === '/fields') {
        window.dispatchEvent(new CustomEvent('fab-add-task'))
      } else {
        navigate('/tasks', { state: { createTask: true } })
      }
      return
    }
    console.log(`FAB action: ${action}`)
  }

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      {/* Main FAB button */}
      <button
        onClick={toggleOpen}
        className={`w-14 h-14 rounded-full bg-primary text-emerald-950 shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 ${
          open ? 'rotate-45' : ''
        }`}
      >
        <span className="material-symbols-outlined" style={{ fontSize: "30px"}}>add</span>
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
          <span className={`material-symbols-outlined text-white p-1.5 rounded-full text-sm ${item.disabled ? 'bg-slate-300' : item.color}`}>
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
