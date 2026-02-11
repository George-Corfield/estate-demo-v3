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
      className="flex flex-col py-6 bg-emerald-950 text-white z-50 border-r border-emerald-900 transition-all duration-300 ease-in-out shrink-0 overflow-hidden"
      style={{ width: expanded ? 220 : 64 }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3 px-4 h-8">
        <span className="material-icons text-primary text-2xl shrink-0 ml-0.5">eco</span>
        <span className={`text-lg font-bold tracking-tight whitespace-nowrap transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
          SoilArk
        </span>
      </div>

      {/* Enabled navigation */}
      <nav className="flex flex-col gap-1 w-full px-2.5">
        {enabledItems.map((item) => {
          const active = isActive(item.path)
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all duration-150 w-full text-left ${
                active
                  ? 'bg-primary/20 text-primary'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-icons text-[20px] shrink-0">{item.icon}</span>
              <span className={`text-sm font-medium whitespace-nowrap transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 my-3 border-t border-white/10" />

      {/* Disabled navigation */}
      <nav className="flex flex-col gap-1 w-full px-2.5">
        {disabledItems.map((item) => (
          <div
            key={item.path}
            className="flex items-center gap-3 px-2.5 py-2 rounded-lg text-white/20 w-full cursor-not-allowed"
          >
            <span className="material-icons text-[20px] shrink-0">{item.icon}</span>
            <span className={`text-sm font-medium whitespace-nowrap transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto flex flex-col gap-3 w-full px-2.5">
        <button className="flex items-center gap-3 px-2.5 py-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
          <span className="material-icons text-[20px] shrink-0">settings</span>
          <span className={`text-sm font-medium whitespace-nowrap transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
            Settings
          </span>
        </button>
        <div className="flex items-center gap-3 px-2.5 py-1">
          <div className="w-8 h-8 rounded-full bg-primary/30 border border-primary/50 flex items-center justify-center text-[10px] font-bold shrink-0">
            JS
          </div>
          <div className={`overflow-hidden transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-sm font-medium whitespace-nowrap leading-tight">John Smith</p>
            <p className="text-[11px] text-white/50 whitespace-nowrap">Farm Manager</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
