import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import FieldCategoryList from './FieldCategoryList'
import FieldDetailView from './FieldDetailView'
import UsageManager from './UsageManager'
import EstateMap from '../../components/shared/EstateMap'
import Calendar from '../../components/shared/Calendar'

export default function FieldsPage() {
  const { fields, showToast } = useApp()
  const [selectedFieldId, setSelectedFieldId] = useState(null)
  const [selectedFieldTab, setSelectedFieldTab] = useState(null)
  const [showUsageManager, setShowUsageManager] = useState(false)
  const [rightView, setRightView] = useState('map')
  const [openCategory, setOpenCategory] = useState(null)
  const [expandedUsage, setExpandedUsage] = useState('Wheat')
  const [pendingObservation, setPendingObservation] = useState(false)
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
    if (location.state?.addNote) {
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
