import { EVENT_FILTER_COLORS } from '../../constants/colors'

const FILTER_KEYS = ['task', 'service', 'event']

export default function MobileFilterBar({ filters, onToggle }) {
  return (
    <div style={{
      display: 'flex',
      gap: 8,
      padding: '10px 12px',
      borderBottom: '1px solid var(--color-surface-300)',
      background: 'var(--color-surface-50)',
      overflowX: 'auto',
    }}>
      {FILTER_KEYS.map(key => {
        const fc = EVENT_FILTER_COLORS[key]
        const active = filters[key]
        return (
          <button
            key={key}
            onClick={() => onToggle(key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 12px',
              borderRadius: 20,
              border: `1.5px solid ${fc.dot}`,
              background: active ? fc.dot : 'transparent',
              color: active ? 'white' : fc.dot,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 150ms ease, color 150ms ease',
              flexShrink: 0,
            }}
          >
            <span style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: active ? 'rgba(255,255,255,0.8)' : fc.dot,
              flexShrink: 0,
            }} />
            {fc.label}
          </button>
        )
      })}
    </div>
  )
}
