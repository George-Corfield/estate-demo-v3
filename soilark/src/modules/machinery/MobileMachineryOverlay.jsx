import { useState, useMemo, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { formatShortDate } from '../../utils/dates'
import EstateMap from '../../components/shared/EstateMap'
import MachineryDetailView from './MachineryDetailView'

const SNAPS = { minimal: '22vh', mid: '54vh', full: '95vh' }
const SNAP_ORDER = ['minimal', 'mid', 'full']

const STATUS_DARK = {
  Active:      { bg: 'rgba(19,236,19,0.15)',  border: 'rgba(19,236,19,0.35)',   text: '#4ade80' },
  Available:   { bg: 'rgba(255,255,255,0.10)', border: 'rgba(255,255,255,0.18)', text: 'rgba(255,255,255,0.75)' },
  Unavailable: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.35)',  text: '#fbbf24' },
  Sold:        { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', text: 'rgba(255,255,255,0.4)' },
}

const TYPE_ICON_MAP = {
  Tractor:               'agriculture',
  'Combine Harvester':   'precision_manufacturing',
  'Fertilizer Spreader': 'scatter_plot',
  'Forage Harvester':    'grass',
  Seeder:                'yard',
  Mower:                 'content_cut',
  Vehicle:               'directions_car',
  Other:                 'build',
}

function PropItem({ label, value, accent }) {
  return (
    <div style={{ padding: 12, background: 'rgba(255,255,255,0.07)', borderRadius: 8 }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </p>
      <p style={{ fontSize: 14, fontWeight: 600, color: accent || 'rgba(255,255,255,0.9)', margin: 0 }}>
        {value || '—'}
      </p>
    </div>
  )
}

export default function MobileMachineryOverlay({ equipmentId, onBack }) {
  const { machinery, tasks, fields, overlayInteraction } = useApp()
  const [snap, setSnap] = useState('mid')
  const [dragHeight, setDragHeight] = useState(null)
  const dragStartY = useRef(null)
  const dragStartHeight = useRef(null)
  const dragHeightRef = useRef(null)

  const equipment = useMemo(() => machinery.find(m => m.id === equipmentId), [machinery, equipmentId])

  const inProgressTask = useMemo(() => {
    if (!equipment) return null
    return tasks.find(t => t.assignedMachinery.includes(equipment.name) && t.status === 'inProgress')
  }, [equipment, tasks])

  const activeTaskFields = useMemo(() => {
    if (!inProgressTask) return []
    return fields.filter(f => inProgressTask.fieldIds?.includes(f.id))
  }, [inProgressTask, fields])

  const activeFieldIds = useMemo(() => activeTaskFields.map(f => f.id), [activeTaskFields])

  if (!equipment) return null

  const schedule = equipment.serviceSchedule || { type: 'hours', interval: 250 }
  const isServiceOverdue = schedule.type === 'hours'
    ? equipment.hours >= equipment.nextServiceDue
    : new Date() >= new Date(equipment.nextServiceDue)

  const serviceLabel = schedule.type === 'hours'
    ? `${Number(equipment.nextServiceDue).toLocaleString()} hrs`
    : formatShortDate(equipment.nextServiceDue)

  const statusColors = STATUS_DARK[equipment.status] || STATUS_DARK.Available
  const typeIcon = TYPE_ICON_MAP[equipment.type] || 'build'

  const handleTouchStart = (e) => {
    dragStartY.current = e.touches[0].clientY
    dragStartHeight.current = dragHeight ?? (window.innerHeight * parseFloat(SNAPS[snap]) / 100)
  }

  const handleTouchMove = (e) => {
    if (dragStartY.current === null) return
    const delta = dragStartY.current - e.touches[0].clientY
    const minPx = window.innerHeight * 0.22
    const maxPx = window.innerHeight * 0.95
    const newH = Math.min(maxPx, Math.max(minPx, dragStartHeight.current + delta))
    dragHeightRef.current = newH
    setDragHeight(newH)
    const midPx = window.innerHeight * 0.54
    if (newH >= midPx) setSnap('full')
    else if (newH >= minPx + 50 && newH < midPx) setSnap('mid')
    else setSnap('minimal')
  }

  const handleTouchEnd = (e) => {
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
    else if (delta > 40 && idx === 0) onBack()
  }

  const handleClickUp = () => {
    const idx = SNAP_ORDER.indexOf(snap)
    if (idx < SNAP_ORDER.length - 1) setSnap(SNAP_ORDER[idx + 1])
  }

  const handleClickDown = () => {
    const idx = SNAP_ORDER.indexOf(snap)
    if (idx > 0) setSnap(SNAP_ORDER[idx - 1])
    else onBack()
  }

  const sheetTouchHandlers = overlayInteraction === 'drag'
    ? { onTouchStart: handleTouchStart, onTouchMove: handleTouchMove, onTouchEnd: handleTouchEnd }
    : {}

  const handleBarTouchHandlers = overlayInteraction === 'swipe'
    ? { onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd }
    : {}

  const clickBtnStyle = {
    position: 'absolute', background: 'none', border: 'none', cursor: 'pointer',
    padding: '4px 8px', borderRadius: 6, color: 'rgba(255,255,255,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }

  const isDragging = overlayInteraction === 'drag' && dragHeight !== null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60 }}>
      {/* Map background */}
      <EstateMap highlightedFieldIds={activeFieldIds} />

      {/* Vehicle icon pinned on each active field */}
      {activeTaskFields.map(f => {
        const pos = f.mapPosition
        return (
          <div
            key={f.id}
            style={{
              position: 'absolute',
              top: `${pos.top + pos.height / 2}%`,
              left: `${pos.left + pos.width / 2}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
              pointerEvents: 'none',
            }}
          >
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 0 4px rgba(19,236,19,0.25), 0 2px 10px rgba(0,0,0,0.4)',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#1a1a1a' }}>{typeIcon}</span>
            </div>
          </div>
        )
      })}

      {/* Back button */}
      <button
        onClick={onBack}
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

      {/* Bottom sheet */}
      <div
        {...sheetTouchHandlers}
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: isDragging ? dragHeight + 'px' : SNAPS[snap],
          background: 'rgba(22,26,18,0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '20px 20px 0 0',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          transition: isDragging ? 'none' : 'height 320ms cubic-bezier(0.32,0.72,0,1)',
          overflow: 'hidden',
          paddingBottom: 'var(--bottom-nav-height)',
        }}
      >
        {/* Drag handle */}
        <div {...handleBarTouchHandlers} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 0 4px', flexShrink: 0, position: 'relative' }}>
          {overlayInteraction === 'click' && (
            <button onClick={handleClickDown} style={{ ...clickBtnStyle, left: 70 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>keyboard_arrow_down</span>
            </button>
          )}
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
          {overlayInteraction === 'click' && (
            <button onClick={handleClickUp} style={{ ...clickBtnStyle, right: 70 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>keyboard_arrow_up</span>
            </button>
          )}
        </div>

        {/* Minimal snap */}
        {snap === 'minimal' && (
          <div style={{ padding: '8px 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
              {typeIcon}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.95)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {equipment.name}
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0, marginTop: 2 }}>
                {equipment.type} · {equipment.hours.toLocaleString()} hrs
              </p>
            </div>
            <span style={{
              padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, flexShrink: 0,
              background: statusColors.bg, border: `1px solid ${statusColors.border}`,
              color: statusColors.text,
            }}>
              {equipment.status}
            </span>
          </div>
        )}

        {/* Mid snap */}
        {snap === 'mid' && (
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '8px 20px 14px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'rgba(255,255,255,0.45)', flexShrink: 0 }}>
                  {typeIcon}
                </span>
                <div>
                  <p style={{ fontSize: 17, fontWeight: 700, color: 'rgba(255,255,255,0.95)', margin: 0 }}>{equipment.name}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                    {equipment.type} · {equipment.make} {equipment.model}
                  </p>
                </div>
                <span style={{
                  marginLeft: 'auto', padding: '3px 10px', borderRadius: 99,
                  fontSize: 11, fontWeight: 600, flexShrink: 0,
                  background: statusColors.bg, border: `1px solid ${statusColors.border}`,
                  color: statusColors.text,
                }}>
                  {equipment.status}
                </span>
              </div>
            </div>

            {/* Properties grid */}
            <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flexShrink: 0 }}>
              <PropItem label="Hours" value={equipment.hours.toLocaleString()} />
              <PropItem
                label="Next Service"
                value={serviceLabel}
                accent={isServiceOverdue ? '#fbbf24' : undefined}
              />
              <PropItem label="Year" value={String(equipment.year)} />
              <PropItem label="Serial / Reg" value={equipment.numberPlate || equipment.serialNumber} />
            </div>

            {/* Status line + action */}
            <div style={{ padding: '12px 20px 0', flexShrink: 0 }}>
              {inProgressTask ? (
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>In use</span> · {inProgressTask.name}
                  {activeTaskFields.length > 0 && (
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}> · {activeTaskFields.map(f => f.name).join(', ')}</span>
                  )}
                </p>
              ) : (
                <p style={{ fontSize: 12, marginBottom: 10, color: isServiceOverdue ? '#fbbf24' : 'rgba(255,255,255,0.3)' }}>
                  {isServiceOverdue ? 'Service overdue' : 'No active task'}
                </p>
              )}
              <button
                onClick={() => setSnap('full')}
                style={{
                  width: '100%', padding: '10px 0', border: 'none', borderRadius: 10, cursor: 'pointer',
                  background: 'var(--color-primary)', color: '#1a1a1a',
                  fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>expand_less</span>
                Full Details
              </button>
            </div>

            {/* Expand hint */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto', padding: '12px 0 8px' }}>
              <button
                onClick={() => setSnap('full')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.3)', fontSize: 11 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>expand_less</span>
                Service &amp; history
              </button>
            </div>
          </div>
        )}

        {/* Full snap */}
        {snap === 'full' && (
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Compact dark header */}
            <div style={{ padding: '4px 20px 10px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', flexShrink: 0 }}>
                  {typeIcon}
                </span>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.95)', margin: 0 }}>{equipment.name}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                    {equipment.make} {equipment.model} · {equipment.year}
                  </p>
                </div>
              </div>
            </div>

            {/* Detail view — light bg for readability */}
            <div style={{ flex: 1, overflow: 'hidden', background: 'var(--color-surface-50)', borderRadius: '12px 12px 0 0' }}>
              <MachineryDetailView
                equipmentId={equipmentId}
                onClose={() => setSnap('mid')}
                hideHeader
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
