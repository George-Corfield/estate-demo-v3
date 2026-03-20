import { useState, useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import TaskFilterBar from './TaskFilterBar'
import TaskKanban from './TaskKanban'
import TaskDetailView from './TaskDetailView'
import TaskCreateForm from './TaskCreateForm'
import AITaskInput from './AITaskInput'
import EstateMap from '../../components/shared/EstateMap'
import Calendar from '../../components/shared/Calendar'

export default function TasksPage() {
  const [activeView, setActiveView] = useState('kanban')
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [rightView, setRightView] = useState('map')
  const [filters, setFilters] = useState({ priority: 'all', type: 'all', field: 'all' })
  const [selectedFieldIds, setSelectedFieldIds] = useState([])
  const [dueDate, setDueDate] = useState('')
  const [formKey, setFormKey] = useState(0)
  const [initialValues, setInitialValues] = useState(null)
  const { tasks, aiEnabled } = useApp()
  const aiEnabledRef = useRef(aiEnabled)
  useEffect(() => { aiEnabledRef.current = aiEnabled }, [aiEnabled])
  const location = useLocation()
  const navigate = useNavigate()

  const detailTaskFieldIds = useMemo(() => {
    if (activeView !== 'detail' || !selectedTaskId) return []
    const task = tasks.find(t => t.id === selectedTaskId)
    return task ? task.fieldIds : []
  }, [activeView, selectedTaskId, tasks])

  useEffect(() => {
    if (location.state?.createTask) {
      if (aiEnabled) {
        setActiveView('ai-input')
      } else {
        setActiveView('create')
      }
      if (location.state.prefillFieldIds) {
        setSelectedFieldIds(location.state.prefillFieldIds)
      }
      navigate('.', { replace: true, state: {} })
    }
    if (location.state?.openTaskId) {
      setSelectedTaskId(location.state.openTaskId)
      setActiveView('detail')
      navigate('.', { replace: true, state: {} })
    }
  }, [location.state, navigate])

  useEffect(() => {
    const handleFabAddTask = () => {
      const target = aiEnabledRef.current ? 'ai-input' : 'create'
      if (activeView === 'create' || activeView === 'ai-input') {
        if (window.confirm('Discard current task draft?')) {
          setSelectedFieldIds([])
          setDueDate('')
          setInitialValues(null)
          setFormKey(k => k + 1)
          setActiveView(target)
        }
      } else {
        setActiveView(target)
        setSelectedFieldIds([])
        setDueDate('')
        setInitialValues(null)
        setFormKey(k => k + 1)
      }
    }
    window.addEventListener('fab-add-task', handleFabAddTask)
    return () => window.removeEventListener('fab-add-task', handleFabAddTask)
  }, [activeView])

  const handleFieldToggle = (field) => {
    if (activeView === 'create') {
      setSelectedFieldIds(prev =>
        prev.includes(field.id)
          ? prev.filter(id => id !== field.id)
          : [...prev, field.id]
      )
    } else if (activeView === 'kanban') {
      setFilters(prev => ({
        ...prev,
        field: prev.field === field.id ? 'all' : field.id,
      }))
    }
  }

  const handleCalendarDaySelect = (date) => {
    if (activeView === 'create') {
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      setDueDate(key)
    }
  }

  return (
    <div className="flex h-full">
      {/* Left panel — 35% split */}
      <div className="split-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {activeView === 'kanban' && (
          <>
            <TaskFilterBar
              filters={filters}
              onChange={setFilters}
              onAddTask={() => {
                setActiveView(aiEnabled ? 'ai-input' : 'create')
                setSelectedFieldIds([])
                setDueDate('')
                setInitialValues(null)
              }}
            />
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <TaskKanban
                filters={filters}
                onTaskClick={(id) => {
                  setSelectedTaskId(id)
                  setActiveView('detail')
                }}
              />
            </div>
          </>
        )}
        {activeView === 'detail' && (
          <TaskDetailView
            taskId={selectedTaskId}
            onBack={() => setActiveView('kanban')}
          />
        )}
        {activeView === 'ai-input' && (
          <AITaskInput
            onBack={() => setActiveView('kanban')}
            onGenerate={(result) => {
              setInitialValues(result)
              setSelectedFieldIds(result.fieldIds)
              setDueDate(result.dueDate)
              setFormKey(k => k + 1)
              setActiveView('create')
            }}
          />
        )}
        {activeView === 'create' && (
          <TaskCreateForm
            key={formKey}
            selectedFieldIds={selectedFieldIds}
            setSelectedFieldIds={setSelectedFieldIds}
            dueDate={dueDate}
            setDueDate={setDueDate}
            onCancel={() => setActiveView('kanban')}
            onSave={() => setActiveView('kanban')}
            onFocusDate={() => setRightView('calendar')}
            initialValues={initialValues}
          />
        )}
      </div>

      {/* Right panel — 65% map */}
      <div className="flex-1 relative">
        {rightView === 'map' ? (
          <EstateMap
            selectedFieldIds={activeView === 'create' ? selectedFieldIds : []}
            highlightedFieldIds={activeView === 'detail' ? detailTaskFieldIds : (filters.field !== 'all' ? [filters.field] : [])}
            onFieldClick={handleFieldToggle}
          />
        ) : (
          <Calendar
            mode={activeView === 'create' ? 'select' : 'view'}
            onDaySelect={handleCalendarDaySelect}
            selectedDate={dueDate ? new Date(dueDate) : null}
          />
        )}

        {/* View toggle */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setRightView(rightView === 'map' ? 'calendar' : 'map')}
            className="btn btn-secondary flex items-center gap-2"
            style={{ background: 'var(--color-surface-50)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              {rightView === 'map' ? 'calendar_month' : 'map'}
            </span>
            {rightView === 'map' ? 'Calendar' : 'Map'}
          </button>
        </div>
      </div>
    </div>
  )
}
