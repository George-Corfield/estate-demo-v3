import { useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../../constants/navigation'

export default function TopBar() {
  const location = useLocation()

  // Determine current page name from nav items
  const currentItem = NAV_ITEMS.find(item => {
    if (item.path === '/') return location.pathname === '/'
    return location.pathname.startsWith(item.path)
  })
  const pageName = currentItem?.label || 'Overview'

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
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-earth-400)' }}>
          LandArk Estate
        </span>
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
