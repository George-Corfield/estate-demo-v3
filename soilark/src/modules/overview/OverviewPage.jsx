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

      {/* View toggle - only shown on map view; calendar has its own toggle in the header */}
      {view === 'map' && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={toggleView}
            className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-white transition-colors"
          >
            <span className="material-icons text-base">calendar_month</span>
            Switch to Calendar
          </button>
        </div>
      )}

      {/* Weather widget (map view only) */}
      {view === 'map' && (
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-3 shadow-lg">
            <span className="material-icons text-amber-500">wb_sunny</span>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-none">8°C</p>
              <p className="text-[10px] text-slate-500 leading-none mt-1">Partly Cloudy · Wind 12mph</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
