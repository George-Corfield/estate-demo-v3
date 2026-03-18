import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { NAV_ITEMS } from '../../constants/navigation'
import { useApp } from '../../context/AppContext'

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useApp()

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
    </aside>
  )
}
