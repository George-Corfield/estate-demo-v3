import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const PRESET_QUERY = 'Show me what I have done for fertilisation previously on North Field'

const FERTILISATION_TASKS = [
  { id: 'task-fert-01', name: 'Spring Nitrogen Application', date: '14 Mar 2024', product: 'Ammonium Nitrate 34.5%', rate: '180 kg/ha', method: 'Broadcast Spreader' },
  { id: 'task-fert-02', name: 'Pre-Harvest Foliar Feed', date: '22 Jun 2024', product: 'Yara Bela Sulfan', rate: '25 kg/ha', method: 'Sprayer' },
  { id: 'task-fert-03', name: 'Autumn Phosphate Dressing', date: '8 Oct 2024', product: 'Triple Superphosphate', rate: '120 kg/ha', method: 'Broadcast Spreader' },
]

export default function AskLandarkPanel({ onClose }) {
  const [phase, setPhase] = useState('idle') // idle | thinking | response
  const [query, setQuery] = useState(PRESET_QUERY)
  const navigate = useNavigate()

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const timerRef = useRef(null)

  const handleAsk = () => {
    setPhase('thinking')
    timerRef.current = setTimeout(() => setPhase('response'), 2000)
  }

  const handleReset = () => {
    setQuery(PRESET_QUERY)
    setPhase('idle')
  }

  const goToTask = (taskId) => {
    onClose()
    navigate('/tasks', { state: { openTaskId: taskId } })
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '24px 20px',
      background: 'var(--color-surface-50)',
      overflowY: 'auto',
      boxSizing: 'border-box',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 22, marginRight: 8, color: 'var(--color-green-600)' }}
        >
          smart_toy
        </span>
        <span style={{ fontSize: 16, fontWeight: 600, flex: 1, color: 'var(--color-slate-900)' }}>
          Ask LandArk
        </span>
        <button
          type="button"
          onClick={onClose}
          className="btn btn-ghost"
          style={{ padding: 4 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-slate-500)' }}>
            close
          </span>
        </button>
      </div>

      {/* AI Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 99,
        marginBottom: 16,
        background: 'rgba(19,236,19,0.08)',
        border: '1px solid rgba(19,236,19,0.2)',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--color-green-700)',
        alignSelf: 'flex-start',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>auto_awesome</span>
        Powered by LandArk AI
      </div>

      {phase === 'idle' && (
        <>
          <p style={{ fontSize: 13, color: 'var(--color-slate-500)', marginBottom: 16, lineHeight: 1.5 }}>
            Ask LandArk about your fields, tasks, and farm history.
          </p>
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="form-textarea"
            style={{ minHeight: 140, maxHeight: 240, resize: 'vertical' }}
          />
          <div style={{ display: 'flex', marginTop: 16 }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={handleAsk}
              disabled={!query.trim()}
            >
              Ask LandArk
            </button>
          </div>
        </>
      )}

      {phase === 'thinking' && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          minHeight: 200,
        }}>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 36, color: 'var(--color-green-600)', animation: 'landark-spin 1s linear infinite' }}
          >
            smart_toy
          </span>
          <span style={{ fontSize: 13, color: 'var(--color-slate-500)' }}>LandArk is thinking...</span>
        </div>
      )}

      {phase === 'response' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Sent bubble */}
          <div style={{
            background: 'var(--color-surface-200)',
            borderRadius: '12px 12px 4px 12px',
            padding: '8px 12px',
            fontSize: 12,
            color: 'var(--color-slate-600)',
            marginBottom: 20,
            alignSelf: 'flex-end',
            maxWidth: '85%',
          }}>
            {query}
          </div>

          {/* Response prose */}
          <p style={{ fontSize: 13, color: 'var(--color-slate-700)', lineHeight: 1.6, marginBottom: 16 }}>
            North Field (18.3 ha) received three fertiliser applications in 2024. Here's a summary of what was recorded:
          </p>

          {/* Section label */}
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--color-slate-500)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 8,
          }}>
            Previous Fertilisation — North Field
          </div>

          {/* Task cards */}
          {FERTILISATION_TASKS.map(task => (
            <button
              key={task.id}
              onClick={() => goToTask(task.id)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                background: 'var(--color-surface-100)',
                border: '1px solid var(--color-surface-300)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                marginBottom: 8,
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-slate-800)' }}>{task.name}</span>
                <span style={{ fontSize: 11, color: 'var(--color-slate-500)', marginLeft: 8, whiteSpace: 'nowrap' }}>{task.date}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-slate-500)', marginTop: 2 }}>
                {task.product} · {task.rate} · {task.method}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 6,
                color: 'var(--color-green-600)',
                fontSize: 11,
                fontWeight: 500,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>open_in_new</span>
                View task
              </div>
            </button>
          ))}

          {/* Summary note */}
          <p style={{ fontSize: 12, color: 'var(--color-slate-500)', marginTop: 8, lineHeight: 1.5 }}>
            Total nitrogen applied in 2024: approximately 205 kg/ha across three applications. No fertiliser applications recorded for North Field in 2023.
          </p>

          <button
            type="button"
            className="btn btn-ghost"
            style={{ marginTop: 16 }}
            onClick={handleReset}
          >
            Ask another question
          </button>
        </div>
      )}

      <style>{`
        @keyframes landark-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
