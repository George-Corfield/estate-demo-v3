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
    <div className="relative w-full h-full overflow-hidden" style={{ background: 'var(--color-ink-800)' }}>
      {/* Map background */}
      <img
        src="/map-aerial.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        onError={(e) => {
          e.target.onerror = null
          e.target.src = '/map-aerial.svg'
        }}
      />
      {/* Subtle overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(30,34,24,0.25) 0%, transparent 50%, rgba(30,34,24,0.25) 100%)' }} />

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
      <div className="absolute flex flex-col gap-2 z-20" style={{ bottom: 16, right: 16 }}>
        <div
          className="flex flex-col overflow-hidden"
          style={{
            background: 'var(--color-parchment-50)',
            border: '1px solid var(--color-parchment-300)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <button className="p-2.5" style={{ borderBottom: '1px solid var(--color-parchment-300)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-earth-500)' }}>add</span>
          </button>
          <button className="p-2.5">
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-earth-500)' }}>remove</span>
          </button>
        </div>
        <button
          className="p-2.5"
          style={{
            background: 'var(--color-parchment-50)',
            border: '1px solid var(--color-parchment-300)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-earth-500)' }}>my_location</span>
        </button>
      </div>
    </div>
  )
}
