import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import useIsMobile from '../../hooks/useIsMobile'
import FieldCategoryList from './FieldCategoryList'
import FieldDetailView from './FieldDetailView'
import MobileFieldOverlay from './MobileFieldOverlay'
import UsageManager from './UsageManager'
import EstateMap from '../../components/shared/EstateMap'
import Calendar from '../../components/shared/Calendar'
import { isOverdue } from '../../utils/dates'

function MobileFieldList({ fields, usages, tasks, onFieldSelect }) {
  const [activeUsage, setActiveUsage] = useState('All Fields')

  const usageColorMap = useMemo(() => {
    const map = {}
    usages.forEach(u => { map[u.name] = { bg: u.bg, border: u.border } })
    return map
  }, [usages])

  const overdueFieldIds = useMemo(() => {
    const ids = new Set()
    tasks.forEach(t => {
      if (t.status !== 'done' && t.status !== 'cancelled' && t.dueDate && isOverdue(t.dueDate)) {
        t.fieldIds?.forEach(fid => ids.add(fid))
      }
    })
    return ids
  }, [tasks])

  const activeTaskCounts = useMemo(() => {
    const counts = {}
    tasks.forEach(t => {
      if (t.status !== 'done' && t.status !== 'cancelled') {
        t.fieldIds?.forEach(fid => { counts[fid] = (counts[fid] || 0) + 1 })
      }
    })
    return counts
  }, [tasks])

  const usageNames = useMemo(() => ['All Fields', ...usages.map(u => u.name)], [usages])

  const filteredFields = useMemo(() => {
    if (activeUsage === 'All Fields') return fields
    return fields.filter(f => f.usage === activeUsage)
  }, [fields, activeUsage])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Usage filter chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '12px 16px 8px', flexShrink: 0, scrollbarWidth: 'none' }}>
        {usageNames.map(name => {
          const isActive = name === activeUsage
          const colors = usageColorMap[name]
          return (
            <button
              key={name}
              onClick={() => setActiveUsage(name)}
              style={{
                flexShrink: 0, whiteSpace: 'nowrap',
                padding: '8px 14px', borderRadius: 99, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: isActive ? 700 : 500,
                background: isActive ? (colors?.border || 'var(--color-primary)') : 'var(--color-surface-100)',
                color: isActive ? '#fff' : 'var(--color-slate-500)',
                boxShadow: isActive ? '0 2px 8px rgba(19,60,18,0.20)' : 'none',
                transition: 'all 150ms ease',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {name !== 'All Fields' && colors && (
                <span style={{
                  width: 8, height: 8, borderRadius: 2, flexShrink: 0,
                  backgroundColor: isActive ? 'rgba(255,255,255,0.8)' : colors.bg,
                  border: `1.5px solid ${isActive ? 'rgba(255,255,255,0.5)' : colors.border}`,
                }} />
              )}
              {name}
            </button>
          )
        })}
      </div>

      {/* Field cards */}
      <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ padding: '8px 16px 16px' }}>
        {filteredFields.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-slate-400)', padding: '32px 0', fontSize: 14 }}>No fields</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredFields.map(field => {
              const colors = usageColorMap[field.usage]
              const fieldOverdue = overdueFieldIds.has(field.id)
              const taskCount = activeTaskCounts[field.id] || 0
              return (
                <button
                  key={field.id}
                  onClick={() => onFieldSelect(field.id)}
                  style={{
                    width: '100%', textAlign: 'left', cursor: 'pointer',
                    padding: 14, borderRadius: 10,
                    background: fieldOverdue ? 'var(--color-red-50, #fef2f2)' : 'var(--color-surface-50)',
                    border: `1px solid ${fieldOverdue ? 'var(--color-red-200, #fecaca)' : 'var(--color-surface-200)'}`,
                    borderLeft: `4px solid ${fieldOverdue ? 'var(--color-red-400)' : (colors?.border || 'var(--color-surface-300)')}`,
                    transition: 'all 120ms ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-slate-900)', margin: 0 }}>{field.name}</h4>
                      {fieldOverdue && (
                        <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--color-red-400)' }}>warning</span>
                      )}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-slate-500)' }}>{field.sizeHectares} ha</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '2px 8px', borderRadius: 99,
                      background: colors?.bg || 'var(--color-surface-100)',
                      border: `1px solid ${colors?.border || 'var(--color-surface-300)'}`,
                      fontSize: 11, fontWeight: 600, color: 'var(--color-slate-700)',
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: colors?.border }} />
                      {field.usage}
                    </span>
                    {field.soilType && (
                      <span style={{ fontSize: 12, color: 'var(--color-slate-400)' }}>{field.soilType}</span>
                    )}
                    {field.scheme && field.scheme !== 'None' && (
                      <span style={{ fontSize: 12, color: 'var(--color-slate-400)' }}>{field.scheme}</span>
                    )}
                    {taskCount > 0 && (
                      <span style={{
                        marginLeft: 'auto', fontSize: 11, fontWeight: 600,
                        color: fieldOverdue ? 'var(--color-red-500)' : 'var(--color-green-600)',
                        display: 'flex', alignItems: 'center', gap: 3,
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>task</span>
                        {taskCount}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function FieldsPage() {
  const { fields, usages, tasks, showToast } = useApp()
  const [selectedFieldId, setSelectedFieldId] = useState(null)
  const [selectedFieldTab, setSelectedFieldTab] = useState(null)
  const [showUsageManager, setShowUsageManager] = useState(false)
  const [rightView, setRightView] = useState('map')
  const [openCategory, setOpenCategory] = useState(null)
  const [expandedUsage, setExpandedUsage] = useState('Wheat')
  const [pendingObservation, setPendingObservation] = useState(false)
  const isMobile = useIsMobile()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.state?.openFieldId) {
      setSelectedFieldId(location.state.openFieldId)
      setSelectedFieldTab(location.state.openTab || null)
      navigate('.', { replace: true, state: {} })
    }
    if (location.state?.openCategory) {
      setOpenCategory(location.state.openCategory)
      navigate('.', { replace: true, state: {} })
    }
    if (location.state?.selectFieldForObservation) {
      if (selectedFieldId) {
        setSelectedFieldTab('history')
        setPendingObservation(true)
      } else {
        setPendingObservation(true)
      }
      navigate('.', { replace: true, state: {} })
    }
  }, [location.state, navigate, selectedFieldId])

  useEffect(() => {
    const handleFabAddTask = () => {
      if (selectedFieldId) {
        const field = fields.find(f => f.id === selectedFieldId)
        navigate('/tasks', { state: { createTask: true, prefillFieldIds: [selectedFieldId] } })
        if (field) showToast(`Task linked to ${field.name}`)
      } else {
        navigate('/tasks', { state: { createTask: true } })
      }
    }
    window.addEventListener('fab-add-task', handleFabAddTask)
    return () => window.removeEventListener('fab-add-task', handleFabAddTask)
  }, [selectedFieldId, fields, navigate, showToast])

  useEffect(() => {
    const handleFabAddObservation = () => {
      if (selectedFieldId) {
        setSelectedFieldTab('history')
        setPendingObservation(true)
      } else {
        setPendingObservation(true)
      }
    }
    window.addEventListener('fab-add-observation', handleFabAddObservation)
    return () => window.removeEventListener('fab-add-observation', handleFabAddObservation)
  }, [selectedFieldId])

  const usageHighlightedIds = useMemo(() => {
    if (!expandedUsage || selectedFieldId || showUsageManager) return []
    return fields.filter(f => f.usage === expandedUsage).map(f => f.id)
  }, [fields, expandedUsage, selectedFieldId, showUsageManager])

  const handleFieldClick = (field) => {
    setSelectedFieldId(field.id)
    setShowUsageManager(false)
    if (pendingObservation) {
      setSelectedFieldTab('history')
    }
  }

  const handleFieldSelect = (id) => {
    setSelectedFieldId(id)
    if (pendingObservation) {
      setSelectedFieldTab('history')
    }
  }

  // ── Mobile branch ─────────────────────────────────────────────────────────
  if (isMobile) {
    if (selectedFieldId) {
      return (
        <MobileFieldOverlay
          fieldId={selectedFieldId}
          initialTab={selectedFieldTab || 'overview'}
          onBack={() => { setSelectedFieldId(null); setSelectedFieldTab(null); setPendingObservation(false) }}
        />
      )
    }
    return (
      <MobileFieldList
        fields={fields}
        usages={usages}
        tasks={tasks}
        onFieldSelect={handleFieldSelect}
      />
    )
  }

  // ── Desktop branch ────────────────────────────────────────────────────────
  let leftPanel
  if (showUsageManager) {
    leftPanel = (
      <UsageManager onBack={() => setShowUsageManager(false)} />
    )
  } else if (selectedFieldId) {
    leftPanel = (
      <FieldDetailView
        fieldId={selectedFieldId}
        initialTab={selectedFieldTab}
        onBack={() => { setSelectedFieldId(null); setSelectedFieldTab(null); setPendingObservation(false) }}
        openObservationForm={pendingObservation}
        onObservationFormOpened={() => setPendingObservation(false)}
      />
    )
  } else {
    leftPanel = (
      <FieldCategoryList
        onFieldSelect={handleFieldSelect}
        initialOpenCategory={openCategory}
        onManageUsages={() => { setShowUsageManager(true); setSelectedFieldId(null) }}
        onCategoryChange={setExpandedUsage}
        selectFieldForObservation={pendingObservation}
        onCancelObservation={() => setPendingObservation(false)}
      />
    )
  }

  return (
    <div className="flex h-full">
      {/* Left panel — 35% split */}
      <div
        className="split-panel"
        style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        {leftPanel}
      </div>

      {/* Right panel — 65% map */}
      <div className="flex-1 relative">
        {rightView === 'map' ? (
          <>
            <EstateMap
              highlightedFieldId={selectedFieldId}
              highlightedFieldIds={usageHighlightedIds}
              onFieldClick={handleFieldClick}
            />
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => setRightView('calendar')}
                className="btn btn-secondary flex items-center gap-2"
                style={{ background: 'var(--color-surface-50)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>calendar_month</span>
                Calendar
              </button>
            </div>
          </>
        ) : (
          <Calendar onToggleView={() => setRightView('map')} />
        )}
      </div>
    </div>
  )
}
