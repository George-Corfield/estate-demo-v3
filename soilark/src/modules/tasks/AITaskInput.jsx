import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { generateTask } from '../../utils/fakeAI'

export default function AITaskInput({ onGenerate, onBack }) {
  const { fields, machinery } = useApp()
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = () => {
    setLoading(true)
    setTimeout(() => {
      const result = generateTask(description, fields, machinery)
      setLoading(false)
      onGenerate(result)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-full" style={{ padding: '24px 20px' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-slate-500)',
            display: 'flex',
            alignItems: 'center',
            padding: 0,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
        </button>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-slate-900)', margin: 0 }}>
          New Task
        </h2>
      </div>

      {/* AI badge */}
      <div
        className="flex items-center gap-2 mb-4"
        style={{
          background: 'rgba(19,236,19,0.08)',
          border: '1px solid rgba(19,236,19,0.2)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 12px',
          display: 'inline-flex',
          alignSelf: 'flex-start',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-primary)' }}>auto_awesome</span>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-green-500)' }}>AI-assisted</span>
      </div>

      <p style={{ fontSize: 13, color: 'var(--color-slate-500)', marginBottom: 16, lineHeight: 1.5 }}>
        Describe what needs doing and the task form will be pre-filled for you.
      </p>

      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="e.g. Harvest all wheat fields next friday"
        disabled={loading}
        style={{
          width: '100%',
          flex: 1,
          minHeight: 140,
          maxHeight: 240,
          resize: 'vertical',
          padding: '12px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-surface-300)',
          background: 'var(--color-surface-50)',
          color: 'var(--color-slate-900)',
          fontSize: 14,
          fontFamily: 'var(--font-body)',
          lineHeight: 1.5,
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleGenerate}
          disabled={loading || !description.trim()}
          className="btn btn-primary flex items-center gap-2"
          style={{ flex: 1, justifyContent: 'center', opacity: loading || !description.trim() ? 0.6 : 1 }}
        >
          {loading ? (
            <>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16, animation: 'spin 1s linear infinite' }}
              >
                progress_activity
              </span>
              AI is thinking...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>auto_awesome</span>
              Generate Task
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
