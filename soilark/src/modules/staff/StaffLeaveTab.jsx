import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { formatShortDate } from '../../utils/dates'
import { getLeaveBalance, getSickBalance, getStaffAlerts } from '../../utils/leave'

export default function StaffLeaveTab({ member }) {
  const { absences, addAbsence, showToast } = useApp()
  const [showBookHoliday, setShowBookHoliday] = useState(false)
  const [holidayForm, setHolidayForm] = useState({ startDate: '', endDate: '', notes: '' })

  const year = new Date().getFullYear()
  const leave = useMemo(() => getLeaveBalance(absences, member, year), [absences, member, year])
  const sick = useMemo(() => getSickBalance(absences, member, year), [absences, member, year])
  const alerts = useMemo(() => getStaffAlerts(absences, member, year), [absences, member, year])

  const memberAbsences = useMemo(() =>
    absences
      .filter(a => a.staffId === member.id && a.status !== 'cancelled')
      .sort((a, b) => b.startDate.localeCompare(a.startDate)),
    [absences, member.id]
  )

  const holidayDays = useMemo(() => {
    if (!holidayForm.startDate || !holidayForm.endDate) return 0
    const start = new Date(holidayForm.startDate)
    const end = new Date(holidayForm.endDate)
    if (end < start) return 0
    return Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1
  }, [holidayForm.startDate, holidayForm.endDate])

  const handleBookHoliday = () => {
    if (!holidayForm.startDate || !holidayForm.endDate || holidayDays < 1) return
    addAbsence({
      id: `abs-${Date.now()}`,
      staffId: member.id,
      type: 'holiday',
      status: 'confirmed',
      startDate: holidayForm.startDate,
      endDate: holidayForm.endDate,
      days: holidayDays,
      paidStatus: 'paid',
      reportedAt: new Date().toISOString(),
      confirmedBy: 'staff-01',
      confirmedAt: new Date().toISOString(),
      notes: holidayForm.notes,
    })
    showToast(`Holiday booked for ${member.name} (${holidayDays} days)`)
    setHolidayForm({ startDate: '', endDate: '', notes: '' })
    setShowBookHoliday(false)
  }

  const leavePercent = leave.entitlement > 0 ? Math.min(100, (leave.used / leave.entitlement) * 100) : 0
  const sickPercent = sick.allowance > 0 ? Math.min(100, (sick.used / sick.allowance) * 100) : 0

  return (
    <div style={{ padding: 16 }} className="flex flex-col gap-5">
      {/* Allowance Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Annual Leave */}
        <div className="card" style={{ padding: '16px' }}>
          <p className="text-label" style={{ color: 'var(--color-slate-400)', marginBottom: 8 }}>Annual Leave</p>
          <div style={{ height: 6, background: 'var(--color-surface-200)', borderRadius: 3, marginBottom: 8 }}>
            <div style={{
              height: '100%',
              borderRadius: 3,
              width: `${leavePercent}%`,
              background: leave.remaining < 5 ? 'var(--color-amber-400)' : 'var(--color-green-500)',
              transition: 'width 300ms ease',
            }} />
          </div>
          <p className="text-body-small" style={{ color: 'var(--color-slate-600)', margin: 0 }}>
            {leave.used} / {leave.entitlement} used, <strong>{leave.remaining} remaining</strong>
          </p>
        </div>

        {/* Sick Leave */}
        <div className="card" style={{ padding: '16px' }}>
          <p className="text-label" style={{ color: 'var(--color-slate-400)', marginBottom: 8 }}>Sick Leave</p>
          <div style={{ height: 6, background: 'var(--color-surface-200)', borderRadius: 3, marginBottom: 8 }}>
            <div style={{
              height: '100%',
              borderRadius: 3,
              width: `${sickPercent}%`,
              background: sick.exceeded ? 'var(--color-red-500, #ef4444)' : 'var(--color-amber-400)',
              transition: 'width 300ms ease',
            }} />
          </div>
          <p className="text-body-small" style={{ color: 'var(--color-slate-600)', margin: 0 }}>
            {sick.used} / {sick.allowance} used, <strong>{sick.remaining > 0 ? sick.remaining : 0} remaining</strong>
            {sick.exceeded && <span style={{ color: 'var(--color-red-500, #ef4444)' }}> (exceeded by {Math.abs(sick.remaining)})</span>}
          </p>
        </div>
      </div>

      {/* Smart Alerts */}
      {alerts.length > 0 && (
        <div className="flex flex-col gap-2">
          {alerts.map((alert, i) => (
            <div
              key={i}
              style={{
                padding: '10px 14px',
                background: alert.type === 'warning' ? 'rgba(245,158,11,0.08)' : 'var(--color-surface-100)',
                borderRadius: 'var(--radius-md)',
                borderLeft: `3px solid ${alert.type === 'warning' ? 'var(--color-amber-400)' : 'var(--color-slate-300)'}`,
              }}
            >
              <p className="text-body-small" style={{ color: 'var(--color-slate-700)', margin: 0 }}>
                {alert.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Book Holiday */}
      <div>
        {!showBookHoliday ? (
          <button onClick={() => setShowBookHoliday(true)} className="btn btn-ghost" style={{ alignSelf: 'flex-start' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
            Book Holiday
          </button>
        ) : (
          <div className="card" style={{ padding: 16 }}>
            <p className="text-label" style={{ color: 'var(--color-slate-400)', marginBottom: 12 }}>Book Holiday</p>
            <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 8 }}>
              <div>
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  value={holidayForm.startDate}
                  onChange={e => setHolidayForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  value={holidayForm.endDate}
                  onChange={e => setHolidayForm(prev => ({ ...prev, endDate: e.target.value }))}
                  className="form-input"
                />
              </div>
            </div>
            {holidayDays > 0 && (
              <p className="text-body-small" style={{ color: 'var(--color-slate-600)', marginBottom: 8 }}>
                {holidayDays} day{holidayDays !== 1 ? 's' : ''}
              </p>
            )}
            <textarea
              value={holidayForm.notes}
              onChange={e => setHolidayForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Notes (optional)"
              className="form-input"
              style={{ width: '100%', minHeight: 48, marginBottom: 8 }}
            />
            <div className="flex gap-2">
              <button onClick={handleBookHoliday} className="btn btn-primary" style={{ fontSize: 12 }} disabled={holidayDays < 1}>Book</button>
              <button onClick={() => { setShowBookHoliday(false); setHolidayForm({ startDate: '', endDate: '', notes: '' }) }} className="btn btn-secondary" style={{ fontSize: 12 }}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Absence History */}
      <div>
        <h3 className="text-label mb-3" style={{ color: 'var(--color-slate-400)' }}>
          Absence History ({memberAbsences.length})
        </h3>
        {memberAbsences.length > 0 ? (
          <div className="flex flex-col gap-2">
            {memberAbsences.map(absence => (
              <div
                key={absence.id}
                style={{
                  padding: '10px 14px',
                  background: 'var(--color-surface-100)',
                  borderRadius: 'var(--radius-md)',
                }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className={`badge ${absence.type === 'sick' ? 'badge-attention' : 'badge-neutral'}`}>
                    {absence.type === 'sick' ? 'Sick' : 'Holiday'}
                  </span>
                  <div>
                    <p className="text-body-small" style={{ color: 'var(--color-slate-900)', margin: 0 }}>
                      {formatShortDate(absence.startDate)}
                      {absence.endDate && absence.endDate !== absence.startDate ? ` — ${formatShortDate(absence.endDate)}` : ''}
                    </p>
                    {absence.notes && (
                      <p className="text-body-small" style={{ color: 'var(--color-slate-400)', margin: 0 }}>{absence.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-slate-500)' }}>
                    {absence.days} day{absence.days !== 1 ? 's' : ''}
                  </span>
                  {absence.paidStatus && (
                    <span className="badge badge-neutral" style={{ fontSize: 10 }}>
                      {absence.paidStatus}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-body" style={{ color: 'var(--color-slate-400)' }}>No absence records</p>
        )}
      </div>
    </div>
  )
}
