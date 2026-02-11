import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import FieldCategoryList from './FieldCategoryList'
import FieldDetailView from './FieldDetailView'
import EstateMap from '../../components/shared/EstateMap'
import Calendar from '../../components/shared/Calendar'

export default function FieldsPage() {
  const { fields } = useApp()
  const [selectedFieldId, setSelectedFieldId] = useState(null)
  const [rightView, setRightView] = useState('map')
  const [openCategory, setOpenCategory] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.state?.openFieldId) {
      setSelectedFieldId(location.state.openFieldId)
      navigate('.', { replace: true, state: {} })
    }
    if (location.state?.openCategory) {
      setOpenCategory(location.state.openCategory)
      navigate('.', { replace: true, state: {} })
    }
    if (location.state?.addNote) {
      // If no field selected, just show the list; user picks a field first
      navigate('.', { replace: true, state: {} })
    }
  }, [location.state, navigate])

  const handleFieldClick = (field) => {
    setSelectedFieldId(field.id)
  }

  return (
    <div className="flex h-full">
      {/* Left panel */}
      <div className="w-[420px] min-w-[380px] max-w-[520px] border-r border-slate-200 bg-white flex flex-col overflow-hidden shrink-0">
        {selectedFieldId ? (
          <FieldDetailView
            fieldId={selectedFieldId}
            onBack={() => setSelectedFieldId(null)}
          />
        ) : (
          <FieldCategoryList
            onFieldSelect={(id) => setSelectedFieldId(id)}
            initialOpenCategory={openCategory}
          />
        )}
      </div>

      {/* Right panel */}
      <div className="flex-1 relative">
        {rightView === 'map' ? (
          <EstateMap
            highlightedFieldId={selectedFieldId}
            onFieldClick={handleFieldClick}
          />
        ) : (
          <Calendar />
        )}

        {/* View toggle */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setRightView(rightView === 'map' ? 'calendar' : 'map')}
            className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-white transition-colors"
          >
            <span className="material-icons text-base">
              {rightView === 'map' ? 'calendar_month' : 'map'}
            </span>
            Switch to {rightView === 'map' ? 'Calendar' : 'Map'}
          </button>
        </div>
      </div>
    </div>
  )
}
