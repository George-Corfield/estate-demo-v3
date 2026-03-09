import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatShortDate } from '../../utils/dates'
import { STAFF_STATUS_COLORS, getDocExpiryStatus } from '../../data/staff'
import TabBar from '../../components/shared/TabBar'
import StaffCreateForm from './StaffCreateForm'
import StaffLeaveTab from './StaffLeaveTab'
import { ProfileCircle } from './StaffListView'

const TABS = [
  { id: 'details', label: 'Details' },
  { id: 'work', label: 'Work' },
  { id: 'leave', label: 'Leave' },
  { id: 'documents', label: 'Documents' },
]

const DOC_STATUS_COLORS = {
  'Valid': 'badge-healthy',
  'Expiring Soon': 'badge-attention',
  'Expired': 'badge-danger',
}

export default function StaffDetailView({ staffId, onClose }) {
  const { staff, tasks, absences, archiveStaff, reportSick, confirmSick, cancelSickReport, endSickLeave, showToast } = useApp()
  const [activeTab, setActiveTab] = useState('details')
  const [editing, setEditing] = useState(false)
  const [archiveStep, setArchiveStep] = useState(0)
  const [sickReportStep, setSickReportStep] = useState(0)
  const [sickConfirmForm, setSickConfirmForm] = useState({ paidStatus: 'paid', notes: '' })
  const navigate = useNavigate()

  const member = useMemo(() => staff.find(s => s.id === staffId), [staff, staffId])

  if (!member) return null

  const badgeClass = STAFF_STATUS_COLORS[member.status] || 'badge-neutral'

  const activeTasks = tasks.filter(t =>
    t.assignedTo.includes(member.name) && (t.status === 'todo' || t.status === 'inProgress')
  )

  const doneTasks = tasks
    .filter(t => t.assignedTo.includes(member.name) && t.status === 'done')
    .sort((a, b) => (b.completedDate || '').localeCompare(a.completedDate || ''))
    .slice(0, 5)

  const employeeRecords = (member.documents || []).filter(d => d.type === 'Employee Records')
  const qualifications = (member.documents || []).filter(d => d.type === 'Qualifications & Certificates')

  const pendingAbsence = absences.find(a => a.staffId === member.id && a.type === 'sick' && a.status === 'pending')

  const handleArchive = () => {
    if (archiveStep === 0) {
      setArchiveStep(1)
      setTimeout(() => setArchiveStep(0), 5000)
    } else {
      archiveStaff(member.id)
      showToast(`${member.name} archived`)
      onClose()
    }
  }

  const handleReportSick = () => {
    if (sickReportStep === 0) {
      setSickReportStep(1)
      setTimeout(() => setSickReportStep(0), 5000)
    } else {
      reportSick(member.id)
      showToast(`${member.name} reported sick`)
      setSickReportStep(0)
    }
  }

  const handleConfirmSick = () => {
    if (!pendingAbsence) return
    confirmSick(member.id, pendingAbsence.id, {
      paidStatus: sickConfirmForm.paidStatus,
      confirmedBy: 'staff-01',
      notes: sickConfirmForm.notes,
    })
    showToast(`${member.name} confirmed sick (${sickConfirmForm.paidStatus})`)
    setSickConfirmForm({ paidStatus: 'paid', notes: '' })
  }

  const handleCancelSick = () => {
    if (!pendingAbsence) return
    cancelSickReport(member.id, pendingAbsence.id)
    showToast(`Sick report cancelled for ${member.name}`)
  }

  const handleEndSick = () => {
    endSickLeave(member.id)
    showToast(`${member.name} marked available`)
  }

  const accentColor = (member.status === 'Available' || member.status === 'On Task')
    ? 'var(--color-green-500)'
    : (member.status === 'Sick' || member.status === 'Pending Sick Confirmation')
      ? 'var(--color-amber-400)'
      : 'transparent'

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Panel Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--color-surface-300)',
        background: 'var(--color-surface-100)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <button
          onClick={onClose}
          className="btn btn-ghost"
          style={{ padding: 4, marginBottom: 8 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-slate-400)' }}>arrow_back</span>
        </button>
        <div className="flex items-center gap-4">
          {/* Square profile pic with accent stripe */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-green-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontFamily: 'var(--font-heading)',
              fontSize: 22,
              fontWeight: 700,
              borderLeft: `3px solid ${accentColor}`,
            }}>
              {member.initials || <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#fff' }}>person</span>}
            </div>
          </div>
          <div className="flex-1 flex justify-between min-w-0">
            <div className="flex flex-col justify-center">
              <h2 className="text-heading-3" style={{ color: 'var(--color-slate-900)', margin: 0 }}>{member.name}</h2>
              <p className="text-body-small" style={{ color: 'var(--color-slate-500)', margin: 0 }}>
              {member.role}{member.team ? ` · ${member.team}` : ''}{member.permissionLevel ? ` · ${member.permissionLevel}` : ''}
              </p>
              <p className="text-body-small" style={{ color: 'var(--color-slate-500)', margin: 0 }}>
                {member.email}{member.mobile ? ` · ${member.mobile}` : ''}
              </p>
            </div>
            <div className='flex flex-col justify-center items-center'>
              <span className={`badge ${badgeClass}`}>{member.status}</span>
              <button onClick={() => setEditing(!editing)} className="btn btn-ghost" style={{ marginTop: 6, padding: '4px 8px', fontSize: 12 }}>
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Report Sick button for Available / Off Duty */}
        {(member.status === 'Available' || member.status === 'Off Duty') && (
          <div style={{ marginTop: 8 }}>
            {sickReportStep === 0 ? (
              <button onClick={handleReportSick} className="btn btn-ghost" style={{ color: 'var(--color-amber-400)', fontSize: 12 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>sick</span>
                Report Sick
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-amber-400)' }}>Report sick?</span>
                <button onClick={handleReportSick} className="btn btn-ghost" style={{ color: 'var(--color-amber-400)', fontWeight: 600 }}>Confirm</button>
                <button onClick={() => setSickReportStep(0)} className="btn btn-ghost">Cancel</button>
              </div>
            )}
          </div>
        )}

        {/* Pending Sick Confirmation form */}
        {member.status === 'Pending Sick Confirmation' && (
          <div style={{ marginTop: 12, padding: 12, background: 'var(--color-surface-200)', borderRadius: 'var(--radius-md)' }}>
            <p className="text-label" style={{ color: 'var(--color-amber-400)', marginBottom: 8 }}>Confirm Sick Report</p>
            <div className="flex items-center gap-4" style={{ marginBottom: 8 }}>
              <label className="flex items-center gap-1" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-slate-700)' }}>
                <input
                  type="radio"
                  name="paidStatus"
                  value="paid"
                  checked={sickConfirmForm.paidStatus === 'paid'}
                  onChange={() => setSickConfirmForm(prev => ({ ...prev, paidStatus: 'paid' }))}
                />
                Paid
              </label>
              <label className="flex items-center gap-1" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-slate-700)' }}>
                <input
                  type="radio"
                  name="paidStatus"
                  value="unpaid"
                  checked={sickConfirmForm.paidStatus === 'unpaid'}
                  onChange={() => setSickConfirmForm(prev => ({ ...prev, paidStatus: 'unpaid' }))}
                />
                Unpaid
              </label>
            </div>
            <textarea
              value={sickConfirmForm.notes}
              onChange={e => setSickConfirmForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Notes (optional)"
              className="form-input"
              style={{ width: '100%', minHeight: 48, marginBottom: 8 }}
            />
            <div className="flex gap-2">
              <button onClick={handleConfirmSick} className="btn btn-primary" style={{ fontSize: 12 }}>Confirm Sick</button>
              <button onClick={handleCancelSick} className="btn btn-secondary" style={{ fontSize: 12 }}>Cancel Report</button>
            </div>
          </div>
        )}

        {/* Mark Available button when Sick */}
        {member.status === 'Sick' && (
          <div style={{ marginTop: 8 }}>
            <button onClick={handleEndSick} className="btn btn-ghost" style={{ color: 'var(--color-green-600)', fontSize: 12 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
              Mark Available
            </button>
          </div>
        )}
      </div>

      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Edit Form */}
        {editing && (
          <div style={{ padding: 16 }}>
            <StaffCreateForm
              editData={member}
              onCancel={() => setEditing(false)}
              onSave={() => setEditing(false)}
            />
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && !editing && (
          <div style={{ padding: 20 }} className='flex flex-col gap-5'>
            <FieldSection title="Employee Information">
              <FieldRow label="Full Name" value={member.name} />
              <FieldRow label="Email" value={member.email} />
              <FieldRow label="Mobile" value={member.mobile} />
              <FieldRow label="Address" value={member.address} />
              <FieldRow label="Emergency Contact" value={member.emergencyContact ? `${member.emergencyContact.name} — ${member.emergencyContact.number}` : '—'} />
            </FieldSection>

            <FieldSection title="Contract Information">
              <FieldRow label="Start Date" value={member.startDate ? formatShortDate(member.startDate) : '—'} />
              <FieldRow label="Contract Type" value={member.contractType} />
              <FieldRow label="Hours Per Week" value={member.hoursPerWeek != null ? String(member.hoursPerWeek) : '—'} mono />
              <FieldRow label="Hourly Rate" value={member.hourlyRate != null ? `£${member.hourlyRate.toFixed(2)}` : '—'} mono />
            </FieldSection>

            <FieldSection title="Leave Entitlements">
              <FieldRow label="Annual Leave" value={`${member.annualLeaveEntitlement || 28} days`} />
              <FieldRow label="Sick Allowance" value={`${member.sickLeaveAllowance || 8} days`} />
            </FieldSection>

            {/* Archive action */}
            <div style={{ padding: 16 }}>
              {archiveStep === 0 ? (
                <button onClick={handleArchive} className="btn btn-ghost" style={{ color: 'var(--color-amber-400)' }}>
                  Archive
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-amber-400)' }}>Are you sure?</span>
                  <button onClick={handleArchive} className="btn btn-ghost" style={{ color: 'var(--color-amber-400)', fontWeight: 600 }}>Confirm</button>
                  <button onClick={() => setArchiveStep(0)} className="btn btn-ghost">Cancel</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Work Tab */}
        {activeTab === 'work' && !editing && (
          <div style={{ padding: 16 }} className="flex flex-col gap-5">
            {/* Role & Team */}
            <div className="card" style={{ padding: '12px 16px' }}>
              <p className="text-label" style={{ color: 'var(--color-slate-400)', marginBottom: 4 }}>Role & Team</p>
              <p className="text-heading-4" style={{ color: 'var(--color-slate-900)', margin: 0 }}>
                {member.role || 'No role assigned'}
              </p>
              {member.team && (
                <p className="text-body-small" style={{ color: 'var(--color-slate-500)', margin: 0 }}>{member.team}</p>
              )}
            </div>

            {/* Active Tasks */}
            <div>
              <h3 className="text-label mb-3" style={{ color: 'var(--color-slate-400)' }}>
                Active Tasks ({activeTasks.length})
              </h3>
              {activeTasks.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {activeTasks.map(task => (
                    <button
                      key={task.id}
                      onClick={() => navigate('/tasks', { state: { openTaskId: task.id } })}
                      className="w-full text-left flex items-center justify-between"
                      style={{
                        padding: '8px 12px',
                        background: 'var(--color-surface-100)',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        color: 'var(--color-slate-900)',
                        transition: 'all 120ms ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(78,140,53,0.08)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface-100)' }}
                    >
                      <span>{task.name}</span>
                      <span className="badge badge-neutral">
                        {task.status === 'todo' ? 'To Do' : 'In Progress'}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-body" style={{ color: 'var(--color-slate-400)' }}>No active tasks</p>
              )}
            </div>

            {/* Activity History */}
            <div>
              <h3 className="text-label mb-3" style={{ color: 'var(--color-slate-400)' }}>
                Activity History
              </h3>
              {doneTasks.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {doneTasks.map(task => (
                    <button
                      key={task.id}
                      onClick={() => navigate('/tasks', { state: { openTaskId: task.id } })}
                      className="w-full text-left flex items-center justify-between"
                      style={{
                        padding: '8px 12px',
                        background: 'var(--color-surface-100)',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        color: 'var(--color-slate-900)',
                        transition: 'all 120ms ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(78,140,53,0.08)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface-100)' }}
                    >
                      <span>{task.name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-slate-400)', whiteSpace: 'nowrap' }}>
                        {task.completedDate ? formatShortDate(task.completedDate) : 'Done'}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-body" style={{ color: 'var(--color-slate-400)' }}>No completed tasks</p>
              )}
            </div>
          </div>
        )}

        {/* Leave Tab */}
        {activeTab === 'leave' && !editing && (
          <StaffLeaveTab member={member} />
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && !editing && (
          <div style={{ padding: 16 }} className="flex flex-col gap-5">
            {/* Employee Records */}
            <div>
              <h3 className="text-label mb-3" style={{ color: 'var(--color-slate-400)' }}>Employee Records</h3>
              {employeeRecords.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {employeeRecords.map(doc => (
                    <div key={doc.id} className="flex items-center gap-3" style={{ padding: '10px 16px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-slate-400)' }}>description</span>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-slate-900)', margin: 0 }}>{doc.name}</p>
                      </div>
                      <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-slate-400)', cursor: 'pointer' }}>download</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-body" style={{ color: 'var(--color-slate-400)' }}>No employee records</p>
              )}
            </div>

            {/* Qualifications & Certificates */}
            <div>
              <h3 className="text-label mb-3" style={{ color: 'var(--color-slate-400)' }}>Qualifications & Certificates</h3>
              {qualifications.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {qualifications.map(doc => {
                    const expiryStatus = doc.expiryDate ? getDocExpiryStatus(doc.expiryDate) : null
                    const expiryBadgeClass = expiryStatus ? (DOC_STATUS_COLORS[expiryStatus] || 'badge-neutral') : null

                    return (
                      <div key={doc.id} className="flex items-center gap-3" style={{ padding: '10px 16px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-slate-400)' }}>verified</span>
                        <div className="flex-1 min-w-0">
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-slate-900)', margin: 0 }}>{doc.name}</p>
                          {doc.expiryDate && (
                            <p className="text-label-small" style={{ color: 'var(--color-slate-400)', margin: 0 }}>
                              Expires: {formatShortDate(doc.expiryDate)}
                            </p>
                          )}
                        </div>
                        {expiryStatus && <span className={`badge ${expiryBadgeClass}`}>{expiryStatus}</span>}
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-slate-400)', cursor: 'pointer' }}>download</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-body" style={{ color: 'var(--color-slate-400)' }}>No qualifications on file</p>
              )}
            </div>

            <button className="btn btn-ghost" style={{ alignSelf: 'flex-start' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
              Upload document
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function FieldRow({ label, value }) {
  return (
    <div style={{ padding: 12, background: 'var(--color-surface-100)', borderRadius: 'var(--radius-md)' }}>
      <p className="text-label" style={{ color: 'var(--color-slate-400)', marginBottom: 4 }}>{label}</p>
      <p className="text-body" style={{ color: 'var(--color-slate-900)', fontWeight: 500, margin: 0 }}>{value}</p>
    </div>
  )
}

function FieldSection({ title, children }) {
  return (
    <div>
      <div style={{ padding: '12px 16px', borderBottom: '2px solid var(--color-surface-300)' }}>
        <h3 className="text-label-large" style={{ color: 'var(--color-slate-400)', margin: 0 }}>{title}</h3>
      </div>
      <div className='grid grid-cols-2 gap-3' style={{paddingTop: '12px'}}>
        {children}
      </div>
    </div>
  )
}
