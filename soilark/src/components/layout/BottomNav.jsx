import { useNavigate, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../../constants/navigation'
import { useApp } from '../../context/AppContext'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useApp()

  const items = NAV_ITEMS.filter(i => i.enabled && i.allowedRoles.includes(currentUser.role))

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--bottom-nav-height)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        background: 'var(--color-deep-950)',
        borderTop: '1px solid var(--color-deep-900)',
        display: 'flex',
        alignItems: 'stretch',
        zIndex: 50,
      }}
    >
      {items.map(item => {
        const active = isActive(item.path)
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              background: 'none',
              border: 'none',
              borderTop: active ? '2px solid var(--color-green-500)' : '2px solid transparent',
              cursor: 'pointer',
              minHeight: 44,
              padding: 0,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 20,
                color: active ? 'var(--color-green-500)' : 'rgba(255,255,255,0.5)',
              }}
            >
              {item.icon}
            </span>
            <span
              style={{
                fontSize: 10,
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                color: active ? 'var(--color-green-500)' : 'rgba(255,255,255,0.5)',
              }}
            >
              {item.label == "Overview" ? "Home" : item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
