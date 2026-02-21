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
      navigate('.', { replace: true, state: {} })
    }
  }, [location.state, navigate])

  const handleFieldClick = (field) => {
    setSelectedFieldId(field.id)
  }

  return (
    <div className="flex h-full">
      {/* Left panel — 35% split */}
      <div
        className="split-panel"
        style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
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

      {/* Right panel — 65% map */}
      <div className="flex-1 relative">
        {rightView === 'map' ? (
          <>
            <EstateMap
              highlightedFieldId={selectedFieldId}
              onFieldClick={handleFieldClick}
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
          <Calendar onToggleView={() => setRightView('map')} />
        )}
      </div>
    </div>
  )
}
