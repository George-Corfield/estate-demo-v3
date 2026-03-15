import { createContext, useContext, useReducer, useCallback } from 'react'
import { initialFields } from '../data/fields'
import { initialTasks } from '../data/tasks'
import { initialEvents } from '../data/events'
import { initialMachinery } from '../data/machinery'
import { initialStaff } from '../data/staff'
import { initialAbsences } from '../data/absences'
import { initialUsages } from '../data/usages'

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
      if (fieldIdsForTask.length === 0) {
        return { ...state, tasks: [...state.tasks, newTask] }
      }
      const now = new Date().toISOString()
      return {
        ...state,
        tasks: [...state.tasks, newTask],
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
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.id ? { ...t, ...action.updates } : t
        ),
      }
    case 'MOVE_TASK': {
      const movedTask = state.tasks.find(t => t.id === action.id)
      const taskFieldIds = movedTask?.fieldIds || []
      const nowMove = new Date().toISOString()
      const isStarted = action.status === 'inProgress'
      const isCompleted = action.status === 'done'
      const shouldAddHistory = (isStarted || isCompleted) && taskFieldIds.length > 0

      let taskActionLabel = null
      let taskActionTitle = null
      let historyDetails = ''
      let histMachinery = null
      let histInput = null
      let histQuantity = null
      let histRate = null
      let histUnits = null

      if (shouldAddHistory && movedTask) {
        if (isStarted) {
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

      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.id
            ? {
                ...t,
                status: action.status,
                completedDate: isCompleted ? new Date().toISOString().split('T')[0] : null,
              }
            : t
        ),
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
                evidence: [],
                source: 'task-system',
              }
              return { ...f, activities: [entry, ...f.activities] }
            })
          : state.fields,
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
    case 'UPDATE_MACHINERY':
      return {
        ...state,
        machinery: state.machinery.map(m =>
          m.id === action.id ? { ...m, ...action.updates } : m
        ),
      }
    case 'ADD_SERVICE_RECORD':
      return {
        ...state,
        machinery: state.machinery.map(m =>
          m.id === action.equipmentId
            ? { ...m, serviceHistory: [action.record, ...m.serviceHistory] }
            : m
        ),
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
    case 'REPORT_SICK':
      return {
        ...state,
        staff: state.staff.map(s =>
          s.id === action.staffId ? { ...s, status: 'Pending Sick Confirmation' } : s
        ),
        absences: [...state.absences, action.absence],
      }
    case 'CONFIRM_SICK':
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
      }
    case 'CANCEL_SICK_REPORT':
      return {
        ...state,
        staff: state.staff.map(s =>
          s.id === action.staffId ? { ...s, status: 'Available' } : s
        ),
        absences: state.absences.map(a =>
          a.id === action.absenceId ? { ...a, status: 'cancelled' } : a
        ),
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
            if (f.currentCrop === oldUsage.name) updates.currentCrop = action.updates.name
            return Object.keys(updates).length ? { ...f, ...updates } : f
          })
        : state.fields
      return { ...state, usages: newUsages, fields: newFields }
    }
    case 'ADD_USAGE':
      return { ...state, usages: [...state.usages, action.usage] }
    case 'SHOW_TOAST':
      return { ...state, toasts: [...state.toasts, action.toast] }
    case 'DISMISS_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) }
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

  const moveTask = useCallback((id, status) => {
    dispatch({ type: 'MOVE_TASK', id, status })
  }, [])

  const addComment = useCallback((taskId, comment) => {
    dispatch({ type: 'ADD_COMMENT', taskId, comment })
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

  const reportSick = useCallback((staffId) => {
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
    }
    dispatch({ type: 'REPORT_SICK', staffId, absence })
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

  const addCustomEvent = useCallback((event) => {
    dispatch({ type: 'ADD_CUSTOM_EVENT', event })
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
    addCustomEvent,
    showToast,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
