export const ROLES = {
  FARM_MANAGER: 'farm_manager',
  FARM_WORKER: 'farm_worker',
}

export const USERS = [
  {
    id: 'staff-01',
    name: 'John Smith',
    initials: 'JS',
    role: ROLES.FARM_MANAGER,
    roleLabel: 'Farm Manager',
  },
  {
    id: 'staff-04',
    name: 'Mike Williams',
    initials: 'MW',
    role: ROLES.FARM_WORKER,
    roleLabel: 'Farm Worker',
  },
]

export const DEFAULT_USER = USERS[0]
