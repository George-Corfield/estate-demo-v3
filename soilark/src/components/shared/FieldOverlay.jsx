import { useApp } from '../../context/AppContext'

export default function FieldOverlay({ field, isHighlighted, isWhiteHighlighted, isSelected, isAlert, onClick }) {
  const { usages } = useApp()
  const usageEntry = usages.find(u => u.name === field.usage)
  const colors = usageEntry
    ? { bg: usageEntry.bg, border: usageEntry.border }
    : { bg: '#fcd34d', border: '#f59e0b' }
  const pos = field.mapPosition
  const active = isHighlighted || isSelected || isWhiteHighlighted || isAlert

  // Design system: selected = green-500 30% fill + 2px stroke, attention = amber-400
  const bgColor = isAlert ? 'rgba(239, 68, 68, 0.3)'
    : isWhiteHighlighted ? `${colors.bg}CC`
    : isSelected ? 'rgba(78,140,53,0.3)'
    : active ? `${colors.bg}BF` : `${colors.bg}80`
  const borderColor = isAlert ? 'var(--color-red-500)'
    : isWhiteHighlighted ? colors.border
    : isSelected ? 'var(--color-green-500)'
    : active ? colors.border : `${colors.border}E6`

  return (
    <>
      {isAlert && (
        <style>{`
          @keyframes field-alert-pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
            50% { box-shadow: 0 0 12px 4px rgba(239, 68, 68, 0.35); }
          }
        `}</style>
      )}
      <button
        onClick={() => onClick?.(field)}
        className="absolute group"
        style={{
          top: `${pos.top}%`,
          left: `${pos.left}%`,
          width: `${pos.width}%`,
          height: `${pos.height}%`,
          backgroundColor: bgColor,
          border: `${isAlert ? '3px dashed' : '2px solid'} ${borderColor}`,
          borderRadius: 'var(--radius-md)',
          transform: active ? 'scale(1.02)' : 'scale(1)',
          zIndex: active ? 10 : 1,
          transition: 'all 200ms ease',
          cursor: 'pointer',
          animation: isAlert ? 'field-alert-pulse 2s ease-in-out infinite' : 'none',
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

        {/* Alert warning icon */}
        {isAlert && (
          <span
            className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: 'var(--color-red-500)', boxShadow: '0 1px 4px rgba(239, 68, 68, 0.5)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'white' }}>warning</span>
          </span>
        )}

        {/* Selected checkmark */}
        {isSelected && !isAlert && (
          <span
            className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: 'var(--color-green-500)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'white' }}>check</span>
          </span>
        )}
      </button>
    </>
  )
}
