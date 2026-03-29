import { createContext, useContext, useReducer, useCallback } from 'react'
import { initialFields } from '../data/fields'
import { initialTasks } from '../data/tasks'
import { initialEvents } from '../data/events'
import { initialMachinery } from '../data/machinery'
import { initialStaff } from '../data/staff'
import { initialAbsences } from '../data/absences'
import { initialUsages } from '../data/usages'
import { DEFAULT_USER } from '../constants/roles'

const AppContext = createContext(null)

const initialState = {
  fields: initialFields,
  tasks: initialTasks,
  customEvents: initialEvents,
  machinery: initialMachinery,
  staff: initialStaff,
  absences: initialAbsences,
  usages: initialUsages,
  toasts: [],
  notifications: [],
  currentUser: DEFAULT_USER,
  aiEnabled: false,
}

let toastId = 0

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        fields: state.fields.map(f =>
          f.id === action.id ? { ...f, ...action.updates } : f
        ),
      }
    case 'ADD_FIELD_ACTIVITY':
      return {
        ...state,
        fields: state.fields.map(f =>
          f.id === action.fieldId
            ? { ...f, activities: [action.activity, ...f.activities] }
            : f
        ),
      }
    case 'ADD_TASK': {
      const newTask = action.task
      const fieldIdsForTask = newTask.fieldIds || []
      const machNamesForTask = newTask.assignedMachinery || []
      const now = new Date().toISOString()
      const machTaskEntry = {
        id: `mhist-${Date.now()}`,
        timestamp: now,
        type: 'task_assigned',
        description: `Task "${newTask.name}" created and assigned`,
        taskId: newTask.id,
        taskName: newTask.name,
      }
      const updatedMachinery = machNamesForTask.length === 0
        ? state.machinery
        : state.machinery.map(m => {
            if (!machNamesForTask.includes(m.name)) return m
            return { ...m, history: [machTaskEntry, ...(m.history || [])] }
          })
      if (fieldIdsForTask.length === 0) {
        return { ...state, tasks: [...state.tasks, newTask], machinery: updatedMachinery }
      }
      return {
        ...state,
        tasks: [...state.tasks, newTask],
        machinery: updatedMachinery,
        fields: state.fields.map(f => {
          if (!fieldIdsForTask.includes(f.id)) return f
          const entry = {
            id: `hist-${Date.now()}-${f.id}`,
            timestamp: now,
            type: 'task',
            title: `${newTask.name} — Task Created`,
            completedBy: 'System',
            details: `Task "${newTask.name}" was created and linked to this field.`,
            notes: null,
            linkedTaskId: newTask.id,
            taskAction: 'created',
            linkedEventId: null,
            machineryUsed: null,
            inputUsed: null,
            quantity: null,
            rate: null,
            units: null,
            evidence: [],
            source: 'task-system',
          }
          return { ...f, activities: [entry, ...f.activities] }
        }),
      }
    }
    case 'UPDATE_TASK': {
      const prev = state.tasks.find(t => t.id === action.id)
      const updated = { ...prev, ...action.updates }
      const prevAssigned = prev?.assignedTo || []
      const newAssigned = action.updates.assignedTo || prevAssigned
      const newlyAdded = newAssigned.filter(name => !prevAssigned.includes(name))
      const newNotifs = newlyAdded.flatMap(name => {
        const member = state.staff.find(s => s.name === name)
        if (!member) return []
        return [{
          id: `notif-${Date.now()}-${member.id}`,
          forUserId: member.id,
          message: `You've been assigned to "${updated.name}"`,
          type: 'info',
          read: false,
          timestamp: new Date().toISOString(),
          taskId: updated.id,
        }]
      })
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === action.id ? updated : t),
        notifications: [...newNotifs, ...state.notifications],
      }
    }
    case 'MOVE_TASK': {
      const movedTask = state.tasks.find(t => t.id === action.id)
      const taskFieldIds = movedTask?.fieldIds || []
      const nowMove = new Date().toISOString()
      const isStarted = action.status === 'inProgress'
      const isCompleted = action.status === 'done'
      const isPaused = action.status === 'paused'
      const isCancelled = action.status === 'cancelled'
      const isResumed = isStarted && movedTask?.status === 'paused'
      const shouldAddHistory = (isStarted || isCompleted || isPaused || isCancelled) && taskFieldIds.length > 0

      let taskActionLabel = null
      let taskActionTitle = null
      let historyDetails = ''
      let histMachinery = null
      let histInput = null
      let histQuantity = null
      let histRate = null
      let histUnits = null
      let histEvidence = []

      if (shouldAddHistory && movedTask) {
        if (isPaused) {
          taskActionLabel = 'paused'
          taskActionTitle = `${movedTask.name} - Paused: ${action.reason}`
          historyDetails = action.note || `Task "${movedTask.name}" has been paused. Reason: ${action.reason}`
          if (action.photo) histEvidence = [{ name: action.photo.name, type: 'image' }]
        } else if (isCancelled) {
          taskActionLabel = 'cancelled'
          taskActionTitle = `${movedTask.name} - Cancelled: ${action.reason}`
          historyDetails = action.note || `Task "${movedTask.name}" has been cancelled. Reason: ${action.reason}`
          if (action.photo) histEvidence = [{ name: action.photo.name, type: 'image' }]
        } else if (isResumed) {
          taskActionLabel = 'resumed'
          taskActionTitle = `${movedTask.name} - Resumed`
          historyDetails = `Task "${movedTask.name}" has been resumed.`
        } else if (isStarted) {
          taskActionLabel = 'started'
          taskActionTitle = `${movedTask.name} — Started`
          historyDetails = `Task "${movedTask.name}" has been started.`
        } else {
          taskActionLabel = 'completed'
          taskActionTitle = `${movedTask.name} — Completed`
          historyDetails = `Task "${movedTask.name}" has been completed.`
          if (movedTask.typeFields) {
            const tf = movedTask.typeFields
            histInput = tf.product || tf.cropMix || tf.crop || null
            histQuantity = tf.totalApplied || tf.totalSeeds || null
            histRate = tf.applicationRate || tf.seedRate || null
            histUnits = tf.rateUnit || (tf.applicationRate ? 'kg/ha' : null)
          }
          if (movedTask.assignedMachinery?.length) {
            histMachinery = movedTask.assignedMachinery.join(', ')
          }
        }
      }

      const taskUpdates = {
        status: action.status,
        completedDate: isCompleted ? new Date().toISOString().split('T')[0] : (movedTask?.completedDate || null),
      }
      if (isPaused) {
        taskUpdates.pauseReason = action.reason
        taskUpdates.pauseNote = action.note || null
        taskUpdates.pausePhoto = action.photo || null
        taskUpdates.pausedDate = new Date().toISOString().split('T')[0]
      }
      if (isCancelled) {
        taskUpdates.cancelReason = action.reason
        taskUpdates.cancelNote = action.note || null
        taskUpdates.cancelPhoto = action.photo || null
        taskUpdates.cancelledDate = new Date().toISOString().split('T')[0]
      }

      const moveMachNames = movedTask?.assignedMachinery || []
      const moveMachEntry = movedTask ? {
        id: `mhist-${Date.now()}`,
        timestamp: nowMove,
        type: 'task_status',
        description: `Task "${movedTask.name}" → ${action.status}`,
        taskId: movedTask.id,
        taskName: movedTask.name,
      } : null
      const updatedMachineryMove = (moveMachNames.length === 0 || !moveMachEntry)
        ? state.machinery
        : state.machinery.map(m => {
            if (!moveMachNames.includes(m.name)) return m
            return { ...m, history: [moveMachEntry, ...(m.history || [])] }
          })

      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.id ? { ...t, ...taskUpdates } : t
        ),
        machinery: updatedMachineryMove,
        fields: shouldAddHistory
          ? state.fields.map(f => {
              if (!taskFieldIds.includes(f.id)) return f
              const entry = {
                id: `hist-${Date.now()}-${f.id}`,
                timestamp: nowMove,
                type: 'task',
                title: taskActionTitle,
                completedBy: movedTask.assignedTo?.[0] || 'System',
                details: historyDetails,
                notes: null,
                linkedTaskId: movedTask.id,
                taskAction: taskActionLabel,
                linkedEventId: null,
                machineryUsed: histMachinery,
                inputUsed: histInput,
                quantity: histQuantity,
                rate: histRate,
                units: histUnits,
                evidence: histEvidence,
                source: 'task-system',
              }
              return { ...f, activities: [entry, ...f.activities] }
            })
          : state.fields,
      }
    }
    case 'ADD_OBSERVATION': {
      // action: { entityType, entityId, observation }
      // entityType: 'fields' | 'tasks' | 'machinery' | 'staff'
      return {
        ...state,
        [action.entityType]: state[action.entityType].map(item =>
          item.id === action.entityId
            ? { ...item, observations: [action.observation, ...(item.observations || [])] }
            : item
        ),
      }
    }
    case 'ADD_COMMENT':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.taskId
            ? { ...t, comments: [...t.comments, action.comment] }
            : t
        ),
      }
    case 'ADD_MACHINERY':
      return { ...state, machinery: [...state.machinery, action.equipment] }
    case 'UPDATE_MACHINERY': {
      const changedKeys = Object.keys(action.updates).filter(k => k !== 'history')
      const machHistEntry = changedKeys.length ? {
        id: `mhist-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'details_update',
        description: `Updated: ${changedKeys.join(', ')}`,
      } : null
      return {
        ...state,
        machinery: state.machinery.map(m => {
          if (m.id !== action.id) return m
          return machHistEntry
            ? { ...m, ...action.updates, history: [machHistEntry, ...(m.history || [])] }
            : { ...m, ...action.updates }
        }),
      }
    }
    case 'ADD_SERVICE_RECORD': {
      const svcRecord = action.record
      const svcHistEntry = {
        id: `mhist-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'service_recorded',
        description: `${svcRecord.type} recorded — ${svcRecord.hoursAtService} hrs, £${svcRecord.cost}`,
      }
      return {
        ...state,
        machinery: state.machinery.map(m =>
          m.id === action.equipmentId
            ? { ...m, serviceHistory: [svcRecord, ...m.serviceHistory], history: [svcHistEntry, ...(m.history || [])] }
            : m
        ),
      }
    }
    case 'ADD_STAFF':
      return { ...state, staff: [...state.staff, action.member] }
    case 'UPDATE_STAFF':
      return {
        ...state,
        staff: state.staff.map(s =>
          s.id === action.id ? { ...s, ...action.updates } : s
        ),
      }
    case 'ARCHIVE_STAFF':
      return {
        ...state,
        staff: state.staff.map(s =>
          s.id === action.id ? { ...s, status: 'Archived' } : s
        ),
      }
    case 'REPORT_SICK': {
      const managerNotif = {
        id: `notif-${Date.now()}`,
        forUserId: 'staff-01',
        message: `${action.workerName} has requested sick leave`,
        type: 'warning',
        read: false,
        timestamp: new Date().toISOString(),
        relatedAbsenceId: action.absence.id,
        staffId: action.staffId,
      }
      return {
        ...state,
        staff: state.staff.map(s =>
          s.id === action.staffId ? { ...s, status: 'Pending Sick Confirmation' } : s
        ),
        absences: [...state.absences, action.absence],
        notifications: [managerNotif, ...state.notifications],
      }
    }
    case 'CONFIRM_SICK': {
      const workerApprovedNotif = {
        id: `notif-${Date.now()}`,
        forUserId: action.staffId,
        message: `Your sick leave has been approved (${action.paidStatus})`,
        type: 'success',
        read: false,
        timestamp: new Date().toISOString(),
        relatedAbsenceId: action.absenceId,
        staffId: action.staffId,
      }
      return {
        ...state,
        staff: state.staff.map(s =>
          s.id === action.staffId ? { ...s, status: 'Sick' } : s
        ),
        absences: state.absences.map(a =>
          a.id === action.absenceId
            ? { ...a, status: 'confirmed', paidStatus: action.paidStatus, confirmedBy: action.confirmedBy, confirmedAt: new Date().toISOString(), notes: action.notes || a.notes }
            : a
        ),
        notifications: [workerApprovedNotif, ...state.notifications],
      }
    }
    case 'CANCEL_SICK_REPORT': {
      const workerDeniedNotif = {
        id: `notif-${Date.now()}`,
        forUserId: action.staffId,
        message: 'Your sick leave request was not approved',
        type: 'warning',
        read: false,
        timestamp: new Date().toISOString(),
        relatedAbsenceId: action.absenceId,
        staffId: action.staffId,
      }
      return {
        ...state,
        staff: state.staff.map(s =>
          s.id === action.staffId ? { ...s, status: 'Available' } : s
        ),
        absences: state.absences.map(a =>
          a.id === action.absenceId ? { ...a, status: 'cancelled' } : a
        ),
        notifications: [workerDeniedNotif, ...state.notifications],
      }
    }
    case 'END_SICK_LEAVE':
      return {
        ...state,
        staff: state.staff.map(s =>
          s.id === action.staffId ? { ...s, status: 'Available' } : s
        ),
        absences: state.absences.map(a => {
          if (a.staffId === action.staffId && a.type === 'sick' && a.status === 'confirmed' && !a.endDate) {
            const start = new Date(a.startDate)
            const end = new Date()
            const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1)
            return { ...a, endDate: new Date().toISOString().split('T')[0], days }
          }
          return a
        }),
      }
    case 'ADD_ABSENCE':
      return { ...state, absences: [...state.absences, action.absence] }
    case 'UPDATE_ABSENCE':
      return {
        ...state,
        absences: state.absences.map(a =>
          a.id === action.id ? { ...a, ...action.updates } : a
        ),
      }
    case 'LINK_ACTIVITY_TASK':
      return {
        ...state,
        fields: state.fields.map(f =>
          f.id === action.fieldId
            ? {
                ...f,
                activities: f.activities.map(a =>
                  a.id === action.activityId
                    ? { ...a, linkedTaskId: action.taskId }
                    : a
                ),
              }
            : f
        ),
      }
    case 'ADD_CUSTOM_EVENT':
      return { ...state, customEvents: [...state.customEvents, action.event] }
    case 'UPDATE_USAGE': {
      const oldUsage = state.usages.find(u => u.id === action.id)
      const nameChanged = oldUsage && oldUsage.name !== action.updates.name
      const newUsages = state.usages.map(u =>
        u.id === action.id ? { ...u, ...action.updates } : u
      )
      const newFields = nameChanged
        ? state.fields.map(f => {
            const updates = {}
            if (f.usage === oldUsage.name) updates.usage = action.updates.name
            if (f.scheme === oldUsage.name) updates.scheme = action.updates.name
            return Object.keys(updates).length ? { ...f, ...updates } : f
          })
        : state.fields
      return { ...state, usages: newUsages, fields: newFields }
    }
    case 'ADD_USAGE':
      return { ...state, usages: [...state.usages, action.usage] }
    case 'TOGGLE_AI':
      return { ...state, aiEnabled: !state.aiEnabled }
    case 'SWITCH_USER':
      return { ...state, currentUser: action.user }
    case 'SHOW_TOAST':
      return { ...state, toasts: [...state.toasts, action.toast] }
    case 'DISMISS_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) }
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.notification, ...state.notifications] }
    case 'MARK_NOTIFICATION_READ':
      return { ...state, notifications: state.notifications.map(n => n.id === action.id ? { ...n, read: true } : n) }
    case 'MARK_ALL_NOTIFICATIONS_READ':
      return { ...state, notifications: state.notifications.map(n => n.forUserId === action.userId ? { ...n, read: true } : n) }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const updateField = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_FIELD', id, updates })
  }, [])

  const addFieldActivity = useCallback((fieldId, activity) => {
    dispatch({ type: 'ADD_FIELD_ACTIVITY', fieldId, activity })
  }, [])

  const addTask = useCallback((task) => {
    dispatch({ type: 'ADD_TASK', task })
  }, [])

  const updateTask = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_TASK', id, updates })
  }, [])

  const moveTask = useCallback((id, status, { reason, note, photo } = {}) => {
    dispatch({ type: 'MOVE_TASK', id, status, reason, note, photo })
  }, [])

  const addComment = useCallback((taskId, comment) => {
    dispatch({ type: 'ADD_COMMENT', taskId, comment })
  }, [])

  const addObservation = useCallback((entityType, entityId, observation) => {
    dispatch({ type: 'ADD_OBSERVATION', entityType, entityId, observation })
  }, [])

  const addMachinery = useCallback((equipment) => {
    dispatch({ type: 'ADD_MACHINERY', equipment })
  }, [])

  const updateMachinery = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_MACHINERY', id, updates })
  }, [])

  const addServiceRecord = useCallback((equipmentId, record) => {
    dispatch({ type: 'ADD_SERVICE_RECORD', equipmentId, record })
  }, [])

  const addStaff = useCallback((member) => {
    dispatch({ type: 'ADD_STAFF', member })
  }, [])

  const updateStaff = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_STAFF', id, updates })
  }, [])

  const archiveStaff = useCallback((id) => {
    dispatch({ type: 'ARCHIVE_STAFF', id })
  }, [])

  const reportSick = useCallback((staffId, workerName, { selfReported = false } = {}) => {
    const absence = {
      id: `abs-${Date.now()}`,
      staffId,
      type: 'sick',
      status: 'pending',
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
      days: 1,
      paidStatus: null,
      reportedAt: new Date().toISOString(),
      confirmedBy: null,
      confirmedAt: null,
      notes: '',
      selfReported,
    }
    dispatch({ type: 'REPORT_SICK', staffId, workerName, absence })
  }, [])

  const confirmSick = useCallback((staffId, absenceId, { paidStatus, confirmedBy, notes }) => {
    dispatch({ type: 'CONFIRM_SICK', staffId, absenceId, paidStatus, confirmedBy, notes })
  }, [])

  const cancelSickReport = useCallback((staffId, absenceId) => {
    dispatch({ type: 'CANCEL_SICK_REPORT', staffId, absenceId })
  }, [])

  const endSickLeave = useCallback((staffId) => {
    dispatch({ type: 'END_SICK_LEAVE', staffId })
  }, [])

  const addAbsence = useCallback((absence) => {
    dispatch({ type: 'ADD_ABSENCE', absence })
  }, [])

  const updateAbsence = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_ABSENCE', id, updates })
  }, [])

  const updateUsage = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_USAGE', id, updates })
  }, [])

  const addUsage = useCallback((usage) => {
    dispatch({ type: 'ADD_USAGE', usage })
  }, [])

  const linkActivityTask = useCallback((fieldId, activityId, taskId) => {
    dispatch({ type: 'LINK_ACTIVITY_TASK', fieldId, activityId, taskId })
  }, [])

  const addCustomEvent = useCallback((event) => {
    dispatch({ type: 'ADD_CUSTOM_EVENT', event })
  }, [])

  const toggleAI = useCallback(() => {
    dispatch({ type: 'TOGGLE_AI' })
  }, [])

  const switchUser = useCallback((user) => {
    dispatch({ type: 'SWITCH_USER', user })
  }, [])

  const markNotificationRead = useCallback((id) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', id })
  }, [])

  const markAllNotificationsRead = useCallback((userId) => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ', userId })
  }, [])

  const addNotification = useCallback((notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', notification })
  }, [])

  const showToast = useCallback((message, type = 'success') => {
    const id = ++toastId
    dispatch({ type: 'SHOW_TOAST', toast: { id, message, toastType: type } })
    setTimeout(() => dispatch({ type: 'DISMISS_TOAST', id }), 3000)
  }, [])

  const value = {
    ...state,
    updateField,
    addFieldActivity,
    addTask,
    updateTask,
    moveTask,
    addComment,
    addObservation,
    addMachinery,
    updateMachinery,
    addServiceRecord,
    addStaff,
    updateStaff,
    archiveStaff,
    reportSick,
    confirmSick,
    cancelSickReport,
    endSickLeave,
    addAbsence,
    updateAbsence,
    updateUsage,
    addUsage,
    linkActivityTask,
    addCustomEvent,
    toggleAI,
    switchUser,
    showToast,
    markNotificationRead,
    markAllNotificationsRead,
    addNotification,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
