import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import EstateMap from '../../components/shared/EstateMap'
import Calendar from '../../components/shared/Calendar'
import { useApp } from '../../context/AppContext'
import { formatShortDate } from '../../utils/dates'
import { ROLES } from '../../constants/roles'
import { isTaskVisibleToUser } from '../../utils/visibility'

// ─── Helpers ────────────────────────────────────────────────────────────────

function today() {
  return new Date().toISOString().split('T')[0]
}

// ─── Drawer Row ───────────────────────────────────────────────────────────────

function DrawerRow({ icon, iconColor, title, subtitle, meta, onClick, badge, badgeColor }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 14px',
        background: 'none',
        border: 'none',
        borderBottom: '1px solid var(--color-surface-100)',
        cursor: onClick ? 'pointer' : 'default',
        textAlign: 'left',
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.background = 'var(--color-surface-100)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontSize: 16, color: iconColor || 'var(--color-deep-400)', flexShrink: 0 }}
      >{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="text-body-small" style={{ fontWeight: 600, color: 'var(--color-slate-800)', fontSize: 12 }}>{title}</span>
          {badge && (
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 99,
              background: badgeColor || 'var(--color-amber-100)',
              color: badgeColor ? '#fff' : 'var(--color-amber-700)',
            }}>{badge}</span>
          )}
        </div>
        {subtitle && <p style={{ color: 'var(--color-slate-400)', fontSize: 11, margin: 0, marginTop: 1 }}>{subtitle}</p>}
      </div>
      {meta && <span style={{ color: 'var(--color-slate-400)', fontSize: 11, flexShrink: 0 }}>{meta}</span>}
      {onClick && <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--color-slate-300)', flexShrink: 0 }}>chevron_right</span>}
    </button>
  )
}

// ─── Widget Card ──────────────────────────────────────────────────────────────

function WidgetCard({ icon, iconColor, label, primary, secondary, badge, badgeColor, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)'}`,
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 120ms ease',
        transform: hovered ? 'translateY(-1px)' : 'none',
        boxShadow: hovered
          ? '0 4px 16px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)'
          : '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontSize: 22, color: iconColor || 'var(--color-deep-500)', flexShrink: 0 }}
      >{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-slate-500)' }}>{label}</span>
          {badge != null && (
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 99,
              background: badgeColor || 'var(--color-amber-100)',
              color: badgeColor ? '#fff' : 'var(--color-amber-700)',
              lineHeight: 1.5,
            }}>{badge}</span>
          )}
        </div>
        <span style={{ color: 'var(--color-slate-900)', fontWeight: 600, fontSize: 16, lineHeight: 1.2 }}>
          {primary}
        </span>
        {secondary && (
          <p style={{ color: 'var(--color-slate-400)', fontSize: 11, margin: 0, marginTop: 1 }}>
            {secondary}
          </p>
        )}
      </div>
      <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-slate-300)', flexShrink: 0 }}>chevron_right</span>
    </button>
  )
}

// ─── Widget Expanded Header ───────────────────────────────────────────────────

function WidgetExpanded({ title, icon, onBack, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        padding: '12px 14px',
        borderBottom: '1px solid var(--color-surface-200)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', color: 'var(--color-deep-500)',
            padding: 0,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
        </button>
        <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-deep-500)' }}>{icon}</span>
        <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-slate-800)' }}>{title}</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {children}
      </div>
    </div>
  )
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

const ACTIVITY_TYPE_ICONS = {
  task: { icon: 'task', color: 'var(--color-blue-500, #3b82f6)' },
  observation: { icon: 'visibility', color: 'var(--color-amber-500, #f59e0b)' },
}

function extractTime(timestamp) {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  if (isNaN(d)) return ''
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function buildActivityFeed(tasks, fields, staff) {
  const items = []
  const todayStr = today()

  fields.forEach(f => {
    (f.activities || []).forEach(a => {
      const actDate = a.timestamp ? a.timestamp.split('T')[0] : null
      if (actDate !== todayStr) return
      const typeConfig = ACTIVITY_TYPE_ICONS[a.type] || ACTIVITY_TYPE_ICONS.observation
      items.push({
        id: `act-field-${a.id}`,
        time: extractTime(a.timestamp),
        icon: typeConfig.icon,
        iconColor: typeConfig.color,
        text: `${f.name} – ${a.title}`,
        sub: a.completedBy || null,
        timestamp: a.timestamp,
        fieldId: f.id,
      })
    })
  })

  tasks
    .filter(t => t.status === 'done' && t.completedDate === todayStr)
    .forEach(t => {
      const alreadyInHistory = items.some(i => i.id.includes(t.id))
      if (alreadyInHistory) return
      const worker = staff.find(s => s.id === t.assigneeId || s.name === t.assignee)
      items.push({
        id: `act-task-${t.id}`,
        time: '',
        icon: 'task_alt',
        iconColor: 'var(--color-deep-400)',
        text: `${t.name} completed`,
        sub: worker ? worker.name : null,
        timestamp: `${todayStr}T23:59:00`,
      })
    })

  staff
    .filter(s => s.status === 'Sick' || s.status === 'Pending Sick Confirmation')
    .forEach(s => items.push({
      id: `act-sick-${s.id}`,
      time: '',
      icon: 'sick',
      iconColor: 'var(--color-red-400)',
      text: `${s.name} reported sick`,
      sub: s.role,
      timestamp: `${todayStr}T00:00:00`,
    }))

  items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  return items.slice(0, 12)
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function OverviewPageMobile() {
  const [mobileSection, setMobileSection] = useState(0)
  const [touchStartX, setTouchStartX] = useState(null)
  const [touchStartY, setTouchStartY] = useState(null)
  const [swipeDelta, setSwipeDelta] = useState(0)
  const swipeAxisRef = useRef(null)
  const swipeContainerRef = useRef(null)

  const [addEvent, setAddEvent] = useState(false)
  const [highlightedFieldIds, setHighlightedFieldIds] = useState([])
  const [expandedWidget, setExpandedWidget] = useState(null)
  const [weather, setWeather] = useState(null)
  const [expandedDay, setExpandedDay] = useState(null)
  const [bookingMachine, setBookingMachine] = useState(null)

  const location = useLocation()
  const navigate = useNavigate()
  const { tasks = [], staff = [], machinery = [], fields = [], absences = [], currentUser, notifications = [], markAllNotificationsRead, addTask, showToast } = useApp()
  const isManager = currentUser.role === ROLES.FARM_MANAGER

  useEffect(() => {
    if (location.state?.openCalendar) {
      setMobileSection(1)
      setAddEvent(!!location.state?.addEvent)
      navigate('.', { replace: true, state: {} })
    }
  }, [location.state, navigate])

  // Weather fetch
  useEffect(() => {
    const url = 'https://api.open-meteo.com/v1/forecast'
      + '?latitude=51.42&longitude=-1.74'
      + '&daily=temperature_2m_mean,precipitation_sum,precipitation_probability_max,'
      + 'wind_speed_10m_max,et0_fao_evapotranspiration,shortwave_radiation_sum,weather_code'
      + '&hourly=wind_speed_10m,soil_temperature_0cm,soil_temperature_6cm,'
      + 'soil_moisture_0_to_1cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm'
      + '&forecast_days=8&timezone=Europe/London'

    const weatherIcons = {
      0: { icon: 'wb_sunny', label: 'Clear', color: 'var(--color-amber-400)' },
      1: { icon: 'partly_cloudy_day', label: 'Mainly Clear', color: 'var(--color-amber-300)' },
      2: { icon: 'partly_cloudy_day', label: 'Partly Cloudy', color: 'var(--color-slate-400)' },
      3: { icon: 'cloud', label: 'Overcast', color: 'var(--color-slate-400)' },
      51: { icon: 'rainy', label: 'Light Drizzle', color: '#60a5fa' },
      61: { icon: 'rainy', label: 'Light Rain', color: '#60a5fa' },
      63: { icon: 'rainy', label: 'Moderate Rain', color: '#3b82f6' },
      65: { icon: 'rainy', label: 'Heavy Rain', color: '#2563eb' },
      71: { icon: 'weather_snowy', label: 'Light Snow', color: '#bae6fd' },
      80: { icon: 'rainy', label: 'Rain Showers', color: '#60a5fa' },
      95: { icon: 'thunderstorm', label: 'Thunderstorm', color: '#8b5cf6' },
    }

    fetch(url)
      .then(r => r.json())
      .then(d => {
        const days = d.daily.time.map((date, i) => {
          const hStart = i * 24
          const hEnd = hStart + 24
          const noonIdx = hStart + 12
          const wc = d.daily.weather_code[i]
          const info = weatherIcons[wc] || weatherIcons[wc > 50 ? 61 : wc > 3 ? 3 : 2] || weatherIcons[2]
          const dayWinds = d.hourly.wind_speed_10m.slice(hStart, hEnd).filter(v => v != null)
          const windAvg = dayWinds.length > 0 ? Math.round(dayWinds.reduce((a, b) => a + b, 0) / dayWinds.length) : 0
          const skinTemps = d.hourly.soil_temperature_0cm.slice(hStart, hEnd).filter(v => v != null)
          const skinMin = skinTemps.length > 0 ? Math.round(Math.min(...skinTemps)) : null
          const skinMax = skinTemps.length > 0 ? Math.round(Math.max(...skinTemps)) : null
          const sm01 = d.hourly.soil_moisture_0_to_1cm[noonIdx]
          const sm39 = d.hourly.soil_moisture_3_to_9cm[noonIdx]
          const soilM010 = (sm01 != null && sm39 != null) ? Math.round(((sm01 + sm39) / 2) * 100) / 100 : null
          const soilM1040 = d.hourly.soil_moisture_9_to_27cm[noonIdx] != null
            ? Math.round(d.hourly.soil_moisture_9_to_27cm[noonIdx] * 100) / 100
            : null
          const soilT010 = d.hourly.soil_temperature_6cm[noonIdx] != null
            ? Math.round(d.hourly.soil_temperature_6cm[noonIdx])
            : null
          const solarMJ = d.daily.shortwave_radiation_sum[i]
          const solarWm2h = solarMJ != null ? Math.round(solarMJ * 1000000 / 3600 / 12) : null
          return {
            date,
            dayName: new Date(date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short' }),
            temp: d.daily.temperature_2m_mean[i] != null ? Math.round(d.daily.temperature_2m_mean[i]) : null,
            skinMin, skinMax,
            precip: d.daily.precipitation_sum[i] != null ? Math.round(d.daily.precipitation_sum[i] * 10) / 10 : 0,
            pop: d.daily.precipitation_probability_max[i] || 0,
            windAvg, et0: d.daily.et0_fao_evapotranspiration[i] != null
              ? Math.round(d.daily.et0_fao_evapotranspiration[i] * 10) / 10 : null,
            icon: info.icon, label: info.label, iconColor: info.color,
            soilM010, soilM1040, soilT010, solarWm2h,
          }
        })
        setWeather(days)
      })
      .catch(() => {
        setWeather([{
          date: today(), dayName: 'Today', temp: 8, skinMin: 3, skinMax: 15,
          precip: 2, pop: 45, windAvg: 12, et0: 2.1,
          icon: 'partly_cloudy_day', label: 'Partly Cloudy', iconColor: 'var(--color-slate-400)',
          soilM010: 0.22, soilM1040: 0.45, soilT010: 8, solarWm2h: 142,
        }])
      })
  }, [])

  // Non-passive touch handler to prevent scroll when swiping horizontally
  useEffect(() => {
    const el = swipeContainerRef.current
    if (!el) return
    const handler = (e) => {
      if (swipeAxisRef.current === 'x') e.preventDefault()
    }
    el.addEventListener('touchmove', handler, { passive: false })
    return () => el.removeEventListener('touchmove', handler)
  }, [])

  // ── Derived data ──────────────────────────────────────────────────────────

  const todayStr = today()
  const visibleTasks = tasks.filter(t => isTaskVisibleToUser(t, currentUser, staff))
  const todayTasks = visibleTasks.filter(t =>
    t.status !== 'cancelled' && (t.dueDate === todayStr || t.status === 'in-progress')
  )
  const overdueTasks = visibleTasks.filter(t =>
    t.status !== 'done' && t.status !== 'cancelled' && t.dueDate && t.dueDate < todayStr
  )
  const inProgressTasks = visibleTasks.filter(t => t.status === 'in-progress')

  const activeMachinery = machinery.filter(m => m.status === 'Active')
  const serviceDueMachinery = machinery.filter(m =>
    m.status === 'Service Due' || (m.nextServiceDue && m.hours >= m.nextServiceDue - 50)
  )
  const maintenanceMachinery = machinery.filter(m => m.status === 'Unavailable')
  const storedMachinery = machinery.filter(m => m.status === 'Available')
  const soldMachinery = machinery.filter(m => m.status === 'Sold')

  const availableStaff = staff.filter(s => s.status === 'Available')
  const onTaskStaff = staff.filter(s => s.status === 'On Task')
  const sickStaff = staff.filter(s => s.status === 'Sick' || s.status === 'Pending Sick Confirmation')
  const onHolidayStaff = staff.filter(s => s.status === 'On Holiday')
  const offDutyStaff = staff.filter(s => s.status === 'Off Duty')

  const userNotifs = notifications.filter(n => n.forUserId === currentUser.id)
  const unreadCount = userNotifs.filter(n => !n.read).length
  const allActivity = buildActivityFeed(tasks, fields, staff)
  const activityFeed = isManager ? allActivity : allActivity.filter(a => !a.id.startsWith('act-sick-'))

  const fieldsWithTasks = fields.filter(f =>
    inProgressTasks.some(t => t.fieldIds?.includes(f.id))
  ).map(f => f.id)
  const fieldsWithOverdueTasks = fields.filter(f =>
    overdueTasks.some(t => t.fieldIds?.includes(f.id))
  ).map(f => f.id)

  const effectiveExpandedWidget = (!isManager && (expandedWidget === 'staff' || expandedWidget === 'machinery'))
    ? null
    : expandedWidget

  const handleWidgetExpand = (widget) => {
    if (widget === 'tasks') setHighlightedFieldIds(fieldsWithTasks)
    if (widget === 'notifications') markAllNotificationsRead(currentUser.id)
    setExpandedWidget(widget)
  }

  const todayWeather = weather?.[0] || null
  const rainBadge = todayWeather && todayWeather.pop > 50 ? `${todayWeather.pop}% rain` : null

  // ── Touch handlers ────────────────────────────────────────────────────────

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX)
    setTouchStartY(e.touches[0].clientY)
    setSwipeDelta(0)
    swipeAxisRef.current = null
  }

  const handleTouchMove = (e) => {
    if (touchStartX === null) return
    const dx = e.touches[0].clientX - touchStartX
    const dy = e.touches[0].clientY - touchStartY

    if (swipeAxisRef.current === null) {
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        swipeAxisRef.current = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y'
      }
    }

    if (swipeAxisRef.current === 'x') {
      setSwipeDelta(dx)
    }
  }

  const handleTouchEnd = () => {
    if (Math.abs(swipeDelta) > 50) {
      const direction = swipeDelta < 0 ? 1 : -1
      setMobileSection(prev => Math.max(0, Math.min(2, prev + direction)))
    }
    setSwipeDelta(0)
    setTouchStartX(null)
    setTouchStartY(null)
    swipeAxisRef.current = null
  }

  const handleFieldClick = (field) => {
    navigate('/fields', { state: { openFieldId: field.id } })
  }

  // ── Expanded widget content ───────────────────────────────────────────────

  const renderExpandedContent = () => {
    switch (effectiveExpandedWidget) {
      case 'weather': {
        const days = weather || []
        const tw = days[0]
        const noteDay0 = days[0]
        const noteDay1 = days[1]
        const maxPop2 = Math.max(noteDay0?.pop || 0, noteDay1?.pop || 0)
        const maxWind2 = Math.max(noteDay0?.windAvg || 0, noteDay1?.windAvg || 0)
        const opNote = maxPop2 > 70
          ? 'Heavy rain likely — avoid chemical applications and cultivation.'
          : maxPop2 > 40
          ? 'Rain possible — plan spraying for dry windows.'
          : maxWind2 > 20
          ? 'High winds forecast — check spray conditions before application.'
          : 'Good conditions for most field operations.'

        return (
          <WidgetExpanded title="8-Day Forecast" icon="wb_sunny" onBack={() => { setExpandedWidget(null); setExpandedDay(null) }}>
            {tw && (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '12px 14px', background: 'var(--color-surface-100)', borderBottom: '1px solid var(--color-surface-200)' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Operational note</span>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--color-slate-700)', lineHeight: 1.5 }}>{opNote}</p>
                </div>
                <div style={{
                  padding: '16px 14px',
                  background: 'linear-gradient(135deg, rgba(19,236,19,0.06), rgba(19,236,19,0.02))',
                  borderBottom: '1px solid var(--color-surface-200)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 32, color: tw.iconColor }}>{tw.icon}</span>
                    <div>
                      <span style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-slate-800)' }}>{tw.temp}°C</span>
                      <span style={{ fontSize: 15, color: 'var(--color-slate-500)', marginLeft: 8 }}>{tw.label}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--color-slate-600)', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 500 }}>Wind {tw.windAvg} km/h</span>
                    <span style={{ fontWeight: 500 }}>Rain {tw.pop}%</span>
                    <span style={{ fontWeight: 500 }}>ET₀ {tw.et0}</span>
                    {tw.skinMin != null && <span style={{ fontWeight: 500 }}>Skin {tw.skinMin}–{tw.skinMax}°C</span>}
                  </div>
                </div>
                <div>
                  {days.map((day, i) => {
                    const isExpanded = expandedDay === i
                    return (
                      <div key={day.date}>
                        <button
                          onClick={() => setExpandedDay(isExpanded ? null : i)}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'flex-start', gap: 10,
                            padding: '10px 14px', background: i === 0 ? 'rgba(19,236,19,0.04)' : 'none',
                            border: 'none', borderBottom: isExpanded ? 'none' : '1px solid var(--color-surface-100)',
                            cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-100)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = i === 0 ? 'rgba(19,236,19,0.04)' : 'transparent' }}
                        >
                          <div style={{ width: 40, flexShrink: 0, textAlign: 'center', paddingTop: 1 }}>
                            <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: i === 0 ? 'var(--color-deep-600)' : 'var(--color-slate-700)' }}>
                              {i === 0 ? 'Today' : day.dayName}
                            </span>
                            <span className="material-symbols-outlined" style={{ fontSize: 20, color: day.iconColor, marginTop: 2 }}>{day.icon}</span>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 3 }}>
                              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-slate-800)' }}>{day.temp}°C</span>
                              {day.skinMin != null && (
                                <span style={{ fontSize: 12, color: 'var(--color-slate-400)' }}>Skin {day.skinMin}–{day.skinMax}°C</span>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 12, lineHeight: 1.6 }}>
                              <span style={{ color: day.pop > 60 ? '#3b82f6' : 'var(--color-slate-500)' }}>
                                <span style={{ color: 'var(--color-slate-400)' }}>Rain </span>
                                <strong>{day.precip}mm</strong> {day.pop}%
                              </span>
                              <span style={{ color: 'var(--color-slate-300)' }}>|</span>
                              <span style={{ color: 'var(--color-slate-500)' }}>
                                <span style={{ color: 'var(--color-slate-400)' }}>Wind </span>
                                <strong>{day.windAvg}</strong> km/h
                              </span>
                              {day.et0 != null && (
                                <>
                                  <span style={{ color: 'var(--color-slate-300)' }}>|</span>
                                  <span style={{ color: 'var(--color-slate-500)' }}>
                                    <span style={{ color: 'var(--color-slate-400)' }}>ET₀ </span>
                                    <strong>{day.et0}</strong>
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <span className="material-symbols-outlined" style={{
                            fontSize: 16, color: 'var(--color-slate-300)', flexShrink: 0, marginTop: 6,
                            transform: isExpanded ? 'rotate(180deg)' : 'none',
                            transition: 'transform 150ms ease',
                          }}>expand_more</span>
                        </button>
                        {isExpanded && (
                          <div style={{
                            padding: '8px 14px 12px 78px', background: 'var(--color-surface-100)',
                            borderBottom: '1px solid var(--color-surface-200)',
                            fontSize: 13, color: 'var(--color-slate-600)',
                            display: 'flex', flexDirection: 'column', gap: 5, lineHeight: 1.4,
                          }}>
                            {day.skinMin != null && <span><strong style={{ color: 'var(--color-slate-700)' }}>Skin temp:</strong> {day.skinMin}–{day.skinMax}°C</span>}
                            {day.soilM010 != null && <span><strong style={{ color: 'var(--color-slate-700)' }}>Soil moisture:</strong> {day.soilM010} m³/m³ (0–10cm) / {day.soilM1040} m³/m³ (10–40cm)</span>}
                            {day.soilT010 != null && <span><strong style={{ color: 'var(--color-slate-700)' }}>Soil temp (0–10cm):</strong> {day.soilT010}°C</span>}
                            {day.solarWm2h != null && <span><strong style={{ color: 'var(--color-slate-700)' }}>Solar radiation:</strong> {day.solarWm2h} W/m²·H</span>}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </WidgetExpanded>
        )
      }

      case 'tasks': {
        const todoTasks = visibleTasks.filter(t => t.status === 'todo')
        const ipTasks = visibleTasks.filter(t => t.status === 'in-progress')
        const resolveFieldNames = (t) => {
          if (!t.fieldIds || t.fieldIds.length === 0) return 'No field'
          return t.fieldIds.map(fid => fields.find(f => f.id === fid)?.name).filter(Boolean).join(', ') || 'No field'
        }
        const isOverdue = (t) => t.dueDate && t.dueDate < todayStr && t.status !== 'done' && t.status !== 'cancelled'
        const renderTaskSection = (label, sectionTasks, icon, iconColor) => (
          <>
            <div style={{ padding: '6px 14px 4px', background: 'var(--color-surface-100)' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
            </div>
            {sectionTasks.length === 0 ? (
              <div style={{ padding: '9px 14px', fontSize: 12, color: 'var(--color-slate-400)', borderBottom: '1px solid var(--color-surface-100)' }}>No tasks</div>
            ) : sectionTasks.map(t => (
              <DrawerRow key={t.id} icon={icon} iconColor={iconColor} title={t.name}
                subtitle={resolveFieldNames(t)}
                meta={t.status === 'done' ? t.completedDate || t.dueDate : t.dueDate}
                badge={isOverdue(t) ? 'Overdue' : null}
                badgeColor={isOverdue(t) ? 'var(--color-red-500)' : null}
                onClick={() => navigate('/tasks', { state: { openTaskId: t.id } })}
              />
            ))}
          </>
        )
        return (
          <WidgetExpanded title="Tasks" icon="assignment" onBack={() => setExpandedWidget(null)}>
            {renderTaskSection('Todo', todoTasks, 'radio_button_unchecked', 'var(--color-slate-300)')}
            {renderTaskSection('In Progress', ipTasks, 'play_circle', 'var(--color-deep-400)')}
            <div style={{ padding: '8px 14px', borderTop: '1px solid var(--color-surface-200)' }}>
              <button onClick={() => navigate('/tasks')}
                style={{ width: '100%', padding: '6px', background: 'var(--color-surface-100)', border: '1px solid var(--color-surface-300)', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--color-deep-600)', fontWeight: 600, cursor: 'pointer' }}>
                View all tasks →
              </button>
            </div>
          </WidgetExpanded>
        )
      }

      case 'staff': {
        const renderStaffRow = (s) => {
          const task = tasks.find(t => t.status === 'in-progress' && (t.assigneeId === s.id || t.assignee === s.name))
          const todayDate = today()
          const activeHoliday = s.status === 'On Holiday'
            ? absences.find(a => a.staffId === s.id && a.type === 'holiday' && a.status !== 'cancelled' && a.startDate <= todayDate && a.endDate >= todayDate)
            : null
          const returnDate = activeHoliday?.endDate
            ? (() => { const d = new Date(activeHoliday.endDate); d.setDate(d.getDate() + 1); return d })()
            : null
          return (
            <DrawerRow key={s.id} icon="person" iconColor="var(--color-slate-400)"
              title={s.name} subtitle={task ? task.name : s.role}
              meta={returnDate ? `Back ${formatShortDate(returnDate)}` : null}
              badge={s.status === 'Pending Sick Confirmation' ? 'Confirm' : null}
              badgeColor="var(--color-red-500)"
              onClick={() => navigate('/staff', { state: { openStaffId: s.id } })}
            />
          )
        }
        const renderStaffSection = (label, sectionStaff, emptyMessage, labelColor) => (
          <>
            <div style={{ padding: '6px 14px 4px', background: 'var(--color-surface-100)' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: labelColor || 'var(--color-slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
            </div>
            {sectionStaff.length === 0
              ? <div style={{ padding: '9px 14px', fontSize: 12, color: 'var(--color-slate-400)', borderBottom: '1px solid var(--color-surface-100)' }}>{emptyMessage}</div>
              : sectionStaff.map(renderStaffRow)}
          </>
        )
        return (
          <WidgetExpanded title="Workforce Today" icon="group" onBack={() => setExpandedWidget(null)}>
            {renderStaffSection('Available', availableStaff, 'No staff available', 'var(--color-green-800)')}
            {renderStaffSection('On Task', onTaskStaff, 'No staff on task', 'var(--color-amber-700)')}
            {renderStaffSection('Sick Leave', sickStaff, 'No staff on sick leave', 'var(--color-red-700)')}
            {renderStaffSection('On Holiday', onHolidayStaff, 'No staff on holiday', 'var(--color-slate-600)')}
            {renderStaffSection('Off Duty', offDutyStaff, 'No staff off duty', 'var(--color-slate-600)')}
            <div style={{ padding: '8px 14px', borderTop: '1px solid var(--color-surface-200)' }}>
              <button onClick={() => navigate('/staff')}
                style={{ width: '100%', padding: '6px', background: 'var(--color-surface-100)', border: '1px solid var(--color-surface-300)', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--color-deep-600)', fontWeight: 600, cursor: 'pointer' }}>
                View all staff →
              </button>
            </div>
          </WidgetExpanded>
        )
      }

      case 'machinery': {
        const renderMachinerySection = (label, items, icon, iconColor, subtitleFn, labelColor) => (
          <>
            <div style={{ padding: '6px 14px 4px', background: 'var(--color-surface-100)' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: labelColor || 'var(--color-slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
            </div>
            {items.length === 0
              ? <div style={{ padding: '9px 14px', fontSize: 12, color: 'var(--color-slate-400)', borderBottom: '1px solid var(--color-surface-100)' }}>No equipment</div>
              : items.map(m => (
                <DrawerRow key={m.id} icon={icon} iconColor={iconColor} title={m.name}
                  subtitle={subtitleFn(m)}
                  onClick={() => navigate('/machinery', { state: { openEquipmentId: m.id } })}
                />
              ))}
          </>
        )
        return (
          <WidgetExpanded title="Equipment Status" icon="agriculture" onBack={() => setExpandedWidget(null)}>
            {renderMachinerySection('Active', activeMachinery, 'agriculture', 'var(--color-deep-400)',
              m => tasks.find(t => t.status === 'in-progress' && (t.machineryId === m.id || t.machinery === m.name))?.name || 'Available',
              'var(--color-green-800)'
            )}
            <>
              <div style={{ padding: '6px 14px 4px', background: 'var(--color-surface-100)' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-amber-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Service Due</span>
              </div>
              {serviceDueMachinery.length === 0
                ? <div style={{ padding: '9px 14px', fontSize: 12, color: 'var(--color-slate-400)', borderBottom: '1px solid var(--color-surface-100)' }}>No equipment</div>
                : serviceDueMachinery.map(m => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--color-surface-100)' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <DrawerRow icon="build" iconColor="var(--color-amber-500)" title={m.name}
                        subtitle={`${m.hours} hrs · service at ${m.nextServiceDue} hrs`}
                        onClick={() => navigate('/machinery', { state: { openEquipmentId: m.id } })}
                      />
                    </div>
                    <button
                      onClick={() => { setBookingMachine(m); setExpandedWidget(null); setMobileSection(1) }}
                      title="Book service"
                      style={{
                        flexShrink: 0, padding: '6px 10px',
                        background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                        borderRadius: 'var(--radius-sm)', cursor: 'pointer', marginRight: 10,
                        display: 'flex', alignItems: 'center', color: 'var(--color-amber-700, #92400e)',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>calendar_month</span>
                    </button>
                  </div>
                ))}
            </>
            {renderMachinerySection('Unavailable', maintenanceMachinery, 'construction', 'var(--color-red-400)',
              () => 'Unavailable', 'var(--color-red-700)'
            )}
            {renderMachinerySection('Available', storedMachinery, 'warehouse', 'var(--color-slate-500)',
              () => 'Available', 'var(--color-slate-600)'
            )}
            <div style={{ padding: '8px 14px', borderTop: '1px solid var(--color-surface-200)' }}>
              <button onClick={() => navigate('/machinery')}
                style={{ width: '100%', padding: '6px', background: 'var(--color-surface-100)', border: '1px solid var(--color-surface-300)', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--color-deep-600)', fontWeight: 600, cursor: 'pointer' }}>
                View all machinery →
              </button>
            </div>
          </WidgetExpanded>
        )
      }

      case 'notifications': {
        function handleNotifClick(n) {
          if (n.staffId) navigate('/staff', { state: { openStaffId: n.staffId } })
          else if (n.taskId) navigate('/tasks', { state: { openTaskId: n.taskId } })
        }
        return (
          <WidgetExpanded title="Notifications" icon="notifications" onBack={() => setExpandedWidget(null)}>
            {userNotifs.length === 0
              ? <div style={{ padding: 14, color: 'var(--color-slate-400)', fontSize: 12, textAlign: 'center' }}>No notifications</div>
              : userNotifs.map(n => {
                const iconMap = { success: 'check_circle', warning: 'warning', info: 'info' }
                const colorMap = { success: 'var(--color-green-500)', warning: 'var(--color-amber-400)', info: 'var(--color-slate-400)' }
                const diff = Date.now() - new Date(n.timestamp).getTime()
                const mins = Math.floor(diff / 60000)
                const meta = mins < 1 ? 'just now' : mins < 60 ? `${mins}m ago` : mins < 1440 ? `${Math.floor(mins / 60)}h ago` : `${Math.floor(mins / 1440)}d ago`
                return (
                  <DrawerRow key={n.id} icon={iconMap[n.type] || 'info'} iconColor={colorMap[n.type] || colorMap.info}
                    title={n.message} meta={meta} onClick={() => handleNotifClick(n)}
                  />
                )
              })}
          </WidgetExpanded>
        )
      }

      case 'activity':
        return (
          <WidgetExpanded title="Activity Feed" icon="history" onBack={() => setExpandedWidget(null)}>
            {activityFeed.length === 0
              ? <div style={{ padding: 14, color: 'var(--color-slate-400)', fontSize: 12, textAlign: 'center' }}>No activity recorded today</div>
              : activityFeed.map(item => (
                <DrawerRow key={item.id} icon={item.icon} iconColor={item.iconColor}
                  title={item.text} subtitle={item.sub} meta={item.time}
                  onClick={item.fieldId ? () => navigate('/fields', { state: { openFieldId: item.fieldId, openTab: 'history' } }) : undefined}
                />
              ))}
          </WidgetExpanded>
        )

      default:
        return null
    }
  }

  const TABS = ['Map', 'Calendar', 'Overview']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        background: 'var(--color-surface-50)',
        borderBottom: '1px solid var(--color-surface-200)',
        flexShrink: 0,
      }}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setMobileSection(i)}
            style={{
              flex: 1,
              padding: '10px 0',
              background: 'none',
              border: 'none',
              borderBottom: mobileSection === i ? '2px solid var(--color-green-500)' : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: mobileSection === i ? 600 : 400,
              color: mobileSection === i ? 'var(--color-green-500)' : 'var(--color-slate-500)',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Swipe container */}
      <div
        ref={swipeContainerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ flex: 1, overflow: 'hidden', position: 'relative' }}
      >
        <div
          style={{
            display: 'flex',
            width: '300%',
            height: '100%',
            transform: `translateX(calc(${-mobileSection * (100 / 3)}% + ${swipeDelta / 3}px))`,
            transition: swipeDelta === 0 ? 'transform 250ms ease' : 'none',
          }}
        >
          {/* Section 0: Map */}
          <div style={{ width: '33.333%', height: '100%', flexShrink: 0, position: 'relative' }}>
            <EstateMap
              onFieldClick={handleFieldClick}
              highlightedFieldIds={highlightedFieldIds}
              alertFieldIds={effectiveExpandedWidget === 'tasks' ? fieldsWithOverdueTasks : []}
            />
            {highlightedFieldIds.length > 0 && (
              <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
                <button
                  onClick={() => setHighlightedFieldIds([])}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 14px', background: 'var(--color-deep-600)', color: '#fff',
                    border: 'none', borderRadius: 99, fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>layers_clear</span>
                  Clear field highlights
                </button>
              </div>
            )}
          </div>

          {/* Section 1: Calendar */}
          <div style={{ width: '33.333%', height: '100%', flexShrink: 0, overflow: 'auto' }}>
            <Calendar
              onToggleView={() => setMobileSection(0)}
              initialAddEvent={addEvent}
              bookingMachine={bookingMachine}
              onBookingConfirmed={(machine, dateStr, time) => {
                const taskId = `task-${Date.now()}`
                addTask({
                  id: taskId,
                  name: `Service — ${machine.name}`,
                  type: 'Service',
                  status: 'todo',
                  priority: 'high',
                  dueDate: dateStr,
                  assignedMachinery: [machine.name],
                  assignedTo: [],
                  fieldIds: [],
                  comments: [],
                  typeFields: { scheduledTime: time, mechanic: '', notes: '' },
                })
                showToast(`Service booked for ${machine.name}`)
                setBookingMachine(null)
                navigate('/tasks', { state: { openTaskId: taskId } })
              }}
            />
          </div>

          {/* Section 2: Widgets */}
          <div style={{ width: '33.333%', height: '100%', flexShrink: 0, overflowY: 'auto', padding: '12px 16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <WidgetCard
              icon={todayWeather?.icon || 'wb_sunny'}
              iconColor={todayWeather?.iconColor || 'var(--color-amber-400)'}
              label="Weather"
              primary={todayWeather ? `${todayWeather.temp}°C · ${todayWeather.label}` : 'Loading…'}
              secondary={todayWeather ? `Wind ${todayWeather.windAvg} km/h` : null}
              badge={rainBadge}
              badgeColor={null}
              onClick={() => handleWidgetExpand('weather')}
            />
            <WidgetCard
              icon="assignment"
              label="Tasks"
              primary={`${todayTasks.length} Today`}
              secondary={overdueTasks.length > 0 ? `${overdueTasks.length} overdue` : 'All on track'}
              badge={overdueTasks.length > 0 ? overdueTasks.length : null}
              badgeColor={overdueTasks.length > 0 ? 'var(--color-red-500)' : null}
              onClick={() => handleWidgetExpand('tasks')}
            />
            {isManager && (
              <WidgetCard
                icon="group"
                label="Staff"
                primary={`${availableStaff.length + onTaskStaff.length} Working`}
                secondary={`${onTaskStaff.length} on task${sickStaff.length > 0 ? ` · ${sickStaff.length} sick` : ''}`}
                badge={sickStaff.filter(s => s.status === 'Pending Sick Confirmation').length > 0 ? '!' : null}
                badgeColor="var(--color-red-500)"
                onClick={() => handleWidgetExpand('staff')}
              />
            )}
            {isManager && (
              <WidgetCard
                icon="agriculture"
                label="Machinery"
                primary={`${activeMachinery.length} Active`}
                secondary={[
                  serviceDueMachinery.length > 0 && `${serviceDueMachinery.length} service due`,
                  maintenanceMachinery.length > 0 && `${maintenanceMachinery.length} maintenance`,
                  storedMachinery.length > 0 && `${storedMachinery.length} stored`,
                  soldMachinery.length > 0 && `${soldMachinery.length} sold`,
                ].filter(Boolean).join(' · ') || 'All available'}
                badge={serviceDueMachinery.length > 0 ? serviceDueMachinery.length : null}
                badgeColor="var(--color-amber-500)"
                onClick={() => handleWidgetExpand('machinery')}
              />
            )}
            <WidgetCard
              icon={unreadCount > 0 ? 'notifications_active' : 'notifications'}
              iconColor={unreadCount > 0 ? 'var(--color-amber-500)' : 'var(--color-slate-400)'}
              label="Notifications"
              primary={userNotifs.length === 0 ? 'No notifications' : `${userNotifs.length} notification${userNotifs.length > 1 ? 's' : ''}`}
              secondary={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              badge={unreadCount > 0 ? unreadCount : null}
              badgeColor="var(--color-amber-500)"
              onClick={() => handleWidgetExpand('notifications')}
            />
            <WidgetCard
              icon="history"
              label="Activity"
              primary={`${activityFeed.length} Events`}
              secondary="Today's log"
              onClick={() => handleWidgetExpand('activity')}
            />
          </div>
        </div>
      </div>

      {/* Widget expansion overlay */}
      {effectiveExpandedWidget !== null && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            top: 'var(--topbar-height)',
            bottom: 'var(--bottom-nav-height)',
            background: 'var(--color-surface-50)',
            zIndex: 40,
            overflowY: 'auto',
          }}
        >
          {renderExpandedContent()}
        </div>
      )}
    </div>
  )
}
