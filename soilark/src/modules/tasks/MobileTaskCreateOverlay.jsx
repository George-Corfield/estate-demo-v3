import { useState, useRef } from 'react'
import EstateMap from '../../components/shared/EstateMap'
import TaskCreateForm from './TaskCreateForm'

const SNAPS = { peek: '28vh', mid: '58vh', full: '95vh' }
const SNAP_ORDER = ['peek', 'mid', 'full']

export default function MobileTaskCreateOverlay({
  formKey,
  selectedFieldIds,
  setSelectedFieldIds,
  dueDate,
  setDueDate,
  onCancel,
  onSave,
  initialValues,
}) {
  const [snap, setSnap] = useState('mid')
  const dragStartY = useRef(null)

  const onTouchStart = (e) => { dragStartY.current = e.touches[0].clientY }
  const onTouchEnd = (e) => {
    if (dragStartY.current === null) return
    const delta = e.changedTouches[0].clientY - dragStartY.current
    const idx = SNAP_ORDER.indexOf(snap)
    if (delta < -40 && idx < SNAP_ORDER.length - 1) setSnap(SNAP_ORDER[idx + 1])
    else if (delta > 40 && idx > 0) setSnap(SNAP_ORDER[idx - 1])
    else if (delta > 40 && idx === 0) onCancel()
    dragStartY.current = null
  }

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
          height: SNAPS[snap],
          transition: 'height 320ms cubic-bezier(0.32,0.72,0,1)',
          background: 'var(--color-surface-50)',
          borderRadius: '20px 20px 0 0',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          zIndex: 30,
          boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
          paddingBottom: 'var(--bottom-nav-height)',
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 2, flexShrink: 0, cursor: 'ns-resize' }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: 'var(--color-surface-300)' }} />
        </div>

        {/* Form fills the sheet */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <TaskCreateForm
            key={formKey}
            selectedFieldIds={selectedFieldIds}
            setSelectedFieldIds={setSelectedFieldIds}
            dueDate={dueDate}
            setDueDate={setDueDate}
            onCancel={onCancel}
            onSave={onSave}
            onFocusDate={() => {}}
            initialValues={initialValues}
          />
        </div>
      </div>
    </div>
  )
}
