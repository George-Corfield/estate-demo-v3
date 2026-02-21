import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { NAV_ITEMS } from '../../constants/navigation'

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const enabledItems = NAV_ITEMS.filter(i => i.enabled)
  const disabledItems = NAV_ITEMS.filter(i => !i.enabled)

  return (
    <aside
      className="flex flex-col shrink-0 overflow-hidden z-50"
      style={{
        width: expanded ? 232 : 56,
        background: 'var(--color-ink-800)',
        transition: 'width 200ms ease',
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 h-12 px-4 mt-2 mb-4">
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: 24,
            height: 24,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-sage-500)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14, color: 'white', lineHeight: 1 }}>
            L
          </span>
        </div>
        <span
          className="whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 16,
            color: 'var(--color-parchment-100)',
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
          fontFamily: 'var(--font-mono)',
          fontSize: 8,
          fontWeight: 500,
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
      <nav className="flex flex-col gap-0.5 w-full px-2">
        {enabledItems.map((item) => {
          const active = isActive(item.path)
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3 w-full text-left"
              style={{
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                borderLeft: active ? '2px solid var(--color-sage-500)' : '2px solid transparent',
                background: active ? 'rgba(78,140,53,0.15)' : 'transparent',
                transition: 'all 120ms ease',
                cursor: 'pointer',
                border: 'none',
                borderLeftWidth: 2,
                borderLeftStyle: 'solid',
                borderLeftColor: active ? 'var(--color-sage-500)' : 'transparent',
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
                  color: active ? 'var(--color-sage-300)' : 'rgba(255,255,255,0.4)',
                }}
              >
                {item.icon}
              </span>
              <span
                className="whitespace-nowrap"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: active ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)',
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
      <div className="mx-3 my-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

      {/* Disabled nav */}
      <nav className="flex flex-col gap-0.5 w-full px-2">
        {disabledItems.map((item) => (
          <div
            key={item.path}
            className="flex items-center gap-3 cursor-not-allowed"
            style={{ padding: '8px 10px' }}
          >
            <span
              className="material-symbols-outlined shrink-0"
              style={{ fontSize: 20, color: 'rgba(255,255,255,0.15)' }}
            >
              {item.icon}
            </span>
            <span
              className="whitespace-nowrap"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'rgba(255,255,255,0.15)',
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
      <div className="mt-auto w-full px-2 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          className="flex items-center gap-3 w-full text-left mt-2"
          style={{
            padding: '8px 10px',
            borderRadius: 'var(--radius-sm)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 120ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <span
            className="material-symbols-outlined shrink-0"
            style={{ fontSize: 20, color: 'rgba(255,255,255,0.4)' }}
          >
            settings
          </span>
          <span
            className="whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'rgba(255,255,255,0.45)',
              opacity: expanded ? 1 : 0,
              transition: 'opacity 200ms ease',
            }}
          >
            Settings
          </span>
        </button>
      </div>
    </aside>
  )
}
