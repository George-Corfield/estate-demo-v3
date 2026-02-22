import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import StaffListView from './StaffListView'
import StaffDetailView from './StaffDetailView'

export default function StaffPage() {
  const [selectedStaffId, setSelectedStaffId] = useState(null)
  const [showInlineCreate, setShowInlineCreate] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.state?.openStaffId) {
      setSelectedStaffId(location.state.openStaffId)
      setShowInlineCreate(false)
      navigate('.', { replace: true, state: {} })
    }
  }, [location.state, navigate])

  const handleStaffClick = (id) => {
    setSelectedStaffId(id)
    setShowInlineCreate(false)
  }

  const handleBack = () => {
    setSelectedStaffId(null)
  }

  // Mode 4: 65% compressed list + 35% detail panel
  if (selectedStaffId) {
    return (
      <div className="flex h-full">
        <div style={{ width: '65%', minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--color-parchment-50)' }}>
          <StaffListView
            onStaffClick={handleStaffClick}
            showInlineCreate={showInlineCreate}
            setShowInlineCreate={setShowInlineCreate}
            compressed
            selectedStaffId={selectedStaffId}
          />
        </div>
        <div style={{ width: '35%', borderLeft: '1px solid var(--color-parchment-300)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <StaffDetailView
            staffId={selectedStaffId}
            onClose={handleBack}
          />
        </div>
      </div>
    )
  }

  // Mode 3: full-width list
  return (
    <div className="flex-1 min-w-0 flex flex-col overflow-hidden h-full" style={{ background: 'var(--color-parchment-50)' }}>
      <StaffListView
        onStaffClick={handleStaffClick}
        showInlineCreate={showInlineCreate}
        setShowInlineCreate={setShowInlineCreate}
      />
    </div>
  )
}
