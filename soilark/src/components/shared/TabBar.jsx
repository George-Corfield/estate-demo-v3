export default function TabBar({ tabs, activeTab, onChange }) {
  return (
    <div className="flex gap-0" style={{ borderBottom: '1px solid var(--color-surface-300)' }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="relative"
          style={{
            padding: '12px 20px',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: activeTab === tab.id ? 500 : 400,
            color: activeTab === tab.id ? 'var(--color-slate-900)' : 'var(--color-slate-500)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 120ms ease',
          }}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 2,
                background: 'var(--color-green-500)',
              }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
