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
  { icon: 'sick', label: 'Report Sick', color: 'bg-red-500', action: 'reportSick'},
  { icon: 'event', label: 'Book Holiday', color: 'bg-amber-500', action: 'bookHoliday', disabled: true },
  { icon: 'smart_toy', label: 'Ask LandArk', color: 'bg-emerald-600', action: 'landark', disabled: true },
]

const CLICK_BUFFER = 12 // px buffer around the FAB container for misclicks

export default function FAB() {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [sickStep, setSickStep] = useState(0)
  const [obsStep, setObsStep] = useState(0)
  const [obsDescription, setObsDescription] = useState('')

  const MIC_PRESET = 'Blocked drain at north gateway. Standing water — roughly 0.3ha affected. Drain outlet silted up.'
  const navigate = useNavigate()
  const location = useLocation()
  const containerRef = useRef(null)
  const { currentUser, staff, reportSick, showToast, addFieldActivity, aiEnabled } = useApp()
  const aiEnabledRef = useRef(aiEnabled)
  useEffect(() => { aiEnabledRef.current = aiEnabled }, [aiEnabled])
  const ACTIONS = currentUser?.role === ROLES.FARM_MANAGER ? MANAGER_ACTIONS : WORKER_ACTIONS

  const currentStaffMember = staff?.find(s => s.id === currentUser?.id)
  const canReportSick = currentStaffMember?.status === 'Available' || currentStaffMember?.status === 'Off Duty'

  const closeFab = useCallback(() => {
    if (!open || closing) return
    setClosing(true)
    setTimeout(() => {
      setOpen(false)
      setClosing(false)
      setSickStep(0)
      setObsStep(0)
      setObsDescription('')
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
    if (action === 'reportSick') {
      setSickStep(1)
      return
    }
    if (action === 'observation') {
      if (!aiEnabledRef.current) {
        if (location.pathname === '/fields') {
          window.dispatchEvent(new CustomEvent('fab-add-observation'))
        } else {
          navigate('/fields', { state: { selectFieldForObservation: true } })
        }
      } else {
        setObsStep(1)
      }
      return
    }
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
    console.log(`FAB action: ${action}`)
  }

  const handleObsConfirm = () => {
    addFieldActivity('field-01', {
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'observation',
      title: 'Drain Blockage — North Field Gateway',
      completedBy: currentUser.name,
      details: obsDescription,
      notes: null,
      linkedTaskId: null,
      taskAction: null,
      linkedEventId: null,
      machineryUsed: null,
      inputUsed: null,
      quantity: null,
      rate: null,
      units: null,
      evidence: [],
      source: 'manual',
    })
    showToast('Observation recorded — North Field')
    closeFab()
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

      {/* Sick confirm panel */}
      {open && sickStep === 1 && (
        <div
          className="flex items-center gap-2 bg-white rounded-full shadow-lg px-4 py-2"
          style={{ animation: `fadeInUp 0.2s ease-out both` }}
        >
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-slate-700)' }}>Report sick?</span>
          <button
            onClick={() => {
              reportSick(currentUser.id, currentUser.name, { selfReported: true })
              showToast('Sick leave requested — pending approval', 'info')
              closeFab()
            }}
            className="btn btn-ghost"
            style={{ color: 'var(--color-amber-400)', fontWeight: 600, fontSize: 12, padding: '2px 8px' }}
          >
            Confirm
          </button>
          <button
            onClick={() => setSickStep(0)}
            className="btn btn-ghost"
            style={{ fontSize: 12, padding: '2px 8px' }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Observation input panel */}
      {open && obsStep === 1 && aiEnabledRef.current && (
        <div
          className="flex flex-col gap-2 bg-white rounded-2xl shadow-lg p-3"
          style={{ minWidth: 400, minHeight: 100, animation: 'fadeInUp 0.2s ease-out both' }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-slate-500)' }}>
            North Field — Observation
          </div>
          <div className="flex gap-2 items-start">
            <textarea
              value={obsDescription}
              onChange={e => setObsDescription(e.target.value)}
              placeholder="Describe what you've seen..."
              rows={2}
              style={{
                flex: 1,
                fontSize: 12,
                resize: 'none',
                border: '1px solid var(--color-slate-200)',
                borderRadius: 8,
                padding: '6px 8px',
                outline: 'none',
                fontFamily: 'inherit',
                color: 'var(--color-slate-800)',
              }}
            />
            <button
              onClick={() => setObsDescription(MIC_PRESET)}
              title="Voice note"
              style={{ color: 'var(--color-teal-500)', padding: 4 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>mic</span>
            </button>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => { setObsStep(0); setObsDescription('') }}
              className="btn btn-ghost"
              style={{ fontSize: 12, padding: '2px 8px' }}
            >
              Cancel
            </button>
            <button
              disabled={!obsDescription.trim()}
              onClick={handleObsConfirm}
              className="btn btn-ghost"
              style={{ color: 'var(--color-teal-500)', fontWeight: 600, fontSize: 12, padding: '2px 8px' }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {open && sickStep === 0 && obsStep === 0 && ACTIONS.map((item, i) => {
        const isDisabled = item.disabled || (item.action === 'reportSick' && !canReportSick)
        return (
          <button
            key={item.action}
            onClick={() => !isDisabled && handleAction(item.action)}
            disabled={isDisabled}
            className={`flex items-center gap-3 pl-4 pr-2 py-2 rounded-full shadow-lg transition-all duration-200 ${
              isDisabled
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
            <span className={`material-symbols-outlined text-white p-1.5 rounded-full text-sm ${isDisabled ? 'bg-slate-300' : item.color}`}>
              {item.icon}
            </span>
          </button>
        )
      })}

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
