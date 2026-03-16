import { formatDateKey } from './dates'

export function aggregateEvents(fields, tasks, customEvents = [], machinery = []) {
  const events = []

  tasks.forEach(task => {
    if (task.dueDate) {
      events.push({
        id: `task-${task.id}`,
        date: task.dueDate,
        title: task.name,
        type: 'task',
        subType: task.type?.toLowerCase() || 'task',
        priority: task.priority,
        assignedTo: task.assignedTo,
        fieldIds: task.fieldIds,
        sourceId: task.id,
      })
    }
  })

  fields.forEach(field => {
    (field.activities || []).forEach(activity => {
      const actDate = activity.timestamp
        ? activity.timestamp.split('T')[0]
        : activity.date
      events.push({
        id: `field-${activity.id}`,
        date: actDate,
        title: activity.title,
        type: 'task',
        subType: activity.type?.toLowerCase() || 'task',
        fieldName: field.name,
        user: activity.completedBy || activity.user,
        details: activity.details,
        sourceId: field.id,
      })
    })
  })

  customEvents.forEach(evt => {
    events.push({
      ...evt,
      type: evt.type || 'custom',
      subType: evt.type?.toLowerCase(),
    })
  })

  machinery.forEach(equip => {
    (equip.serviceHistory || []).forEach(svc => {
      const typeLabel = svc.type || 'Service'
      const subType = typeLabel.toLowerCase().includes('mot') ? 'mot'
        : typeLabel.toLowerCase().includes('repair') ? 'service'
        : 'service'
      events.push({
        id: `mach-svc-${svc.id}`,
        date: svc.date,
        title: `${typeLabel} — ${equip.name}`,
        type: 'service',
        subType,
        description: svc.notes || '',
        machineryName: equip.name,
        sourceId: equip.id,
      })
    })
  })

  return events
}

export function getEventsForDate(events, date) {
  const key = formatDateKey(date)
  return events.filter(e => formatDateKey(e.date) === key)
}

export function getEventCountsByType(events, date) {
  const dayEvents = getEventsForDate(events, date)
  const counts = {}
  dayEvents.forEach(e => {
    counts[e.type] = (counts[e.type] || 0) + 1
  })
  return counts
}
