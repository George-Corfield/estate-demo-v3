import { createContext, useContext, useReducer, useCallback } from 'react'
import { initialFields } from '../data/fields'
import { initialTasks } from '../data/tasks'
import { initialEvents } from '../data/events'
import { initialMachinery } from '../data/machinery'

const AppContext = createContext(null)

const initialState = {
  fields: initialFields,
  tasks: initialTasks,
  customEvents: initialEvents,
  machinery: initialMachinery,
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
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.task] }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.id ? { ...t, ...action.updates } : t
        ),
      }
    case 'MOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.id
            ? {
                ...t,
                status: action.status,
                completedDate: action.status === 'done' ? new Date().toISOString().split('T')[0] : null,
              }
            : t
        ),
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
    case 'ADD_CUSTOM_EVENT':
      return { ...state, customEvents: [...state.customEvents, action.event] }
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
