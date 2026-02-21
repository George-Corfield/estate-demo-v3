import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { CATEGORY_COLORS } from '../../constants/colors'
import TabBar from '../../components/shared/TabBar'
import FieldOverviewTab from './FieldOverviewTab'
import FieldHistoryTab from './FieldHistoryTab'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'history', label: 'Activity History' },
]

export default function FieldDetailView({ fieldId, onBack }) {
  const { fields } = useApp()
  const [activeTab, setActiveTab] = useState('overview')

  const field = useMemo(() => fields.find(f => f.id === fieldId), [fields, fieldId])

  if (!field) return null

  const colors = CATEGORY_COLORS[field.category]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div style={{ padding: 16, borderBottom: '1px solid var(--color-parchment-300)' }}>
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
            <h2 className="text-heading-3" style={{ color: 'var(--color-ink-900)', margin: 0 }}>{field.name}</h2>
            <p className="text-body-small" style={{ color: 'var(--color-earth-500)' }}>{field.category} · {field.sizeHectares} ha</p>
          </div>
        </div>
      </div>

      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'overview' && <FieldOverviewTab field={field} />}
        {activeTab === 'history' && <FieldHistoryTab field={field} />}
      </div>
    </div>
  )
}
