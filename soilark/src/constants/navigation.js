import { ROLES } from './roles'

const bothRoles = [ROLES.FARM_MANAGER, ROLES.FARM_WORKER]
const managerOnly = [ROLES.FARM_MANAGER]

export const NAV_ITEMS = [
  { icon: 'map', label: 'Overview', path: '/', enabled: true, allowedRoles: bothRoles },
  { icon: 'dashboard', label: 'Fields', path: '/fields', enabled: true, allowedRoles: bothRoles },
  { icon: 'assignment', label: 'Tasks', path: '/tasks', enabled: true, allowedRoles: bothRoles },
  { icon: 'people', label: 'Staff', path: '/staff', enabled: true, allowedRoles: managerOnly },
  { icon: 'agriculture', label: 'Machinery', path: '/machinery', enabled: true, allowedRoles: managerOnly },
  { icon: 'analytics', label: 'Operations', path: '/operations', enabled: false, allowedRoles: managerOnly },
]
