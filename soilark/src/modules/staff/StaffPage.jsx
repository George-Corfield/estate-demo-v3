import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import useIsMobile from '../../hooks/useIsMobile'
import { STAFF_STATUS_COLORS, STAFF_CATEGORY_TABS } from '../../data/staff'
import StaffListView from './StaffListView'
import StaffDetailView from './StaffDetailView'
import MobileStaffDetail from './MobileStaffDetail'
import { ProfileCircle } from './StaffListView'

function MobileStaffList({ onSelect }) {
  const { staff } = useApp()
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let items = staff
    if (activeTab !== 'All') {
      if (activeTab === 'Sick') {
        items = items.filter(s => s.status === 'Sick' || s.status === 'Pending Sick Confirmation')
      } else {
        items = items.filter(s => s.status === activeTab)
      }
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        (s.team && s.team.toLowerCase().includes(q))
      )
    }
    return items
  }, [staff, activeTab, search])

  const tabs = STAFF_CATEGORY_TABS

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 0', flexShrink: 0 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-slate-900)', margin: '0 0 12px' }}>Staff</h1>
        <input
          type="text"
          placeholder="Search by name, role or team…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: 8,
            border: '1px solid var(--color-surface-300)',
            background: 'var(--color-surface-50)',
            fontSize: 14, color: 'var(--color-slate-700)',
            outline: 'none', boxSizing: 'border-box', marginBottom: 12,
          }}
        />
      </div>

      {/* Category filter chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 16px 10px', flexShrink: 0, scrollbarWidth: 'none' }}>
        {tabs.map(tab => {
          const isActive = tab === activeTab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flexShrink: 0, whiteSpace: 'nowrap',
                padding: '7px 14px', borderRadius: 99, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: isActive ? 700 : 500,
                background: isActive ? 'var(--color-primary)' : 'var(--color-surface-100)',
                color: isActive ? '#fff' : 'var(--color-slate-500)',
                boxShadow: isActive ? '0 2px 8px rgba(19,60,18,0.20)' : 'none',
                transition: 'all 150ms ease',
              }}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* Staff cards */}
      <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ padding: '4px 16px 16px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-slate-400)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 36, marginBottom: 8, display: 'block' }}>person_off</span>
            <p style={{ fontSize: 14 }}>No staff members found</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(member => {
              const badgeClass = STAFF_STATUS_COLORS[member.status] || 'badge-neutral'
              return (
                <button
                  key={member.id}
                  onClick={() => onSelect(member.id)}
                  style={{
                    width: '100%', textAlign: 'left', cursor: 'pointer',
                    padding: 14, borderRadius: 10,
                    background: 'var(--color-surface-50)',
                    border: '1px solid var(--color-surface-200)',
                    transition: 'all 120ms ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <ProfileCircle name={member.name} initials={member.initials} size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-slate-900)', margin: 0, truncate: true }}>{member.name}</p>
                        <span className={`badge ${badgeClass}`} style={{ flexShrink: 0 }}>{member.status}</span>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--color-slate-500)', margin: '2px 0 0' }}>
                        {member.role}{member.team ? ` · ${member.team}` : ''}
                      </p>
                    </div>
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

export default function StaffPage() {
  const [selectedStaffId, setSelectedStaffId] = useState(null)
  const [showInlineCreate, setShowInlineCreate] = useState(false)
  const isMobile = useIsMobile()
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

  // ── Mobile branch ────────────────────────────────────────────────────────
  if (isMobile) {
    if (selectedStaffId) {
      return (
        <MobileStaffDetail
          staffId={selectedStaffId}
          onBack={handleBack}
        />
      )
    }
    return (
      <MobileStaffList onSelect={setSelectedStaffId} />
    )
  }

  // Mode 4: 65% compressed list + 35% detail panel
  if (selectedStaffId) {
    return (
      <div className="flex h-full">
        <div style={{ width: '65%', minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--color-surface-50)' }}>
          <StaffListView
            onStaffClick={handleStaffClick}
            showInlineCreate={showInlineCreate}
            setShowInlineCreate={setShowInlineCreate}
            compressed
            selectedStaffId={selectedStaffId}
          />
        </div>
        <div style={{ width: '35%', borderLeft: '1px solid var(--color-surface-300)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
    <div className="flex-1 min-w-0 flex flex-col overflow-hidden h-full" style={{ background: 'var(--color-surface-50)' }}>
      <StaffListView
        onStaffClick={handleStaffClick}
        showInlineCreate={showInlineCreate}
        setShowInlineCreate={setShowInlineCreate}
      />
    </div>
  )
}
