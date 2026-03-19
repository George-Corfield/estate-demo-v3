import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import MachineryListView from './MachineryListView'
import MachineryListCompact from './MachineryListCompact'
import MachineryDetailView from './MachineryDetailView'
import EstateMap from '../../components/shared/EstateMap'
import Calendar from '../../components/shared/Calendar'

export default function MachineryPage() {
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null)
  const [showMapPanel, setShowMapPanel] = useState(false)
  const [showInlineCreate, setShowInlineCreate] = useState(false)
  const [rightView, setRightView] = useState('map')
  const [calendarDate, setCalendarDate] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.state?.openEquipmentId) {
      setSelectedEquipmentId(location.state.openEquipmentId)
      setShowMapPanel(false)
      setShowInlineCreate(false)
      navigate('.', { replace: true, state: {} })
    }
  }, [location.state, navigate])

  const handleEquipmentClick = (id) => {
    setSelectedEquipmentId(id)
    setShowInlineCreate(false)
  }

  const handleBack = () => {
    setSelectedEquipmentId(null)
  }

  const handleToggleMapPanel = () => {
    setShowMapPanel(prev => !prev)
  }

  const toggleButton = (
    <button
      onClick={handleToggleMapPanel}
      className="btn flex items-center gap-2"
      style={{
        position: 'absolute',
        bottom: 16,
        right: showMapPanel ? undefined : 16,
        left: showMapPanel ? 16 : undefined,
        zIndex: 30,
        background: 'var(--color-primary)',
        color: '#1a1a1a',
        fontWeight: 600,
        boxShadow: '0 2px 8px rgba(19, 236, 19, 0.3)',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
        {showMapPanel ? 'fullscreen' : 'map'}
      </span>
      {showMapPanel ? 'Full View' : 'Map'}
    </button>
  )

  // Mode 2: map/calendar visible (with either list or detail in 35% panel)
  if (showMapPanel) {
    return (
      <div className="flex h-full">
        <div className="split-panel relative" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {selectedEquipmentId ? (
            <MachineryDetailView
              equipmentId={selectedEquipmentId}
              onClose={handleBack}
              onServiceDateClick={(dateStr) => {
                setCalendarDate(dateStr + '#' + Date.now())
                setRightView('calendar')
              }}
            />
          ) : (
            <MachineryListView
              compact
              onEquipmentClick={handleEquipmentClick}
              showInlineCreate={showInlineCreate}
              setShowInlineCreate={setShowInlineCreate}
            />
          )}
          {toggleButton}
        </div>
        <div className="flex-1 relative" style={{borderLeft: '1px solid var(--color-surface-300)'}}>
          {rightView === 'map' ? (
            <>
              <EstateMap
                selectedFieldIds={[]}
                highlightedFieldIds={[]}
                onFieldClick={(field) => navigate('/fields', { state: { openFieldId: field.id } })}
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
            <Calendar onToggleView={() => setRightView('map')} navigateToDate={calendarDate} />
          )}
        </div>
      </div>
    )
  }

  // Mode 4: split list + detail (no map)
  if (selectedEquipmentId) {
    return (
      <div className="flex h-full">
        <div style={{ width: '65%', minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <MachineryListView
            compact
            onEquipmentClick={handleEquipmentClick}
            showInlineCreate={showInlineCreate}
            setShowInlineCreate={setShowInlineCreate}
            selectedId={selectedEquipmentId}
            onToggleMap={handleToggleMapPanel}
          />
        </div>
        <div style={{ width: '35%', borderLeft: '1px solid var(--color-surface-300)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <MachineryDetailView
            equipmentId={selectedEquipmentId}
            onClose={handleBack}
            onServiceDateClick={(dateStr) => {
              setCalendarDate(dateStr + '#' + Date.now())
              setShowMapPanel(true)
              setRightView('calendar')
            }}
          />
        </div>
      </div>
    )
  }

  // Mode 3: full-width list (no map, no selection)
  return (
    <div className="flex-1 min-w-0 flex flex-col overflow-hidden h-full relative" style={{ background: 'var(--color-surface-50)' }}>
      <MachineryListView
        onEquipmentClick={handleEquipmentClick}
        showInlineCreate={showInlineCreate}
        setShowInlineCreate={setShowInlineCreate}
        onToggleMap={handleToggleMapPanel}
      />
    </div>
  )
}
