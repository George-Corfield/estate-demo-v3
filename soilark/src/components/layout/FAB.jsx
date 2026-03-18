import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ROLES } from '../../constants/roles'

const MANAGER_ACTIONS = [
  { icon: 'add_task', label: 'Add Task', color: 'bg-blue-500', action: 'task' },
  { icon: 'visibility', label: 'Add Observation', color: 'bg-teal-500', action: 'observation' },
  { icon: 'draw', label: 'Draw', color: 'bg-purple-500', action: 'draw', disabled: true },
  { icon: 'smart_toy', label: 'Ask LandArk', color: 'bg-emerald-600', action: 'landark', disabled: true },
]

const WORKER_ACTIONS = [
  { icon: 'add_task', label: 'Add Task', color: 'bg-blue-500', action: 'task' },
  { icon: 'visibility', label: 'Add Observation', color: 'bg-teal-500', action: 'observation' },
  { icon: 'sick', label: 'Report Sick', color: 'bg-red-500', action: 'reportSick', disabled: true },
  { icon: 'event', label: 'Book Holiday', color: 'bg-amber-500', action: 'bookHoliday', disabled: true },
  { icon: 'smart_toy', label: 'Ask LandArk', color: 'bg-emerald-600', action: 'landark', disabled: true },
]

const CLICK_BUFFER = 12 // px buffer around the FAB container for misclicks

export default function FAB() {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const containerRef = useRef(null)
  const { currentUser } = useApp()
  const ACTIONS = currentUser?.role === ROLES.FARM_MANAGER ? MANAGER_ACTIONS : WORKER_ACTIONS

  const closeFab = useCallback(() => {
    if (!open || closing) return
    setClosing(true)
    setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, 150)
  }, [open, closing])

  // Close FAB when overview tray opens
  useEffect(() => {
    const handleTrayOpen = () => closeFab()
    window.addEventListener('overview-tray-open', handleTrayOpen)
    return () => window.removeEventListener('overview-tray-open', handleTrayOpen)
  }, [closeFab])

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
      if (!inBuffer) closeFab()
    }
    document.addEventListener('pointerdown', handleClickOutside)
    return () => document.removeEventListener('pointerdown', handleClickOutside)
  }, [open, closeFab])

  const toggleOpen = useCallback(() => {
    if (open) {
      closeFab()
    } else {
      setOpen(true)
      window.dispatchEvent(new CustomEvent('fab-open'))
    }
  }, [open, closeFab])

  const handleAction = (action) => {
    closeFab()
    if (action === 'task') {
      const path = location.pathname
      if (path === '/tasks' || path === '/fields') {
        window.dispatchEvent(new CustomEvent('fab-add-task'))
      } else {
        navigate('/tasks', { state: { createTask: true } })
      }
      return
    }
    if (action === 'observation') {
      if (location.pathname === '/fields') {
        window.dispatchEvent(new CustomEvent('fab-add-observation'))
      } else {
        navigate('/fields', { state: { selectFieldForObservation: true } })
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
          open && !closing ? 'rotate-45' : ''
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
            animation: closing
              ? `fadeOutDown 0.15s ease-in ${(ACTIONS.length - 1 - i) * 0.02}s both`
              : `fadeInUp 0.2s ease-out ${i * 0.05}s both`,
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
        @keyframes fadeOutDown {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(8px); }
        }
      `}</style>
    </div>
  )
}
