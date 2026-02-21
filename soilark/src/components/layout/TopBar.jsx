import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../../constants/navigation'
import { estateStats } from '../../data/estateStats'
import EstateStatsDropdown from './EstateStatsDropdown'

export default function TopBar() {
  const location = useLocation()
  const [showEstateSwitch, setShowEstateSwitch] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const estateSwitchRef = useRef(null)
  const statsRef = useRef(null)

  const currentItem = NAV_ITEMS.find(item => {
    if (item.path === '/') return location.pathname === '/'
    return location.pathname.startsWith(item.path)
  })
  const pageName = currentItem?.label || 'Overview'

  // Close on click outside
  useEffect(() => {
    if (!showEstateSwitch && !showStats) return
    const handleClick = (e) => {
      if (showEstateSwitch && estateSwitchRef.current && !estateSwitchRef.current.contains(e.target)) {
        setShowEstateSwitch(false)
      }
      if (showStats && statsRef.current && !statsRef.current.contains(e.target)) {
        setShowStats(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showEstateSwitch, showStats])

  const toggleEstate = () => {
    setShowEstateSwitch(!showEstateSwitch)
    setShowStats(false)
  }

  const toggleStats = () => {
    setShowStats(!showStats)
    setShowEstateSwitch(false)
  }

  return (
    <header
      className="flex items-center justify-between shrink-0"
      style={{
        height: 'var(--topbar-height)',
        background: 'var(--color-parchment-50)',
        borderBottom: '1px solid var(--color-parchment-300)',
        padding: '0 24px',
      }}
    >
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-1.5">
        {/* Estate name — switcher dropdown */}
        <div className="relative" ref={estateSwitchRef}>
          <button
            onClick={toggleEstate}
            className="flex items-center gap-1"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 0',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--color-earth-400)',
              transition: 'color var(--duration-fast) ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-ink-900)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-earth-400)' }}
          >
            LandArk Estate
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              {showEstateSwitch ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {showEstateSwitch && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 4,
                width: 220,
                background: 'var(--color-parchment-50)',
                border: '1px solid var(--color-parchment-300)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                zIndex: 50,
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '8px 4px' }}>
                <div
                  className="flex items-center gap-3"
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(78,140,53,0.08)',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-sage-500)' }}>check</span>
                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-ink-900)', margin: 0 }}>LandArk Estate</p>
                    <p className="text-label" style={{ color: 'var(--color-earth-400)', margin: 0 }}>{estateStats.totalHectares} HA</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Total hectares — stats dropdown */}
        <div className="relative" ref={statsRef}>
          <button
            onClick={toggleStats}
            className="flex items-center gap-1"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 6px',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--color-sage-600)',
              transition: 'color var(--duration-fast) ease',
              borderRadius: 'var(--radius-sm)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-parchment-100)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
          >
            {estateStats.totalHectares} ha
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              {showStats ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {showStats && (
            <EstateStatsDropdown onClose={() => setShowStats(false)} />
          )}
        </div>

        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-parchment-300)' }}>
          /
        </span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-ink-900)' }}>
          {pageName}
        </span>
      </div>

      {/* Right: Notifications + Avatar */}
      <div className="flex items-center gap-3">
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 20, color: 'var(--color-earth-400)' }}
          >
            notifications
          </span>
        </button>
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'var(--color-sage-600)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, color: 'white' }}>
            JS
          </span>
        </div>
      </div>
    </header>
  )
}
