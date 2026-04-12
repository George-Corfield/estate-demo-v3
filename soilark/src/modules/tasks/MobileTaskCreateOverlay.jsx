import { useState, useRef } from 'react'
import EstateMap from '../../components/shared/EstateMap'
import MobileTaskCreateStepper from './MobileTaskCreateStepper'
import { useApp } from '../../context/AppContext'

const SNAPS = { peek: '28vh', mid: '58vh', full: '95vh' }
const SNAP_ORDER = ['peek', 'mid', 'full']

export default function MobileTaskCreateOverlay({
  formKey,
  selectedFieldIds,
  setSelectedFieldIds,
  onCancel,
  onSave,
}) {
  const { overlayInteraction } = useApp()
  const [snap, setSnap] = useState('full')
  const [dragHeight, setDragHeight] = useState(null)
  const dragStartY = useRef(null)
  const dragStartHeight = useRef(null)
  const dragHeightRef = useRef(null)

  const onTouchStart = (e) => {
    dragStartY.current = e.touches[0].clientY
    dragStartHeight.current = dragHeight ?? (window.innerHeight * parseFloat(SNAPS[snap]) / 100)
  }

  const onTouchMove = (e) => {
    if (dragStartY.current === null) return
    const delta = dragStartY.current - e.touches[0].clientY
    const minPx = window.innerHeight * 0.28
    const maxPx = window.innerHeight * 0.95
    const newH = Math.min(maxPx, Math.max(minPx, dragStartHeight.current + delta))
    dragHeightRef.current = newH
    setDragHeight(newH)
    const midPx = window.innerHeight * 0.58
    if (newH >= midPx) setSnap('full')
    else if (newH >= minPx + 50 && newH < midPx) setSnap('mid')
    else setSnap('minimal')
  }

  const onTouchEnd = (e) => {
    if (dragStartY.current === null) return
    if (overlayInteraction === 'drag') {
      // No snap, no close — height stays wherever released
      dragStartY.current = null
      dragHeightRef.current = null
      return
    }
    const delta = e.changedTouches[0].clientY - dragStartY.current
    dragStartY.current = null
    const idx = SNAP_ORDER.indexOf(snap)
    if (delta < -40 && idx < SNAP_ORDER.length - 1) setSnap(SNAP_ORDER[idx + 1])
    else if (delta > 40 && idx > 0) setSnap(SNAP_ORDER[idx - 1])
    else if (delta > 40 && idx === 0) onCancel()
  }

  const handleClickUp = () => {
    const idx = SNAP_ORDER.indexOf(snap)
    if (idx < SNAP_ORDER.length - 1) setSnap(SNAP_ORDER[idx + 1])
  }

  const handleClickDown = () => {
    const idx = SNAP_ORDER.indexOf(snap)
    if (idx > 0) setSnap(SNAP_ORDER[idx - 1])
    else onCancel()
  }

  const sheetTouchHandlers = overlayInteraction === 'drag'
    ? { onTouchStart, onTouchMove, onTouchEnd }
    : {}

  const handleBarTouchHandlers = overlayInteraction === 'swipe'
    ? { onTouchStart, onTouchEnd }
    : {}

  const clickBtnStyle = {
    position: 'absolute', background: 'none', border: 'none', cursor: 'pointer',
    padding: '4px 8px', borderRadius: 6, color: 'var(--color-slate-400)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }

  const isDragging = overlayInteraction === 'drag' && dragHeight !== null

  const handleFieldClick = (field) => {
    setSelectedFieldIds(prev =>
      prev.includes(field.id)
        ? prev.filter(id => id !== field.id)
        : [...prev, field.id]
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60 }}>
      {/* Full-screen map */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <EstateMap
          selectedFieldIds={selectedFieldIds}
          highlightedFieldIds={[]}
          onFieldClick={handleFieldClick}
        />
      </div>

      {/* Floating back button */}
      <button
        onClick={onCancel}
        style={{
          position: 'absolute', top: 16, left: 16, zIndex: 31,
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(22,26,18,0.72)', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'rgba(255,255,255,0.9)' }}>arrow_back</span>
      </button>

      {/* Tap-fields hint (visible when map is showing) */}
      {snap !== 'full' && (
        <div style={{
          position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
          zIndex: 31, background: 'rgba(22,26,18,0.72)', backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)', borderRadius: 99,
          padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6,
          pointerEvents: 'none',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>touch_app</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
            Tap fields to select
          </span>
        </div>
      )}

      {/* Bottom sheet */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: isDragging ? dragHeight + 'px' : SNAPS[snap],
          transition: isDragging ? 'none' : 'height 320ms cubic-bezier(0.32,0.72,0,1)',
          background: 'var(--color-surface-50)',
          borderRadius: '20px 20px 0 0',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          zIndex: 30,
          boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
          paddingBottom: 'var(--bottom-nav-height)',
        }}
        {...sheetTouchHandlers}
      >
        {/* Drag handle */}
        <div {...handleBarTouchHandlers} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 10, paddingBottom: 2, flexShrink: 0, position: 'relative' }}>
          {overlayInteraction === 'click' && (
            <button onClick={handleClickDown} style={{ ...clickBtnStyle, left: 70 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>keyboard_arrow_down</span>
            </button>
          )}
          <div style={{ width: 36, height: 4, borderRadius: 99, background: 'var(--color-surface-300)' }} />
          {overlayInteraction === 'click' && (
            <button onClick={handleClickUp} style={{ ...clickBtnStyle, right: 70 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>keyboard_arrow_up</span>
            </button>
          )}
        </div>

        {/* Form fills the sheet */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <MobileTaskCreateStepper
            key={formKey}
            selectedFieldIds={selectedFieldIds}
            setSelectedFieldIds={setSelectedFieldIds}
            onCancel={onCancel}
            onSave={onSave}
            onStepChange={(idx) => setSnap(idx === 1 ? 'mid' : 'full')}
          />
        </div>
      </div>
    </div>
  )
}
