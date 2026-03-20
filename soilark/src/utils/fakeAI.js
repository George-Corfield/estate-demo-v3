function nextFriday() {
  const today = new Date()
  const day = today.getDay() // 0=Sun, 5=Fri
  const daysUntilFriday = ((5 - day + 7) % 7) || 7 // if today is Friday, next Friday is 7 days
  const date = new Date(today)
  date.setDate(today.getDate() + daysUntilFriday)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function generateTask(description, fields, machinery) {
  const wheatFields = fields.filter(f => f.usage === 'Wheat').map(f => f.id)
  const harvester = machinery?.find(m => m.type === 'Combine Harvester')

  return {
    form: {
      name: 'Wheat Harvest — All Fields',
      type: 'Harvesting',
      description: 'Harvest all wheat fields. Prioritise dry weather windows. Claas Lexion 8000 assigned — confirm grain trailer availability before starting.',
      priority: 'high',
    },
    dueDate: nextFriday(),
    fieldIds: wheatFields,
    assignedMachinery: harvester ? [harvester.name] : [],
  }
}
