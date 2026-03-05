import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../../constants/navigation'
import { estateStats } from '../../data/estateStats'
import EstateStatsDropdown from './EstateStatsDropdown'
import { formatOrdinalDate } from '../../utils/dates'

export default function TopBar() {
  const location = useLocation()
  const [showEstateSwitch, setShowEstateSwitch] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const estateSwitchRef = useRef(null)
  const statsRef = useRef(null)
  const [dateStr, setDateStr] = useState(formatOrdinalDate(new Date()))

  const currentItem = NAV_ITEMS.find(item => {
    if (item.path === '/') return location.pathname === '/'
    return location.pathname.startsWith(item.path)
  })
  const pageName = currentItem?.label || 'Overview'


  useEffect(() => {
    const interval = setInterval(() => {
      setDateStr(formatOrdinalDate(new Date()))
    }, 10000)
    return () => clearInterval(interval)
  }, [])

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
        background: 'linear-gradient(to right, var(--color-deep-900), var(--color-deep-800))',
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
              fontSize: 14,
              color: 'rgba(255,255,255,0.9)',
              transition: 'color var(--duration-fast) ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'white' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.9)' }}
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
                background: 'var(--color-surface-50)',
                border: '1px solid var(--color-surface-300)',
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
                    background: 'rgba(19,236,19,0.08)',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-green-500)' }}>check</span>
                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-slate-900)', margin: 0 }}>LandArk Estate</p>
                    <p className="text-label" style={{ color: 'var(--color-slate-400)', margin: 0 }}>{estateStats.totalHectares} HA</p>
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
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.9)',
              transition: 'color var(--duration-fast) ease',
              borderRadius: 'var(--radius-sm)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
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

        <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
          /
        </span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: 'white' }}>
          {pageName}
        </span>
      </div>

      {/* Right: Notifications + Avatar */}
      <div className="flex items-center gap-3">
        <div className="text-body opacity-90" style={{color: 'white'}}>{dateStr}</div>
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
            style={{ fontSize: 16, color: 'white' }}
          >
            notifications
          </span>
        </button>
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(19, 236, 19, 0.3)',
            border: '1px solid rgba(19, 236, 19, 0.5)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, color: 'white' }}>
            JS
          </span>
        </div>
      </div>
    </header>
  )
}
