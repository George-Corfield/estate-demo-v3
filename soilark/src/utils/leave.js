export function getLeaveBalance(absences, staffMember, year) {
  const entitlement = staffMember.annualLeaveEntitlement || 28
  const used = absences
    .filter(a =>
      a.staffId === staffMember.id &&
      a.type === 'holiday' &&
      a.status === 'confirmed' &&
      new Date(a.startDate).getFullYear() === year
    )
    .reduce((sum, a) => sum + a.days, 0)

  return { entitlement, used, remaining: entitlement - used }
}

export function getSickBalance(absences, staffMember, year) {
  const allowance = staffMember.sickLeaveAllowance || 8
  const used = absences
    .filter(a =>
      a.staffId === staffMember.id &&
      a.type === 'sick' &&
      a.status === 'confirmed' &&
      new Date(a.startDate).getFullYear() === year
    )
    .reduce((sum, a) => sum + a.days, 0)

  return { allowance, used, remaining: allowance - used, exceeded: used > allowance }
}

export function getStaffAlerts(absences, staffMember, year) {
  const alerts = []
  const sick = getSickBalance(absences, staffMember, year)
  const leave = getLeaveBalance(absences, staffMember, year)

  if (sick.exceeded) {
    alerts.push({ type: 'warning', message: 'Sick allowance exceeded' })
  }

  if (leave.remaining === 0) {
    alerts.push({ type: 'info', message: 'Annual leave allowance fully used' })
  }

  // Absence pattern: 4+ absences in last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentAbsences = absences.filter(a =>
    a.staffId === staffMember.id &&
    a.status === 'confirmed' &&
    new Date(a.startDate) >= thirtyDaysAgo
  )
  if (recentAbsences.length >= 4) {
    alerts.push({ type: 'info', message: `Absence pattern: ${recentAbsences.length} absences in 30 days` })
  }

  return alerts
}
