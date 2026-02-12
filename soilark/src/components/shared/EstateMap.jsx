import { useApp } from '../../context/AppContext'
import FieldOverlay from './FieldOverlay'

export default function EstateMap({
  highlightedFieldId,
  highlightedFieldIds = [],
  selectedFieldIds = [],
  onFieldClick,
  interactive = true,
}) {
  const { fields } = useApp()

  return (
    <div className="relative w-full h-full overflow-hidden bg-emerald-900">
      {/* Map background - try JPG first, fall back to SVG */}
      <img
        src="/map-aerial.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        onError={(e) => {
          e.target.onerror = null
          e.target.src = '/map-aerial.svg'
        }}
      />
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-transparent to-emerald-950/30" />

      {/* Field overlays */}
      {fields.map((field) => (
        <FieldOverlay
          key={field.id}
          field={field}
          isHighlighted={highlightedFieldId === field.id}
          isWhiteHighlighted={highlightedFieldIds.includes(field.id)}
          isSelected={selectedFieldIds.includes(field.id)}
          onClick={interactive ? onFieldClick : undefined}
        />
      ))}

      {/* Map controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
        <div className="flex flex-col bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <button className="p-2.5 hover:bg-slate-50 border-b border-slate-100">
            <span className="material-icons text-slate-600 text-lg">add</span>
          </button>
          <button className="p-2.5 hover:bg-slate-50">
            <span className="material-icons text-slate-600 text-lg">remove</span>
          </button>
        </div>
        <button className="p-2.5 bg-white rounded-xl shadow-lg border border-slate-200 hover:bg-slate-50">
          <span className="material-icons text-slate-600 text-lg">my_location</span>
        </button>
      </div>
    </div>
  )
}
