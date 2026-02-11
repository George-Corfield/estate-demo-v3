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
      <div className="p-4 border-b border-slate-100">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-3"
        >
          <span className="material-icons text-base">arrow_back</span>
          Back to fields
        </button>
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: colors?.border }}
          />
          <div>
            <h2 className="text-lg font-bold text-slate-900">{field.name}</h2>
            <p className="text-xs text-slate-500">{field.category} · {field.sizeAcres} acres ({field.sizeHectares} ha)</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'overview' && <FieldOverviewTab field={field} />}
        {activeTab === 'history' && <FieldHistoryTab field={field} />}
      </div>
    </div>
  )
}
