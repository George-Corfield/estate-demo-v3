import { useState, useMemo, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import TabBar from '../../components/shared/TabBar'
import FieldOverviewTab from './FieldOverviewTab'
import FieldHistoryTab from './FieldHistoryTab'
import FieldTasksTab from './FieldTasksTab'
import ObservationThread from '../../components/shared/ObservationThread'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'notes', label: 'Notes' },
  { id: 'history', label: 'History' },
]

export default function FieldDetailView({ fieldId, onBack, initialTab, openObservationForm, onObservationFormOpened }) {
  const { fields, usages } = useApp()
  const [activeTab, setActiveTab] = useState(initialTab || 'overview')

  useEffect(() => {
    if (openObservationForm) {
      setActiveTab('history')
    }
  }, [openObservationForm])

  const field = useMemo(() => fields.find(f => f.id === fieldId), [fields, fieldId])

  if (!field) return null

  const usageEntry = usages.find(u => u.name === field.usage)
  const colors = usageEntry ? { bg: usageEntry.bg, border: usageEntry.border } : null

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div style={{ padding: 16, borderBottom: '1px solid var(--color-surface-300)' }}>
        <button
          onClick={onBack}
          className="btn btn-ghost flex items-center gap-1 mb-3"
          style={{ padding: '4px 8px', fontSize: 13 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          Back to fields
        </button>
        <div className="flex items-center gap-3">
          <div
            className="shrink-0"
            style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: colors?.border }}
          />
          <div>
            <h2 className="text-heading-2" style={{ color: 'var(--color-slate-900)', margin: 0 }}>{field.name}</h2>
            <p className="text-body" style={{ color: 'var(--color-slate-500)', fontWeight: 500 }}>{field.usage} · {field.sizeHectares} ha</p>
          </div>
        </div>
      </div>

      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'overview' && <FieldOverviewTab field={field} />}
        {activeTab === 'tasks' && <FieldTasksTab field={field} />}
        {activeTab === 'notes' && (
          <div style={{ padding: 20 }}>
            <ObservationThread
              entityType="fields"
              entityId={field.id}
              observations={field.observations || []}
              legacyComments={[]}
            />
          </div>
        )}
        {activeTab === 'history' && <FieldHistoryTab field={field} openObservationForm={openObservationForm} onObservationFormOpened={onObservationFormOpened} />}
      </div>
    </div>
  )
}
