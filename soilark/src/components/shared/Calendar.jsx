import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { getMonthDays, isToday, isSameDay, MONTHS, DAYS_SHORT } from '../../utils/dates'
import { aggregateEvents, getEventCountsByType } from '../../utils/events'
import { EVENT_TYPE_COLORS } from '../../constants/colors'
import CalendarDayPanel from './CalendarDayPanel'

export default function Calendar({ onDaySelect, selectedDate: externalSelectedDate, mode = 'view' }) {
  const { fields, tasks, customEvents } = useApp()
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState(null)

  const activeSelectedDate = externalSelectedDate || selectedDate

  const events = useMemo(
    () => aggregateEvents(fields, tasks, customEvents),
    [fields, tasks, customEvents]
  )

  const days = useMemo(
    () => getMonthDays(currentYear, currentMonth),
    [currentYear, currentMonth]
  )

  const handlePrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(y => y - 1)
    } else {
      setCurrentMonth(m => m - 1)
    }
  }

  const handleNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(y => y + 1)
    } else {
      setCurrentMonth(m => m + 1)
    }
  }

  const handleToday = () => {
    const now = new Date()
    setCurrentMonth(now.getMonth())
    setCurrentYear(now.getFullYear())
  }

  const handleDayClick = (date) => {
    if (mode === 'select' && onDaySelect) {
      onDaySelect(date)
      return
    }
    setSelectedDate(isSameDay(selectedDate, date) ? null : date)
  }

  return (
    <div className="flex h-full bg-white">
      {/* Calendar grid */}
      <div className="flex-1 flex flex-col p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-900">
              {MONTHS[currentMonth]} {currentYear}
            </h2>
            <div className="flex items-center gap-1">
              <button onClick={handlePrev} className="p-1 hover:bg-slate-100 rounded">
                <span className="material-icons text-slate-500">chevron_left</span>
              </button>
              <button onClick={handleNext} className="p-1 hover:bg-slate-100 rounded">
                <span className="material-icons text-slate-500">chevron_right</span>
              </button>
            </div>
            <button onClick={handleToday} className="px-3 py-1 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
              Today
            </button>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: EVENT_TYPE_COLORS.task }} />
              Tasks
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: EVENT_TYPE_COLORS.field }} />
              Fields
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: EVENT_TYPE_COLORS.service }} />
              Services
            </span>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS_SHORT.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 flex-1 border-t border-l border-slate-200">
          {days.map((day, i) => {
            const counts = getEventCountsByType(events, day.date)
            const today = isToday(day.date)
            const selected = isSameDay(activeSelectedDate, day.date)
            return (
              <button
                key={i}
                onClick={() => handleDayClick(day.date)}
                className={`border-r border-b border-slate-200 p-2 text-left transition-colors min-h-[80px] flex flex-col ${
                  !day.isCurrentMonth ? 'bg-slate-50 text-slate-300' :
                  selected ? 'bg-primary/10' :
                  today ? 'bg-teal-50' :
                  'bg-white hover:bg-slate-50'
                }`}
              >
                <span className={`text-sm font-medium ${
                  today ? 'bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs' :
                  !day.isCurrentMonth ? '' : 'text-slate-700'
                }`}>
                  {day.date.getDate()}
                </span>
                {day.isCurrentMonth && Object.keys(counts).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-auto pt-1">
                    {Object.entries(counts).map(([type, count]) => (
                      <span
                        key={type}
                        className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full leading-none"
                        style={{ backgroundColor: EVENT_TYPE_COLORS[type] || EVENT_TYPE_COLORS.custom }}
                      >
                        {count}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Day panel */}
      {selectedDate && mode === 'view' && (
        <CalendarDayPanel
          date={selectedDate}
          events={events}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  )
}
