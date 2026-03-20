import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { NAV_ITEMS } from '../../constants/navigation'
import { useApp } from '../../context/AppContext'

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const settingsPanelRef = useRef(null)
  const settingsBtnRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, aiEnabled, toggleAI } = useApp()

  useEffect(() => {
    if (!showSettings) return
    const handleClick = (e) => {
      if (
        settingsPanelRef.current && !settingsPanelRef.current.contains(e.target) &&
        settingsBtnRef.current && !settingsBtnRef.current.contains(e.target)
      ) {
        setShowSettings(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showSettings])

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const enabledItems = NAV_ITEMS.filter(i => i.enabled && i.allowedRoles.includes(currentUser.role))
  const disabledItems = NAV_ITEMS.filter(i => !i.enabled)

  return (
    <aside
      className="flex flex-col shrink-0 overflow-hidden z-50"
      style={{
        width: expanded ? 232 : 56,
        background: 'var(--color-deep-950)',
        borderRight: '1px solid var(--color-deep-900)',
        transition: 'width 300ms ease-in-out',
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 h-12 px-4 mt-2 mb-4">
        <span
          className="material-symbols-outlined shrink-0"
          style={{ fontSize: 24, color: 'var(--color-green-500)' }}
        >
          eco
        </span>
        <span
          className="whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: '-0.02em',
            color: 'white',
            opacity: expanded ? 1 : 0,
            transition: 'opacity 200ms ease',
          }}
        >
          LandArk
        </span>
      </div>

      {/* Section label */}
      <div
        className="px-4 mb-1"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 8,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.2)',
          opacity: expanded ? 1 : 0,
          transition: 'opacity 200ms ease',
        }}
      >
        Navigation
      </div>

      {/* Main nav */}
      <nav className="flex flex-col gap-0.5 w-full" style={{ padding: '0 10px' }}>
        {enabledItems.map((item) => {
          const active = isActive(item.path)
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3 w-full text-left"
              style={{
                padding: '8px 10px',
                borderRadius: 'var(--radius-lg)',
                background: active ? 'rgba(19, 236, 19, 0.2)' : 'transparent',
                transition: 'all 150ms ease',
                cursor: 'pointer',
                border: 'none',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <span
                className="material-symbols-outlined shrink-0"
                style={{
                  fontSize: 20,
                  color: active ? 'var(--color-green-500)' : 'rgba(255,255,255,0.6)',
                }}
              >
                {item.icon}
              </span>
              <span
                className="whitespace-nowrap"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  fontWeight: 500,
                  color: active ? 'var(--color-green-500)' : 'rgba(255,255,255,0.6)',
                  opacity: expanded ? 1 : 0,
                  transition: 'opacity 200ms ease',
                }}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 my-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }} />

      {/* Disabled nav */}
      <nav className="flex flex-col gap-0.5 w-full" style={{ padding: '0 10px' }}>
        {disabledItems.map((item) => (
          <div
            key={item.path}
            className="flex items-center gap-3 cursor-not-allowed"
            style={{ padding: '8px 10px' }}
          >
            <span
              className="material-symbols-outlined shrink-0"
              style={{ fontSize: 20, color: 'rgba(255,255,255,0.2)' }}
            >
              {item.icon}
            </span>
            <span
              className="whitespace-nowrap"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.2)',
                opacity: expanded ? 1 : 0,
                transition: 'opacity 200ms ease',
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </nav>

      {/* Footer: Settings */}
      <div className="mt-auto w-full pb-4" style={{ padding: '0 10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button
          ref={settingsBtnRef}
          onClick={() => setShowSettings(v => !v)}
          className="flex items-center gap-3 w-full text-left mt-2"
          style={{
            padding: '8px 10px',
            borderRadius: 'var(--radius-lg)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <span
            className="material-symbols-outlined shrink-0"
            style={{ fontSize: 20, color: 'rgba(255,255,255,0.6)' }}
          >
            settings
          </span>
          <span
            className="whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.6)',
              opacity: expanded ? 1 : 0,
              transition: 'opacity 200ms ease',
            }}
          >
            Settings
          </span>
        </button>
      </div>

      {/* Settings popover — fixed panel to the right of the sidebar */}
      {showSettings && (
        <div
          ref={settingsPanelRef}
          style={{
            position: 'fixed',
            left: 64,
            bottom: 48,
            width: 280,
            background: 'var(--color-surface-50)',
            border: '1px solid var(--color-surface-300)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '8px 0' }}>
            <p style={{ padding: '8px 16px 4px', fontSize: 11, fontWeight: 600, color: 'var(--color-slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Features
            </p>
            <button
              onClick={toggleAI}
              className="flex items-center gap-3 w-full"
              style={{ padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-100)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-primary)' }}>auto_awesome</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-slate-900)', margin: 0 }}>AI Task Creation</p>
                <p style={{ fontSize: 11, color: 'var(--color-slate-400)', margin: '2px 0 0' }}>Natural language task input</p>
              </div>
              <div
                style={{
                  width: 36,
                  height: 20,
                  borderRadius: 10,
                  background: aiEnabled ? 'var(--color-primary)' : 'var(--color-surface-300)',
                  position: 'relative',
                  transition: 'background 150ms ease',
                  flexShrink: 0,
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 2,
                  left: aiEnabled ? 18 : 2,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: 'white',
                  transition: 'left 150ms ease',
                }} />
              </div>
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
