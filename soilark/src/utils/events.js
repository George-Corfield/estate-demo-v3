import { formatDateKey } from './dates'

export function aggregateEvents(fields, tasks, customEvents = []) {
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
      events.push({
        id: `field-${activity.id}`,
        date: activity.date,
        title: activity.title,
        type: 'task',
        subType: activity.type?.toLowerCase() || 'task',
        fieldName: field.name,
        user: activity.user,
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
