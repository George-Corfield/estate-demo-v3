import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { estateStats } from '../../data/estateStats'

export default function EstateStatsDropdown({ onClose }) {
  const [drillDown, setDrillDown] = useState(null)
  const navigate = useNavigate()

  const handleSubcategoryClick = (categoryName, subcategoryName) => {
    navigate('/fields', { state: { openCategory: categoryName } })
    onClose()
  }

  if (drillDown) {
    const cat = estateStats.categories.find(c => c.name === drillDown)
    return (
      <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
        <div className="p-4 border-b border-slate-100">
          <button
            onClick={() => setDrillDown(null)}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <span className="material-icons text-base">arrow_back</span>
            Back
          </button>
          <h3 className="font-bold text-slate-900">{cat.name}</h3>
          <p className="text-xs text-slate-500">
            {cat.hectares ? `${cat.hectares} ha total` : `${cat.count} structures`}
          </p>
        </div>
        <div className="p-2">
          {cat.subcategories.map((sub, i) => (
            <button
              key={i}
              onClick={() => handleSubcategoryClick(cat.name, sub.name)}
              className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">{sub.name}</p>
                {sub.fieldCount && (
                  <p className="text-xs text-slate-500">{sub.fieldCount} fields</p>
                )}
              </div>
              <span className="text-sm font-semibold text-slate-600">
                {sub.hectares ? `${sub.hectares} ha` : sub.count ? `${sub.count}` : ''}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-900">{estateStats.name}</h3>
        <p className="text-sm text-slate-500">{estateStats.totalHectares} ha total</p>
      </div>
      <div className="p-2">
        {estateStats.categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setDrillDown(cat.name)}
            className="w-full text-left px-3 py-3 rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="material-icons text-slate-400 text-lg">
                {cat.name === 'Grassland' ? 'grass' : cat.name === 'Crops' ? 'grain' : cat.name === 'Forestry' ? 'park' : 'home_work'}
              </span>
              <span className="text-sm font-medium text-slate-800">{cat.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-600">
                {cat.hectares ? `${cat.hectares} ha` : `${cat.count} structures`}
              </span>
              <span className="material-icons text-slate-300 text-base">chevron_right</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
