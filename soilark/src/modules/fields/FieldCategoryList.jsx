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
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
            <span className="material-icons text-primary">layers</span>
            Fields
          </h2>
          <span className="text-xs text-slate-400">{fields.length} fields</span>
        </div>
        <div className="relative">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search fields..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
          />
        </div>
      </div>

      {/* Category list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
        {filteredCategories.map(cat => {
          const colors = CATEGORY_COLORS[cat.name]
          const expanded = expandedCategories.includes(cat.name)
          return (
            <div key={cat.name} className="rounded-lg border border-slate-100 overflow-hidden">
              <button
                onClick={() => toggleCategory(cat.name)}
                className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="material-icons" style={{ color: colors.border }}>
                    {CATEGORY_ICONS[cat.name]}
                  </span>
                  <span className="font-semibold text-sm text-slate-800">
                    {cat.name}
                    <span className="text-xs font-normal text-slate-500 ml-2">
                      ({cat.fields.length} fields)
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{cat.totalHectares.toFixed(1)} ha</span>
                  <span className="material-icons text-slate-400 text-sm">
                    {expanded ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
              </button>

              {expanded && (
                <div className="p-2 space-y-1">
                  {cat.fields.map(field => (
                    <button
                      key={field.id}
                      onClick={() => onFieldSelect(field.id)}
                      className="w-full text-left p-3 rounded-lg hover:bg-primary/5 border-l-4 border-transparent hover:border-primary/50 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-slate-800">{field.name}</h4>
                        <span className="text-xs text-slate-400">{field.sizeHectares} ha</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
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

      {/* Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Total Area</span>
          <span className="font-bold text-slate-800">{totalHectares.toFixed(1)} ha</span>
        </div>
      </div>
    </div>
  )
}
