import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { formatShortDate } from '../../utils/dates'

export default function ObservationThread({ entityType, entityId, observations, legacyComments = [] }) {
  const { currentUser, addObservation } = useApp()
  const [text, setText] = useState('')
  const [attachment, setAttachment] = useState(null)

  // Normalise legacy comments to observation shape
  const normalised = legacyComments.map(c => ({
    id: c.id,
    timestamp: c.date,
    authorId: null,
    authorName: c.author,
    authorInitials: c.author.split(' ').map(n => n[0]).join(''),
    text: c.text,
    attachment: null,
  }))

  const merged = [...(observations || []), ...normalised].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    const obs = {
      id: 'obs-' + Date.now(),
      timestamp: new Date().toISOString(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorInitials: currentUser.initials,
      text: text.trim(),
      attachment: attachment || null,
    }
    addObservation(entityType, entityId, obs)
    setText('')
    setAttachment(null)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAttachment({ name: file.name, type: file.type.startsWith('image/') ? 'image' : 'file' })
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Composer */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add a note or observation..."
          className="form-input"
          style={{ minHeight: 72, resize: 'vertical' }}
        />
        <div className="flex items-center gap-2">
          <label
            className="btn btn-ghost"
            style={{ cursor: 'pointer', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>attach_file</span>
            {attachment ? attachment.name : 'Attach file'}
            <input type="file" style={{ display: 'none' }} onChange={handleFileChange} />
          </label>
          {attachment && (
            <button
              type="button"
              className="btn btn-ghost"
              style={{ fontSize: 12 }}
              onClick={() => setAttachment(null)}
            >
              ✕
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginLeft: 'auto' }}
            disabled={!text.trim()}
          >
            Post
          </button>
        </div>
      </form>

      {/* Thread */}
      {merged.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--color-slate-400)', fontStyle: 'italic', fontSize: 13, fontFamily: 'var(--font-body)', padding: '16px 0' }}>
          No notes yet — add the first one above.
        </p>
      ) : (
        <div className="flex flex-col">
          {merged.map((entry, index) => (
            <div
              key={entry.id}
              className="flex gap-3 py-4"
              style={{ borderTop: index !== 0 ? '1px solid var(--color-surface-300)' : 'none' }}
            >
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--color-surface-200)',
                  color: 'var(--color-slate-500)',
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {entry.authorInitials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-heading-4" style={{ color: 'var(--color-slate-900)' }}>
                    {entry.authorName}
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-slate-400)' }}>
                    {formatShortDate(entry.timestamp)}
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-slate-600)', margin: 0 }}>
                  {entry.text}
                </p>
                {entry.attachment && (
                  <div
                    style={{
                      marginTop: 6,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '2px 8px',
                      background: 'var(--color-surface-200)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 12,
                      color: 'var(--color-slate-500)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                      {entry.attachment.type === 'image' ? 'image' : 'attach_file'}
                    </span>
                    {entry.attachment.name}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
