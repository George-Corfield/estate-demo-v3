import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import MachineryListView from './MachineryListView'
import MachineryDetailView from './MachineryDetailView'
import EstateMap from '../../components/shared/EstateMap'
import Calendar from '../../components/shared/Calendar'

export default function MachineryPage() {
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null)
  const [showInlineCreate, setShowInlineCreate] = useState(false)
  const [rightView, setRightView] = useState('map')
  const [calendarDate, setCalendarDate] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.state?.openEquipmentId) {
      setSelectedEquipmentId(location.state.openEquipmentId)
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

  // Mode 2: detail panel + map/calendar
  if (selectedEquipmentId) {
    return (
      <div className="flex h-full">
        <div className="split-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <MachineryDetailView
            equipmentId={selectedEquipmentId}
            onClose={handleBack}
            onServiceDateClick={(dateStr) => {
              setCalendarDate(dateStr + '#' + Date.now())
              setRightView('calendar')
            }}
          />
        </div>
        <div className="flex-1 relative">
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
                  style={{ background: 'var(--color-parchment-50)' }}
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

  // Mode 3: full-width list
  return (
    <div className="flex-1 min-w-0 flex flex-col overflow-hidden h-full" style={{ background: 'var(--color-parchment-50)' }}>
      <MachineryListView
        onEquipmentClick={handleEquipmentClick}
        showInlineCreate={showInlineCreate}
        setShowInlineCreate={setShowInlineCreate}
      />
    </div>
  )
}
