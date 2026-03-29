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
        bottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
        left: 16,
        right: 16,
        paddingBottom: 0,
        background: 'rgba(30, 34, 24, 0.72)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 20,
        padding: '8px 6px',
        display: 'flex',
        alignItems: 'center',
        zIndex: 70,
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
              background: active ? 'rgba(78,140,53,0.22)' : 'none',
              border: active ? '1px solid rgba(78,140,53,0.3)' : '1px solid transparent',
              borderRadius: 14,
              cursor: 'pointer',
              minHeight: 44,
              padding: '6px 10px',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 22,
                color: active ? 'var(--color-green-300)' : 'rgba(255,255,255,0.32)',
              }}
            >
              {item.icon}
            </span>
            <span
              style={{
                fontSize: 9,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                color: active ? 'var(--color-green-300)' : 'rgba(255,255,255,0.3)',
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
