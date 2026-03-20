import { useState, useMemo, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { isOverdue } from '../../utils/dates'

const USAGE_ICONS = {
  Wheat: 'grain',
  Barley: 'grain',
  Maize: 'spa',
  Oats: 'grain',
  Grass: 'grass',
  Potatoes: 'nutrition',
  'Oilseed rape': 'local_florist',
}

export default function FieldCategoryList({ onFieldSelect, initialOpenCategory, onManageUsages, onCategoryChange, selectFieldForObservation, onCancelObservation }) {
  const { fields, usages, tasks } = useApp()

  const overdueFieldIds = useMemo(() => {
    const ids = new Set()
    tasks.forEach(t => {
      if (t.status !== 'done' && t.status !== 'cancelled' && t.dueDate && isOverdue(t.dueDate)) {
        t.fieldIds?.forEach(fid => ids.add(fid))
      }
    })
    return ids
  }, [tasks])
  const [expandedCategories, setExpandedCategories] = useState(
    initialOpenCategory ? [initialOpenCategory] : ['Wheat']
  )
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (initialOpenCategory) {
      setExpandedCategories([initialOpenCategory])
    }
  }, [initialOpenCategory])

  const usageColorMap = useMemo(() => {
    const map = {}
    usages.forEach(u => { map[u.name] = { bg: u.bg, border: u.border } })
    return map
  }, [usages])

  const categories = useMemo(() => {
    const cats = {}
    fields.forEach(f => {
      if (!cats[f.usage]) cats[f.usage] = []
      cats[f.usage].push(f)
    })
    return Object.entries(cats).map(([name, items]) => ({
      name,
      fields: items,
      totalHectares: items.reduce((sum, f) => sum + f.sizeHectares, 0),
    }))
  }, [fields])

  const filteredCategories = useMemo(() => {
    if (!search) return categories
    const s = search.toLowerCase()
    return categories.map(cat => ({
      ...cat,
      fields: cat.fields.filter(f =>
        f.name.toLowerCase().includes(s) ||
        (f.scheme && f.scheme.toLowerCase().includes(s))
      ),
    })).filter(cat => cat.fields.length > 0)
  }, [categories, search])

  const toggleCategory = (name) => {
    const next = expandedCategories.includes(name) ? [] : [name]
    setExpandedCategories(next)
    onCategoryChange?.(next[0] || null)
  }

  const totalHectares = fields.reduce((sum, f) => sum + f.sizeHectares, 0)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="split-panel-header" style={{ height: 'auto', padding: 20, flexDirection: 'column', alignItems: 'stretch' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-heading-3 flex items-center gap-2" style={{ color: 'var(--color-slate-900)', margin: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-green-500)' }}>layers</span>
            Fields
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onManageUsages}
              className="btn btn-ghost flex items-center justify-center"
              style={{ padding: 4, width: 28, height: 28 }}
              title="Manage Usages"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-slate-400)' }}>palette</span>
            </button>
            <span className="text-label" style={{ color: 'var(--color-slate-400)' }}>{fields.length} fields</span>
          </div>
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2" style={{ fontSize: 16, color: 'var(--color-slate-400)' }}>search</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search fields..."
            className="form-input"
            style={{ paddingLeft: 36 }}
          />
        </div>
      </div>

      {/* Observation pick banner */}
      {selectFieldForObservation && (
        <div
          className="flex items-center justify-between"
          style={{
            padding: '10px 16px',
            background: 'rgba(20, 184, 166, 0.1)',
            borderBottom: '1px solid rgba(20, 184, 166, 0.3)',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-teal-500, #14b8a6)' }}>visibility</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-teal-700, #0f766e)' }}>Select a field to log an observation</span>
          </div>
          <button
            onClick={onCancelObservation}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-teal-500, #14b8a6)' }}>close</span>
          </button>
        </div>
      )}


      {/* Category list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ padding: 16 }}>
        <div className="flex flex-col gap-3">
          {filteredCategories.map(cat => {
            const colors = usageColorMap[cat.name]
            const expanded = expandedCategories.includes(cat.name)
            return (
              <div
                key={cat.name}
                className="overflow-hidden"
                style={{ border: '1px solid var(--color-surface-300)', borderRadius: 'var(--radius-md)' }}
              >
                <button
                  onClick={() => toggleCategory(cat.name)}
                  className="w-full flex items-center justify-between p-3"
                  style={{
                    background: 'var(--color-surface-100)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 120ms ease',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      style={{ width: 16, height: 16, borderRadius: 3, backgroundColor: colors?.bg, border: `2px solid ${colors?.border}`, flexShrink: 0 }}
                    />
                    <span className="text-heading-4" style={{ color: 'var(--color-slate-900)' }}>
                      {cat.name}
                      <span className="text-body-small ml-2" style={{ color: 'var(--color-slate-500)', fontWeight: 400 }}>
                        ({cat.fields.length} fields)
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-data" style={{ fontSize: 12, color: 'var(--color-slate-400)' }}>{cat.totalHectares.toFixed(1)} ha</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-slate-400)' }}>
                      {expanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>
                </button>

                {expanded && (
                  <div style={{ padding: 8 }} className="flex flex-col gap-1">
                    {cat.fields.map(field => {
                      const fieldOverdue = overdueFieldIds.has(field.id)
                      return (
                      <button
                        key={field.id}
                        onClick={() => onFieldSelect(field.id)}
                        className="w-full text-left p-3"
                        style={{
                          borderRadius: 'var(--radius-sm)',
                          background: fieldOverdue ? 'var(--color-red-100)' : 'transparent',
                          border: 'none',
                          borderLeft: fieldOverdue ? '3px solid var(--color-red-400)' : '3px solid transparent',
                          cursor: 'pointer',
                          transition: 'all 120ms ease',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = fieldOverdue ? 'var(--color-red-100)' : 'rgba(78,140,53,0.06)'
                          if (!fieldOverdue) e.currentTarget.style.borderLeftColor = 'var(--color-green-500)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = fieldOverdue ? 'var(--color-red-100)' : 'transparent'
                          if (!fieldOverdue) e.currentTarget.style.borderLeftColor = 'transparent'
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <h4 className="text-heading-4" style={{ color: 'var(--color-slate-900)', margin: 0 }}>{field.name}</h4>
                            {fieldOverdue && (
                              <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--color-red-400)' }}>warning</span>
                            )}
                          </div>
                          <span className="text-data" style={{ fontSize: 12, color: 'var(--color-slate-400)' }}>{field.sizeHectares} ha</span>
                        </div>
                        <p className="text-body-small" style={{ color: fieldOverdue ? 'var(--color-red-400)' : 'var(--color-slate-500)', marginTop: 2 }}>
                          {fieldOverdue ? 'Overdue tasks' : (field.scheme && field.scheme !== 'None' ? field.scheme : 'No scheme')}
                        </p>
                      </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: 16, background: 'var(--color-surface-100)', borderTop: '1px solid var(--color-surface-300)' }}>
        <div className="flex items-center justify-between">
          <span className="text-label" style={{ color: 'var(--color-slate-400)' }}>Total Area</span>
          <span className="text-data" style={{ color: 'var(--color-slate-900)', fontWeight: 500 }}>{totalHectares.toFixed(1)} ha</span>
        </div>
      </div>
    </div>
  )
}
