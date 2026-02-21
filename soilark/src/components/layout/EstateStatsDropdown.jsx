import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { estateStats } from '../../data/estateStats'

const CATEGORY_ICONS = {
  Grassland: 'grass',
  Crops: 'grain',
  Forestry: 'park',
  Buildings: 'home_work',
}

export default function EstateStatsDropdown({ onClose }) {
  const [drillDown, setDrillDown] = useState(null)
  const navigate = useNavigate()

  const handleSubcategoryClick = (categoryName) => {
    navigate('/fields', { state: { openCategory: categoryName } })
    onClose()
  }

  // Drilled-down view
  if (drillDown) {
    const cat = estateStats.categories.find(c => c.name === drillDown)
    return (
      <div
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: 4,
          width: 300,
          background: 'var(--color-parchment-50)',
          border: '1px solid var(--color-parchment-300)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          zIndex: 50,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-parchment-300)', background: 'var(--color-parchment-100)' }}>
          <button
            onClick={() => setDrillDown(null)}
            className="flex items-center gap-1"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 4 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-earth-400)' }}>arrow_back</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-earth-400)' }}>Back</span>
          </button>
          <p className="text-heading-4" style={{ color: 'var(--color-ink-900)', margin: 0 }}>{cat.name}</p>
          <p className="text-label" style={{ color: 'var(--color-earth-400)', marginTop: 2 }}>
            {cat.hectares ? `${cat.hectares} HA TOTAL` : `${cat.count} STRUCTURES`}
          </p>
        </div>

        {/* Subcategories */}
        <div style={{ padding: 4 }}>
          {cat.subcategories.map((sub, i) => (
            <button
              key={i}
              onClick={() => handleSubcategoryClick(cat.name)}
              className="w-full text-left flex items-center justify-between"
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'background var(--duration-fast) ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-parchment-100)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
            >
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-ink-900)', margin: 0 }}>{sub.name}</p>
                {sub.fieldCount && (
                  <p className="text-body-small" style={{ color: 'var(--color-earth-400)', margin: 0 }}>{sub.fieldCount} fields</p>
                )}
              </div>
              <span className="text-data" style={{ color: 'var(--color-sage-600)' }}>
                {sub.hectares ? `${sub.hectares} ha` : sub.count ? String(sub.count) : ''}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Top-level view
  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        marginTop: 4,
        width: 300,
        background: 'var(--color-parchment-50)',
        border: '1px solid var(--color-parchment-300)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)',
        zIndex: 50,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-parchment-300)', background: 'var(--color-parchment-100)' }}>
        <p className="text-heading-4" style={{ color: 'var(--color-ink-900)', margin: 0 }}>{estateStats.name}</p>
        <p className="text-label" style={{ color: 'var(--color-earth-400)', marginTop: 2 }}>{estateStats.totalHectares} HA TOTAL</p>
      </div>

      {/* Categories */}
      <div style={{ padding: 4 }}>
        {estateStats.categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setDrillDown(cat.name)}
            className="w-full text-left flex items-center justify-between"
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'background var(--duration-fast) ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-parchment-100)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-earth-400)' }}>
                {CATEGORY_ICONS[cat.name] || 'landscape'}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-ink-900)' }}>{cat.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-data" style={{ color: 'var(--color-sage-600)' }}>
                {cat.hectares ? `${cat.hectares} ha` : `${cat.count}`}
              </span>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-parchment-300)' }}>chevron_right</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
