import { CATEGORY_COLORS } from '../../constants/colors'

export default function FieldOverlay({ field, isHighlighted, isSelected, onClick }) {
  const colors = CATEGORY_COLORS[field.category] || CATEGORY_COLORS.Arable
  const pos = field.mapPosition
  const active = isHighlighted || isSelected

  return (
    <button
      onClick={() => onClick?.(field)}
      className="absolute transition-all duration-200 cursor-pointer group"
      style={{
        top: `${pos.top}%`,
        left: `${pos.left}%`,
        width: `${pos.width}%`,
        height: `${pos.height}%`,
        backgroundColor: active ? `${colors.bg}40` : `${colors.bg}18`,
        border: `2px solid ${active ? colors.border : `${colors.border}80`}`,
        borderRadius: '6px',
        transform: active ? 'scale(1.02)' : 'scale(1)',
        zIndex: active ? 10 : 1,
        boxShadow: active ? `0 0 20px ${colors.bg}40` : 'none',
      }}
    >
      {/* Field name label */}
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[11px] font-semibold leading-tight text-center px-1.5 py-0.5 rounded whitespace-nowrap"
        style={{
          textShadow: '0 1px 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.5)',
          backgroundColor: active ? 'rgba(0,0,0,0.3)' : 'transparent',
        }}
      >
        {field.name}
      </span>

      {/* Category indicator dot */}
      <span
        className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: colors.border }}
      />

      {/* Selected checkmark */}
      {isSelected && (
        <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <span className="material-icons text-white" style={{ fontSize: '14px' }}>check</span>
        </span>
      )}

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-[5px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1px ${colors.border}, 0 0 12px ${colors.bg}30` }}
      />
    </button>
  )
}
