import { useState, useEffect, useRef } from 'react'
import { formatOrdinalDate } from '../../utils/dates'
import EstateStatsDropdown from './EstateStatsDropdown'

export default function TopBar() {
  const [dateStr, setDateStr] = useState(formatOrdinalDate(new Date()))
  const [showStats, setShowStats] = useState(false)
  const statsRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setDateStr(formatOrdinalDate(new Date()))
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClick(e) {
      if (statsRef.current && !statsRef.current.contains(e.target)) {
        setShowStats(false)
      }
    }
    if (showStats) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showStats])

  return (
    <header className="h-14 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white flex items-center justify-between px-6 z-40 shrink-0">
      {/* Left: Date/Time */}
      <div className="text-sm font-medium opacity-90">{dateStr}</div>

      {/* Right: Estate selector + Stats + User */}
      <div className="flex items-center gap-4">
        {/* Estate selector */}
        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg text-sm">
          <span className="material-icons text-base">location_on</span>
          <span className="font-medium">Landark Estate</span>
        </div>

        {/* Estate Stats */}
        <div className="relative" ref={statsRef}>
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-sm transition-colors"
          >
            <span className="material-icons text-base">bar_chart</span>
            <span className="font-medium">Estate Stats</span>
            <span className="material-icons text-base">
              {showStats ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          {showStats && <EstateStatsDropdown onClose={() => setShowStats(false)} />}
        </div>

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/30 border border-primary/50 flex items-center justify-center text-xs font-bold">
            JS
          </div>
        </div>
      </div>
    </header>
  )
}
