import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import useIsMobile from '../../hooks/useIsMobile'
import MachineryListView from './MachineryListView'
import MachineryListCompact from './MachineryListCompact'
import MachineryDetailView from './MachineryDetailView'
import MobileMachineryOverlay from './MobileMachineryOverlay'
import EstateMap from '../../components/shared/EstateMap'
import Calendar from '../../components/shared/Calendar'
import { EQUIPMENT_CATEGORY_TABS, MACHINERY_STATUS_COLORS } from '../../data/machinery'

const TAB_TYPE_MAP = {
  Tractors: 'Tractor',
  Mowers: 'Mower',
  'Seeders/Drills': 'Seeder',
  Vehicles: 'Vehicle',
  Combines: 'Combine Harvester',
  Spreaders: 'Fertilizer Spreader',
}
const KNOWN_TYPES = new Set(Object.values(TAB_TYPE_MAP))

const TYPE_ICON_MAP = {
  Tractor: 'agriculture',
  'Combine Harvester': 'precision_manufacturing',
  'Fertilizer Spreader': 'scatter_plot',
  'Forage Harvester': 'grass',
  Seeder: 'yard',
  Mower: 'content_cut',
  Vehicle: 'directions_car',
  Other: 'build',
}

const STATUS_BORDER = {
  Active:      'var(--color-primary)',
  Available:   'var(--color-slate-300)',
  Unavailable: '#f59e0b',
  Sold:        'var(--color-slate-200)',
}

const SERVICE_DUE_THRESHOLD = 50

function MobileMachineryList({ machinery, onSelect }) {
  const [activeTab, setActiveTab] = useState('All')

  const filtered = useMemo(() => {
    if (activeTab === 'All') return machinery
    const mappedType = TAB_TYPE_MAP[activeTab]
    if (activeTab === 'Other') return machinery.filter(m => !KNOWN_TYPES.has(m.type))
    if (mappedType) return machinery.filter(m => m.type === mappedType)
    return machinery
  }, [machinery, activeTab])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Category filter chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '12px 16px 8px', flexShrink: 0, scrollbarWidth: 'none' }}>
        {EQUIPMENT_CATEGORY_TABS.map(tab => {
          const isActive = tab === activeTab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flexShrink: 0, whiteSpace: 'nowrap',
                padding: '8px 14px', borderRadius: 99, border: 'none', cursor: 'pointer',
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

      {/* Equipment cards */}
      <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ padding: '8px 16px 16px' }}>
        {filtered.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-slate-400)', padding: '32px 0', fontSize: 14 }}>No equipment</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(m => {
              const schedule = m.serviceSchedule || { type: 'hours', interval: 250 }
              const serviceOverdue = schedule.type === 'hours'
                ? m.hours >= m.nextServiceDue
                : new Date() >= new Date(m.nextServiceDue)
              const serviceSoon = !serviceOverdue && schedule.type === 'hours' && m.hours >= m.nextServiceDue - SERVICE_DUE_THRESHOLD
              const typeIcon = TYPE_ICON_MAP[m.type] || 'build'
              const borderColor = serviceOverdue ? '#f59e0b' : STATUS_BORDER[m.status] || 'var(--color-surface-300)'

              return (
                <button
                  key={m.id}
                  onClick={() => onSelect(m.id)}
                  style={{
                    width: '100%', textAlign: 'left', cursor: 'pointer',
                    padding: 14, borderRadius: 10,
                    background: serviceOverdue ? 'rgba(245,158,11,0.04)' : 'var(--color-surface-50)',
                    border: `1px solid ${serviceOverdue ? 'rgba(245,158,11,0.2)' : 'var(--color-surface-200)'}`,
                    borderLeft: `4px solid ${borderColor}`,
                    transition: 'all 120ms ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-slate-400)', flexShrink: 0 }}>{typeIcon}</span>
                      <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-slate-900)', margin: 0 }}>{m.name}</h4>
                      {serviceOverdue && (
                        <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#f59e0b' }}>warning</span>
                      )}
                    </div>
                    <span className={`badge ${MACHINERY_STATUS_COLORS[m.status] || 'badge-neutral'}`} style={{ flexShrink: 0 }}>
                      {m.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', paddingLeft: 24 }}>
                    <span style={{ fontSize: 12, color: 'var(--color-slate-500)' }}>{m.make} {m.model} · {m.year}</span>
                    <span style={{ fontSize: 12, color: 'var(--color-slate-400)' }}>{m.hours.toLocaleString()} hrs</span>
                    {(serviceOverdue || serviceSoon) && (
                      <span style={{
                        marginLeft: 'auto', fontSize: 11, fontWeight: 600,
                        color: serviceOverdue ? '#f59e0b' : 'var(--color-slate-400)',
                        display: 'flex', alignItems: 'center', gap: 3,
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>build</span>
                        {serviceOverdue ? 'Service due' : 'Service soon'}
                      </span>
                    )}
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

export default function MachineryPage() {
  const { machinery } = useApp()
  const isMobile = useIsMobile()
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

  // ── Mobile branch ────────────────────────────────────────────────────────
  if (isMobile) {
    if (selectedEquipmentId) {
      return (
        <MobileMachineryOverlay
          equipmentId={selectedEquipmentId}
          onBack={() => setSelectedEquipmentId(null)}
        />
      )
    }
    return (
      <MobileMachineryList
        machinery={machinery}
        onSelect={setSelectedEquipmentId}
      />
    )
  }

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
