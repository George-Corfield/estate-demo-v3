import { useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import EstateMap from '../../components/shared/EstateMap'
import TabBar from '../../components/shared/TabBar'
import FieldOverviewTab from './FieldOverviewTab'
import FieldTasksTab from './FieldTasksTab'
import FieldHistoryTab from './FieldHistoryTab'
import ObservationThread from '../../components/shared/ObservationThread'
import { isOverdue } from '../../utils/dates'

const SNAPS = { minimal: '22vh', mid: '54vh', full: '95vh' }
const SNAP_ORDER = ['minimal', 'mid', 'full']

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'notes', label: 'Notes' },
  { id: 'history', label: 'History' },
]

function PropItem({ label, value }) {
  return (
    <div style={{ padding: 12, background: 'rgba(255,255,255,0.07)', borderRadius: 8 }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)', margin: 0 }}>{value || '—'}</p>
    </div>
  )
}

export default function MobileFieldOverlay({ fieldId, onBack, initialTab }) {
  const { fields, usages, tasks, showToast } = useApp()
  const [currentFieldId, setCurrentFieldId] = useState(fieldId)
  const [snap, setSnap] = useState('mid')
  const [activeTab, setActiveTab] = useState(initialTab || 'overview')
  const [openObservationForm, setOpenObservationForm] = useState(false)
  const dragStartY = useRef(null)
  const navigate = useNavigate()

  const field = useMemo(() => fields.find(f => f.id === currentFieldId), [fields, currentFieldId])
  const usageEntry = useMemo(() => usages.find(u => u.name === field?.usage), [usages, field?.usage])

  const activeTasks = useMemo(() => {
    if (!field) return []
    return tasks.filter(t => t.fieldIds?.includes(currentFieldId) && t.status !== 'done' && t.status !== 'cancelled')
  }, [tasks, currentFieldId, field])

  const overdueTasks = useMemo(
    () => activeTasks.filter(t => t.dueDate && isOverdue(t.dueDate)),
    [activeTasks]
  )

  if (!field) return null

  const colors = usageEntry ? { bg: usageEntry.bg, border: usageEntry.border } : null

  const handleTouchStart = (e) => {
    dragStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e) => {
    if (dragStartY.current === null) return
    const delta = e.changedTouches[0].clientY - dragStartY.current
    dragStartY.current = null
    const idx = SNAP_ORDER.indexOf(snap)
    if (delta < -40 && idx < SNAP_ORDER.length - 1) setSnap(SNAP_ORDER[idx + 1])
    else if (delta > 40 && idx > 0) setSnap(SNAP_ORDER[idx - 1])
    else if (delta > 40 && idx === 0) onBack()
  }

  const handleMapFieldClick = (clickedField) => {
    if (clickedField.id === currentFieldId) return
    setCurrentFieldId(clickedField.id)
    setSnap('mid')
    setActiveTab('overview')
    setOpenObservationForm(false)
  }

  const handleAddTask = () => {
    navigate('/tasks', { state: { createTask: true, prefillFieldIds: [currentFieldId] } })
    showToast(`Task linked to ${field.name}`)
  }

  const handleAddObservation = () => {
    setSnap('full')
    setActiveTab('history')
    setOpenObservationForm(true)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60 }}>
      {/* Map background */}
      <EstateMap highlightedFieldId={currentFieldId} onFieldClick={handleMapFieldClick} />

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
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'absolute',
          bottom:0, left: 0, right: 0,
          height: SNAPS[snap],
          background: 'rgba(22,26,18,0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '20px 20px 0 0',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          transition: 'height 320ms cubic-bezier(0.32,0.72,0,1)',
          overflow: 'hidden',
          paddingBottom: 'var(--bottom-nav-height)'
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* Minimal snap */}
        {snap === 'minimal' && (
          <div style={{ padding: '8px 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 14, height: 14, borderRadius: 3, flexShrink: 0,
              backgroundColor: colors?.bg, border: `2px solid ${colors?.border}`,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.95)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {field.name}
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0, marginTop: 2 }}>
                {field.usage} · {field.sizeHectares} ha
                {overdueTasks.length > 0 && (
                  <span style={{ color: 'var(--color-red-400)', marginLeft: 8 }}>
                    {overdueTasks.length} overdue
                  </span>
                )}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>swipe_up</span>
              swipe
            </div>
          </div>
        )}

        {/* Mid snap */}
        {snap === 'mid' && (
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '8px 20px 16px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                  backgroundColor: colors?.bg, border: `2px solid ${colors?.border}`,
                }} />
                <div>
                  <p style={{ fontSize: 17, fontWeight: 700, color: 'rgba(255,255,255,0.95)', margin: 0 }}>{field.name}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                    {field.usage} · {field.sizeHectares} ha · {field.soilType || 'Unknown soil'}
                  </p>
                </div>
                {overdueTasks.length > 0 && (
                  <div style={{
                    marginLeft: 'auto', padding: '3px 10px', borderRadius: 99,
                    background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                    fontSize: 12, fontWeight: 600, color: 'var(--color-red-400)', flexShrink: 0,
                  }}>
                    {overdueTasks.length} overdue
                  </div>
                )}
              </div>
            </div>

            {/* Properties grid */}
            <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flexShrink: 0 }}>
              <PropItem label="Usage" value={field.usage} />
              <PropItem label="Size" value={`${field.sizeHectares} ha`} />
              <PropItem label="Soil Type" value={field.soilType} />
              <PropItem label="Scheme" value={field.scheme !== 'None' ? field.scheme : '—'} />
            </div>

            {/* Task count + actions */}
            <div style={{ padding: '12px 20px 0', flexShrink: 0 }}>
              {activeTasks.length > 0 ? (
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{activeTasks.length}</span> active task{activeTasks.length !== 1 ? 's' : ''}
                </p>
              ) : (
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>No active tasks</p>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handleAddTask}
                  style={{
                    flex: 1, padding: '10px 0', border: 'none', borderRadius: 10, cursor: 'pointer',
                    background: 'var(--color-primary)', color: '#fff',
                    fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add_task</span>
                  Add Task
                </button>
                <button
                  onClick={handleAddObservation}
                  style={{
                    flex: 1, padding: '10px 0', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)',
                    fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>visibility</span>
                  Observation
                </button>
              </div>
            </div>

            {/* Expand hint */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto', padding: '12px 0 8px' }}>
              <button
                onClick={() => setSnap('full')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.3)', fontSize: 11 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>expand_less</span>
                Full details
              </button>
            </div>
          </div>
        )}

        {/* Full snap */}
        {snap === 'full' && (
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '6px 20px 12px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 12, height: 12, borderRadius: 3, flexShrink: 0,
                  backgroundColor: colors?.bg, border: `2px solid ${colors?.border}`,
                }} />
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.95)', margin: 0 }}>{field.name}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                    {field.usage} · {field.sizeHectares} ha
                  </p>
                </div>
              </div>
            </div>

            {/* Tab bar — dark themed */}
            <div style={{
              flexShrink: 0,
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              gap: 0,
            }}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1, padding: '10px 4px',
                    border: 'none', background: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400,
                    color: activeTab === tab.id ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)',
                    borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                    transition: 'all 120ms ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content — light bg for readability */}
            <div style={{ flex: 1, overflowY: 'auto', background: 'var(--color-surface-50)' }} className="custom-scrollbar">
              {activeTab === 'overview' && <FieldOverviewTab field={field} />}
              {activeTab === 'tasks' && <FieldTasksTab field={field} />}
              {activeTab === 'notes' && (
                <div style={{ padding: 20 }}>
                  <ObservationThread
                    entityType="fields"
                    entityId={field.id}
                    observations={field.observations || []}
                    legacyComments={[]}
                  />
                </div>
              )}
              {activeTab === 'history' && (
                <FieldHistoryTab
                  field={field}
                  openObservationForm={openObservationForm}
                  onObservationFormOpened={() => setOpenObservationForm(false)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
