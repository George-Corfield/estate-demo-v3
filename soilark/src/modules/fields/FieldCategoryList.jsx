import { useState, useMemo, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { CATEGORY_COLORS } from '../../constants/colors'

const CATEGORY_ICONS = {
  Arable: 'grain',
  Pastoral: 'pets',
  Grassland: 'grass',
  Forestry: 'park',
}

export default function FieldCategoryList({ onFieldSelect, initialOpenCategory }) {
  const { fields } = useApp()
  const [expandedCategories, setExpandedCategories] = useState(
    initialOpenCategory ? [initialOpenCategory] : ['Arable']
  )
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (initialOpenCategory) {
      setExpandedCategories([initialOpenCategory])
    }
  }, [initialOpenCategory])

  const categories = useMemo(() => {
    const cats = {}
    fields.forEach(f => {
      if (!cats[f.category]) cats[f.category] = []
      cats[f.category].push(f)
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
        (f.currentCrop && f.currentCrop.toLowerCase().includes(s)) ||
        (f.livestock && f.livestock.toLowerCase().includes(s))
      ),
    })).filter(cat => cat.fields.length > 0)
  }, [categories, search])

  const toggleCategory = (name) => {
    setExpandedCategories(prev =>
      prev.includes(name) ? [] : [name]
    )
  }

  const totalHectares = fields.reduce((sum, f) => sum + f.sizeHectares, 0)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="split-panel-header" style={{ height: 'auto', padding: 20, flexDirection: 'column', alignItems: 'stretch' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-heading-3 flex items-center gap-2" style={{ color: 'var(--color-ink-900)', margin: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-sage-500)' }}>layers</span>
            Fields
          </h2>
          <span className="text-label" style={{ color: 'var(--color-earth-400)' }}>{fields.length} fields</span>
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2" style={{ fontSize: 16, color: 'var(--color-earth-400)' }}>search</span>
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

      {/* Category list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ padding: 16 }}>
        <div className="flex flex-col gap-3">
          {filteredCategories.map(cat => {
            const colors = CATEGORY_COLORS[cat.name]
            const expanded = expandedCategories.includes(cat.name)
            return (
              <div
                key={cat.name}
                className="overflow-hidden"
                style={{ border: '1px solid var(--color-parchment-300)', borderRadius: 'var(--radius-md)' }}
              >
                <button
                  onClick={() => toggleCategory(cat.name)}
                  className="w-full flex items-center justify-between p-3"
                  style={{
                    background: 'var(--color-parchment-100)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 120ms ease',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: colors.border }}>
                      {CATEGORY_ICONS[cat.name]}
                    </span>
                    <span className="text-heading-4" style={{ color: 'var(--color-ink-900)' }}>
                      {cat.name}
                      <span className="text-body-small ml-2" style={{ color: 'var(--color-earth-500)', fontWeight: 400 }}>
                        ({cat.fields.length} fields)
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-data" style={{ fontSize: 12, color: 'var(--color-earth-400)' }}>{cat.totalHectares.toFixed(1)} ha</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-earth-400)' }}>
                      {expanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>
                </button>

                {expanded && (
                  <div style={{ padding: 8 }} className="flex flex-col gap-1">
                    {cat.fields.map(field => (
                      <button
                        key={field.id}
                        onClick={() => onFieldSelect(field.id)}
                        className="w-full text-left p-3"
                        style={{
                          borderRadius: 'var(--radius-sm)',
                          borderLeft: '3px solid transparent',
                          background: 'transparent',
                          border: 'none',
                          borderLeft: '3px solid transparent',
                          cursor: 'pointer',
                          transition: 'all 120ms ease',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(78,140,53,0.06)'
                          e.currentTarget.style.borderLeftColor = 'var(--color-sage-500)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.borderLeftColor = 'transparent'
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="text-heading-4" style={{ color: 'var(--color-ink-900)', margin: 0 }}>{field.name}</h4>
                          <span className="text-data" style={{ fontSize: 12, color: 'var(--color-earth-400)' }}>{field.sizeHectares} ha</span>
                        </div>
                        <p className="text-body-small" style={{ color: 'var(--color-earth-500)', marginTop: 2 }}>
                          {field.currentCrop || field.livestock || 'No current use'}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: 16, background: 'var(--color-parchment-100)', borderTop: '1px solid var(--color-parchment-300)' }}>
        <div className="flex items-center justify-between">
          <span className="text-label" style={{ color: 'var(--color-earth-400)' }}>Total Area</span>
          <span className="text-data" style={{ color: 'var(--color-ink-900)', fontWeight: 500 }}>{totalHectares.toFixed(1)} ha</span>
        </div>
      </div>
    </div>
  )
}
