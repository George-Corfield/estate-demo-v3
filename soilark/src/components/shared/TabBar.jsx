export default function TabBar({ tabs, activeTab, onChange }) {
  return (
    <div className="flex gap-0 border-b border-slate-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-5 py-3 text-sm font-medium transition-colors relative ${
            activeTab === tab.id
              ? 'text-primary'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      ))}
    </div>
  )
}
