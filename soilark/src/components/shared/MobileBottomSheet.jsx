import { useEffect, useRef } from 'react'
import { DAYS_SHORT, MONTHS } from '../../utils/dates'

function formatSheetDate(date) {
  if (!date) return ''
  const d = new Date(date)
  return `${DAYS_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`
}

export default function MobileBottomSheet({ isOpen, date, children, onClose, onAddEvent }) {
  const sheetRef = useRef(null)
  const startYRef = useRef(null)
  const currentYRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handlePointerDown = (e) => {
    startYRef.current = e.clientY
    currentYRef.current = e.clientY
  }

  const handlePointerMove = (e) => {
    if (startYRef.current === null) return
    currentYRef.current = e.clientY
    const dy = e.clientY - startYRef.current
    if (dy > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${dy}px)`
    }
  }

  const handlePointerUp = () => {
    if (startYRef.current === null) return
    const dy = currentYRef.current - startYRef.current
    if (dy > 80) {
      onClose()
    } else if (sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(0)'
    }
    startYRef.current = null
    currentYRef.current = null
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 75,
          background: 'rgba(0,0,0,0.4)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 250ms ease',
        }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 80,
          background: 'var(--color-surface-50)',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          boxShadow: 'var(--shadow-lg)',
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh',
        }}
      >
        {/* Drag handle */}
        <div
          style={{ padding: '12px 0 0', cursor: 'grab', touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            background: 'var(--color-surface-300)',
            margin: '0 auto',
          }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          borderBottom: '1px solid var(--color-surface-300)',
          flexShrink: 0,
        }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--color-slate-900)' }}>
            {formatSheetDate(date)}
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-slate-400)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }} className="custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--color-surface-300)',
          flexShrink: 0,
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        }}>
          <button
            onClick={onAddEvent}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
            Add Event
          </button>
        </div>
      </div>
    </>
  )
}
