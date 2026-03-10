import { useState } from 'react'
import { useApp } from '../../context/AppContext'

const PALETTE = [
  { bg: '#fcd34d', border: '#f59e0b' },
  { bg: '#fbbf24', border: '#d97706' },
  { bg: '#facc15', border: '#ca8a04' },
  { bg: '#fde68a', border: '#f59e0b' },
  { bg: '#fed7aa', border: '#ea580c' },
  { bg: '#f97316', border: '#c2410c' },
  { bg: '#ef4444', border: '#b91c1c' },
  { bg: '#fca5a5', border: '#dc2626' },
  { bg: '#f472b6', border: '#db2777' },
  { bg: '#e879f9', border: '#a21caf' },
  { bg: '#c084fc', border: '#7c3aed' },
  { bg: '#818cf8', border: '#4f46e5' },
  { bg: '#60a5fa', border: '#2563eb' },
  { bg: '#38bdf8', border: '#0284c7' },
  { bg: '#22d3ee', border: '#0891b2' },
  { bg: '#2dd4bf', border: '#0d9488' },
  { bg: '#4ade80', border: '#16a34a' },
  { bg: '#a3e635', border: '#65a30d' },
  { bg: '#86efac', border: '#22c55e' },
  { bg: '#13ec13', border: '#0fb80f' },
  { bg: '#34d399', border: '#059669' },
  { bg: '#6ee7b7', border: '#10b981' },
  { bg: '#B57E5D', border: '#8B5A3C' },
  { bg: '#d4a574', border: '#a0714a' },
  { bg: '#e9d5a0', border: '#c2a050' },
  { bg: '#d1d5db', border: '#6b7280' },
  { bg: '#94a3b8', border: '#475569' },
  { bg: '#f1f5f9', border: '#94a3b8' },
  { bg: '#1e293b', border: '#0f172a' },
  { bg: '#475569', border: '#1e293b' },
]

function textColorFor(bg) {
  const hex = bg.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#0f172a' : '#f8fafc'
}

export default function UsageManager({ onBack }) {
  const { usages, updateUsage, addUsage, showToast } = useApp()
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editBg, setEditBg] = useState('')
  const [editBorder, setEditBorder] = useState('')
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newBg, setNewBg] = useState(PALETTE[0].bg)
  const [newBorder, setNewBorder] = useState(PALETTE[0].border)

  const startEdit = (usage) => {
    setAdding(false)
    setEditingId(usage.id)
    setEditName(usage.name)
    setEditBg(usage.bg)
    setEditBorder(usage.border)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = () => {
    if (!editName.trim()) return
    updateUsage(editingId, { name: editName.trim(), bg: editBg, border: editBorder })
    showToast(`Usage updated`)
    setEditingId(null)
  }

  const startAdd = () => {
    setEditingId(null)
    setNewName('')
    setNewBg(PALETTE[0].bg)
    setNewBorder(PALETTE[0].border)
    setAdding(true)
  }

  const cancelAdd = () => {
    setAdding(false)
  }

  const saveAdd = () => {
    if (!newName.trim()) return
    addUsage({ id: `usage-${Date.now()}`, name: newName.trim(), bg: newBg, border: newBorder })
    showToast(`${newName.trim()} added`)
    setAdding(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div style={{ padding: 16, borderBottom: '1px solid var(--color-surface-300)' }}>
        <button
          onClick={onBack}
          className="btn btn-ghost flex items-center gap-1 mb-3"
          style={{ padding: '4px 8px', fontSize: 13 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          Back to fields
        </button>
        <h2 className="text-heading-3 flex items-center gap-2" style={{ color: 'var(--color-slate-900)', margin: 0 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-green-500)' }}>palette</span>
          Manage Usages
        </h2>
      </div>

      {/* Usage list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ padding: 16 }}>
        <div className="flex flex-col gap-2">
          {usages.map(usage => (
            <div
              key={usage.id}
              style={{ border: '1px solid var(--color-surface-300)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}
            >
              <button
                onClick={() => editingId === usage.id ? cancelEdit() : startEdit(usage)}
                className="w-full flex items-center gap-3 p-3"
                style={{
                  background: editingId === usage.id ? 'var(--color-surface-100)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 120ms ease',
                }}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    backgroundColor: usage.bg,
                    border: `2px solid ${usage.border}`,
                    flexShrink: 0,
                  }}
                />
                <span className="text-heading-4 flex-1 text-left" style={{ color: 'var(--color-slate-900)' }}>
                  {usage.name}
                </span>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-slate-400)' }}>
                  {editingId === usage.id ? 'expand_less' : 'edit'}
                </span>
              </button>

              {editingId === usage.id && (
                <div style={{ padding: '0 12px 12px' }} className="flex flex-col gap-3">
                  <div>
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Colour</label>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(6, 1fr)',
                        gap: 6,
                        marginTop: 4,
                      }}
                    >
                      {PALETTE.map((c, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => { setEditBg(c.bg); setEditBorder(c.border) }}
                          style={{
                            width: '100%',
                            aspectRatio: '1',
                            borderRadius: 6,
                            backgroundColor: c.bg,
                            border: editBg === c.bg && editBorder === c.border
                              ? '3px solid var(--color-green-500)'
                              : `2px solid ${c.border}`,
                            cursor: 'pointer',
                            transition: 'transform 100ms ease',
                            transform: editBg === c.bg && editBorder === c.border ? 'scale(1.15)' : 'scale(1)',
                          }}
                          title={c.bg}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button onClick={saveEdit} className="btn btn-primary flex-1" style={{ fontSize: 13 }}>
                      Save
                    </button>
                    <button onClick={cancelEdit} className="btn btn-secondary" style={{ fontSize: 13 }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add new usage */}
          {adding ? (
            <div style={{ border: '1px solid var(--color-green-500)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <div style={{ padding: 12 }} className="flex flex-col gap-3">
                <div>
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="form-input"
                    placeholder="e.g. Sugar beet"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="form-label">Colour</label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(6, 1fr)',
                      gap: 6,
                      marginTop: 4,
                    }}
                  >
                    {PALETTE.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { setNewBg(c.bg); setNewBorder(c.border) }}
                        style={{
                          width: '100%',
                          aspectRatio: '1',
                          borderRadius: 6,
                          backgroundColor: c.bg,
                          border: newBg === c.bg && newBorder === c.border
                            ? '3px solid var(--color-green-500)'
                            : `2px solid ${c.border}`,
                          cursor: 'pointer',
                          transition: 'transform 100ms ease',
                          transform: newBg === c.bg && newBorder === c.border ? 'scale(1.15)' : 'scale(1)',
                        }}
                        title={c.bg}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button onClick={saveAdd} className="btn btn-primary flex-1" style={{ fontSize: 13 }}>
                    Add
                  </button>
                  <button onClick={cancelAdd} className="btn btn-secondary" style={{ fontSize: 13 }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={startAdd}
              className="w-full flex items-center justify-center gap-2 p-3"
              style={{
                border: '1px dashed var(--color-surface-300)',
                borderRadius: 'var(--radius-md)',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--color-slate-400)',
                fontSize: 13,
                transition: 'all 120ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-green-500)'; e.currentTarget.style.color = 'var(--color-green-600)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-surface-300)'; e.currentTarget.style.color = 'var(--color-slate-400)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
              Add Usage
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
