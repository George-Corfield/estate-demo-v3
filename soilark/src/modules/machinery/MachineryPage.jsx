import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import MachineryListView from './MachineryListView'
import MachineryDetailView from './MachineryDetailView'
import MachineryCreateForm from './MachineryCreateForm'
import EstateMap from '../../components/shared/EstateMap'
import Calendar from '../../components/shared/Calendar'

export default function MachineryPage() {
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [rightPanel, setRightPanel] = useState(null) // null | 'map' | 'calendar'
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.state?.openEquipmentId) {
      setSelectedEquipmentId(location.state.openEquipmentId)
      setShowCreate(false)
      navigate('.', { replace: true, state: {} })
    }
  }, [location.state, navigate])

  const hasSidebar = selectedEquipmentId || showCreate
  const showList = !rightPanel || !hasSidebar

  const handleEquipmentClick = (id) => {
    setSelectedEquipmentId(id)
    setShowCreate(false)
  }

  const handleCloseSidebar = () => {
    setSelectedEquipmentId(null)
    setShowCreate(false)
  }

  const handleAddEquipment = () => {
    setShowCreate(true)
    setSelectedEquipmentId(null)
  }

  const handleSave = () => {
    setShowCreate(false)
    setSelectedEquipmentId(null)
  }

  return (
    <div className="flex h-full">
      {/* Left panel: List (hidden when map/calendar is open AND a sidebar is active) */}
      {showList && (
        <div className={`flex flex-col overflow-hidden bg-white ${
          hasSidebar || rightPanel ? 'w-1/2 border-r border-slate-200' : 'flex-1'
        }`}>
          <MachineryListView
            onEquipmentClick={handleEquipmentClick}
            onAddEquipment={handleAddEquipment}
            selectedEquipmentId={selectedEquipmentId}
            compact={hasSidebar || !!rightPanel}
          />
        </div>
      )}

      {/* Middle panel: Detail or Create form (when sidebar is active) */}
      {hasSidebar && (
        <div className={`flex flex-col overflow-hidden bg-white ${
          rightPanel ? 'w-1/2 border-r border-slate-200' : 'w-1/2 border-r border-slate-200'
        }`}>
          {selectedEquipmentId && !showCreate && (
            <MachineryDetailView
              equipmentId={selectedEquipmentId}
              onBack={handleCloseSidebar}
            />
          )}
          {showCreate && (
            <MachineryCreateForm
              onCancel={handleCloseSidebar}
              onSave={handleSave}
            />
          )}
        </div>
      )}

      {/* Right panel: Map or Calendar */}
      {rightPanel && (
        <div className="w-1/2 relative">
          {rightPanel === 'map' ? (
            <EstateMap selectedFieldIds={[]} highlightedFieldIds={[]} />
          ) : (
            <Calendar mode="view" />
          )}

          {/* Close button */}
          <button
            onClick={() => setRightPanel(null)}
            className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-white transition-colors"
          >
            <span className="material-icons text-base">close</span>
            Close
          </button>

          {/* Panel switcher */}
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={() => setRightPanel(rightPanel === 'map' ? 'calendar' : 'map')}
              className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-white transition-colors"
            >
              <span className="material-icons text-base">
                {rightPanel === 'map' ? 'calendar_month' : 'map'}
              </span>
              Switch to {rightPanel === 'map' ? 'Calendar' : 'Map'}
            </button>
          </div>
        </div>
      )}

      {/* FAB toggle — visible when no right panel is open */}
      {!rightPanel && (
        <div className="fixed bottom-6 right-6 z-30 flex gap-2">
          <button
            onClick={() => setRightPanel('map')}
            className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl shadow-xl hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            <span className="material-icons text-base">map</span>
            Estate Map
          </button>
          <button
            onClick={() => setRightPanel('calendar')}
            className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl shadow-xl hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            <span className="material-icons text-base">calendar_month</span>
            Calendar
          </button>
        </div>
      )}
    </div>
  )
}
