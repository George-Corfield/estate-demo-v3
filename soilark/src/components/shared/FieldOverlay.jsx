import { CATEGORY_COLORS } from '../../constants/colors'

export default function FieldOverlay({ field, isHighlighted, isWhiteHighlighted, isSelected, onClick }) {
  const colors = CATEGORY_COLORS[field.category] || CATEGORY_COLORS.Arable
  const pos = field.mapPosition
  const active = isHighlighted || isSelected || isWhiteHighlighted

  // Design system: selected = sage-500 30% fill + 2px stroke, attention = ochre-400
  const bgColor = isWhiteHighlighted ? 'rgba(255,255,255,0.45)'
    : isSelected ? 'rgba(78,140,53,0.3)'
    : active ? `${colors.bg}40` : `${colors.bg}18`
  const borderColor = isWhiteHighlighted ? 'rgba(255,255,255,0.9)'
    : isSelected ? 'var(--color-sage-500)'
    : active ? colors.border : `${colors.border}80`

  return (
    <button
      onClick={() => onClick?.(field)}
      className="absolute group"
      style={{
        top: `${pos.top}%`,
        left: `${pos.left}%`,
        width: `${pos.width}%`,
        height: `${pos.height}%`,
        backgroundColor: bgColor,
        border: `2px solid ${borderColor}`,
        borderRadius: 'var(--radius-md)',
        transform: active ? 'scale(1.02)' : 'scale(1)',
        zIndex: active ? 10 : 1,
        transition: 'all 200ms ease',
        cursor: 'pointer',
      }}
    >
      {/* Field name label */}
      <span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          fontWeight: 600,
          color: 'white',
          textShadow: '0 1px 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.5)',
          padding: '2px 6px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: active ? 'rgba(0,0,0,0.3)' : 'transparent',
        }}
      >
        {field.name}
      </span>

      {/* Category indicator dot */}
      <span
        className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full opacity-60 group-hover:opacity-100"
        style={{ backgroundColor: colors.border, transition: 'opacity 120ms ease' }}
      />

      {/* Selected checkmark */}
      {isSelected && (
        <span
          className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: 'var(--color-sage-500)' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'white' }}>check</span>
        </span>
      )}
    </button>
  )
}
