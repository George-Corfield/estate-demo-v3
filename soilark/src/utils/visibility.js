import { ROLES } from '../constants/roles'

export function isTaskVisibleToUser(task, currentUser, allStaff) {
  if (currentUser.role === ROLES.FARM_MANAGER) return true
  const staffRecord = allStaff.find(s => s.id === currentUser.id)
  if (!staffRecord) return false
  if (task.assignedTo?.includes(staffRecord.name)) return true
  if (staffRecord.team && task.assignedTeams?.includes(staffRecord.team)) return true
  return false
}
