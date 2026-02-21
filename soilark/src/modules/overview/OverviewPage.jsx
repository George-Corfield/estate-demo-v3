import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import EstateMap from '../../components/shared/EstateMap'
import Calendar from '../../components/shared/Calendar'

export default function OverviewPage() {
  const [view, setView] = useState('map')
  const [addEvent, setAddEvent] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.state?.openCalendar) {
      setView('calendar')
      setAddEvent(!!location.state?.addEvent)
      navigate('.', { replace: true, state: {} })
    }
  }, [location.state, navigate])

  const handleFieldClick = (field) => {
    navigate('/fields', { state: { openFieldId: field.id } })
  }

  const toggleView = () => {
    setView(view === 'map' ? 'calendar' : 'map')
    setAddEvent(false)
  }

  return (
    <div className="relative w-full h-full">
      {view === 'map' ? (
        <EstateMap onFieldClick={handleFieldClick} />
      ) : (
        <Calendar onToggleView={toggleView} initialAddEvent={addEvent} />
      )}

      {/* View toggle - only shown on map view */}
      {view === 'map' && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={toggleView}
            className="btn btn-secondary flex items-center gap-2"
            style={{
              background: 'var(--color-parchment-50)',
              borderColor: 'var(--color-parchment-300)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>calendar_month</span>
            Calendar
          </button>
        </div>
      )}

      {/* Weather widget (map view only) */}
      {view === 'map' && (
        <div className="absolute top-4 left-4 z-20">
          <div
            className="flex items-center gap-3"
            style={{
              padding: '8px 16px',
              background: 'var(--color-parchment-50)',
              border: '1px solid var(--color-parchment-300)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-ochre-400)' }}>wb_sunny</span>
            <div>
              <p className="text-data" style={{ color: 'var(--color-ink-900)', fontWeight: 500, lineHeight: 1 }}>8°C</p>
              <p className="text-body-small" style={{ color: 'var(--color-earth-400)', lineHeight: 1, marginTop: 2 }}>Partly Cloudy · Wind 12mph</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
