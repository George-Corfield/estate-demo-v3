import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { STAFF_CATEGORY_TABS, STAFF_STATUS_COLORS } from '../../data/staff'
import TabBar from '../../components/shared/TabBar'
import StaffCreateForm from './StaffCreateForm'

const CATEGORY_TABS = STAFF_CATEGORY_TABS.map(t => ({ id: t, label: t }))

function exportCSV(staff) {
  const headers = ['Name', 'Role', 'Team', 'Email', 'Mobile', 'Status', 'Contract Type', 'Hours/Week', 'Hourly Rate', 'Permission Level']
  const rows = staff.map(s => [s.name, s.role, s.team || '', s.email, s.mobile, s.status, s.contractType, s.hoursPerWeek, s.hourlyRate, s.permissionLevel])
  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'staff-directory.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function ProfileCircle({ name, initials, size = 36 }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'var(--color-green-600)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: '#fff',
      fontFamily: 'var(--font-heading)',
      fontSize: size * 0.36,
      fontWeight: 700,
      letterSpacing: '0.02em',
    }}>
      {initials || (name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : (
        <span className="material-symbols-outlined" style={{ fontSize: size * 0.55, color: '#fff' }}>person</span>
      ))}
    </div>
  )
}

export { ProfileCircle }

export default function StaffListView({ onStaffClick, showInlineCreate, setShowInlineCreate, compressed, selectedStaffId }) {
  const { staff } = useApp()
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')

  // const activeStaff = useMemo(() => staff.filter(s => s.status !== 'Archived'), [staff])
  const activeStaff = staff

  const filtered = useMemo(() => {
    let items = activeStaff

    if (activeTab !== 'All') {
      items = items.filter(s => s.status === activeTab)
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
  }, [activeStaff, activeTab, search])

  const totalStaff = activeStaff.length
  const onSite = activeStaff.filter(s => s.status === 'On Site').length
  const offSite = activeStaff.filter(s => s.status === 'Off Site').length

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div style={{ padding: 'var(--content-padding)' }} className="flex flex-col gap-5 flex-1 overflow-y-auto custom-scrollbar">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-heading-2" style={{ color: 'var(--color-slate-900)', margin: 0 }}>Staff</h1>
          <button onClick={() => setShowInlineCreate(true)} className="btn btn-primary">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
            Add Staff Member
          </button>
        </div>

        {/* Stat Strip */}
        {(
          <div className="grid grid-cols-3 gap-4">
            <div className="stat-card">
              <p className="text-label" style={{ color: 'var(--color-slate-400)', marginBottom: 4 }}>Total Staff</p>
              <p className="text-data-large" style={{ color: 'var(--color-green-600)' }}>{totalStaff}</p>
            </div>
            <div className="stat-card">
              <p className="text-label" style={{ color: 'var(--color-slate-400)', marginBottom: 4 }}>On Site</p>
              <p className="text-data-large" style={{ color: 'var(--color-green-600)' }}>{onSite}</p>
            </div>
            <div className="stat-card">
              <p className="text-label" style={{ color: 'var(--color-slate-400)', marginBottom: 4 }}>Off Site</p>
              <p className="text-data-large" style={{ color: 'var(--color-green-600)' }}>{offSite}</p>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <TabBar tabs={CATEGORY_TABS} activeTab={activeTab} onChange={setActiveTab} />

        {/* Filter & Search Row */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by name, role or team…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-input"
            style={{ maxWidth: 280 }}
          />
          <div className="flex-1" />
          {(
            <button onClick={() => exportCSV(staff)} className="btn btn-ghost">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
              Export staff
            </button>
          )}
        </div>

        {/* Inline Create Form */}
        {showInlineCreate && (
          <StaffCreateForm
            onCancel={() => setShowInlineCreate(false)}
            onSave={() => setShowInlineCreate(false)}
          />
        )}

        {/* Staff Card List */}
        <div className="flex flex-col gap-2">
          {filtered.map(member => {
            const badgeClass = STAFF_STATUS_COLORS[member.status] || 'badge-neutral';
            const isSelected = member.id === selectedStaffId;

            return (
              <div
                key={member.id}
                onClick={() => onStaffClick(member.id)}
                className="group flex items-center p-4"
                style={{
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast) ease',
                  background: isSelected ? 'var(--color-surface-200)' : 'white',
                  borderBottom: `1px solid var(--color-slate-100)`,
                  borderRadius: 'var(--radius-md)' // Optional: keep if you want them to look like cards
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--color-surface-50)' }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isSelected ? 'var(--color-surface-200)' : 'white' }}
              >
                {/* 1. Profile & Name (The "Who") - 30% Width */}
                <div className="flex items-center gap-4 w-[30%] min-w-[200px]">
                  <ProfileCircle name={member.name} initials={member.initials} />
                  <div className="truncate">
                    <p className="text-heading-3" style={{ color: 'var(--color-slate-900)', margin: 0 }}>{member.name}</p>
                    {/* Permission moved here if compressed, or kept as a small tag */}
                    {(
                      <span className="text-[10px] font-mono text-slate-400 uppercase">{member.permissionLevel}</span>
                    )}
                  </div>
                </div>

                {/* 2. Role & Team (The "Position") - Centered Expansion */}
                <div className="flex-1 px-4 border-l border-slate-100">
                  <p className="text-label" style={{ color: 'var(--color-slate-400)', fontSize: 10, marginBottom: 2 }}>ROLE & TEAM</p>
                  <p className="text-body truncate" style={{ color: 'var(--color-slate-600)', margin: 0 }}>
                    {member.role}{member.team ? ` · ${member.team}` : ''}
                  </p>
                </div>

                {/* 3. Permissions (The "Access") - Only if not compressed */}
                {(
                  <div className="w-[15%] px-4 flex flex-col">
                    <span className="text-label" style={{ color: 'var(--color-slate-400)', fontSize: 10, marginBottom: 2 }}>ACCESS</span>
                    <span className="text-body truncate" style={{color: 'var(--color-slate-600)' }}>
                      {member.permissionLevel}
                    </span>
                  </div>
                )}

                {/* 4. Status (The "Availability") - Right Aligned */}
                <div className="w-[120px] flex justify-end shrink-0">
                  <span className={`badge ${badgeClass} justify-center`}>
                    {member.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-slate-400)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 36, marginBottom: 8, display: 'block' }}>person_off</span>
            <p className="text-body">No staff members found</p>
          </div>
        )}

        {filtered.length > 0 && (
          <p className="text-body-small" style={{ color: 'var(--color-slate-400)' }}>
            Showing {filtered.length} of {activeStaff.length} staff members
          </p>
        )}
      </div>
    </div>
  )
}
