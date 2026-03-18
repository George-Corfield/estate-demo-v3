import { useState, useEffect, useRef } from 'react'
import { useApp } from '../../context/AppContext'

function relativeTime(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const TYPE_ICONS = {
  success: 'check_circle',
  warning: 'warning',
  info: 'info',
}

const TYPE_COLORS = {
  success: 'var(--color-green-500)',
  warning: 'var(--color-amber-400)',
  info: 'var(--color-slate-400)',
}

export default function NotificationBell() {
  const { notifications, currentUser, markAllNotificationsRead } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const userNotifs = notifications.filter(n => n.forUserId === currentUser.id)
  const unreadCount = userNotifs.filter(n => !n.read).length

  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const handleToggle = () => {
    if (!open) {
      markAllNotificationsRead(currentUser.id)
    }
    setOpen(prev => !prev)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleToggle}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 4,
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 16, color: 'white' }}
        >
          {unreadCount > 0 ? 'notifications_active' : 'notifications'}
        </span>
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--color-amber-400)',
              border: '1.5px solid var(--color-deep-900)',
            }}
          />
        )}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 4,
            width: 280,
            maxHeight: 320,
            overflowY: 'auto',
            background: 'var(--color-surface-50)',
            border: '1px solid var(--color-surface-300)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            zIndex: 50,
          }}
        >
          <div style={{ padding: '8px 0' }}>
            {userNotifs.length === 0 ? (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: 'var(--color-slate-400)',
                  padding: '8px 16px',
                  margin: 0,
                }}
              >
                No notifications
              </p>
            ) : (
              userNotifs.map(notif => (
                <div
                  key={notif.id}
                  className="flex items-start gap-2"
                  style={{
                    padding: '8px 16px',
                    borderBottom: '1px solid var(--color-surface-200)',
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: 16,
                      color: TYPE_COLORS[notif.type] || TYPE_COLORS.info,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {TYPE_ICONS[notif.type] || 'info'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        color: 'var(--color-slate-900)',
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {notif.message}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 11,
                        color: 'var(--color-slate-400)',
                        margin: 0,
                        marginTop: 2,
                      }}
                    >
                      {relativeTime(notif.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
