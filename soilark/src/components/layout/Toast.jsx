import { useApp } from '../../context/AppContext'

export default function Toast() {
  const { toasts } = useApp()

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed z-[100] flex flex-col gap-2"
      style={{ bottom: 24, right: 24 }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast-enter flex items-center gap-2"
          style={{
            padding: '10px 16px',
            background: 'var(--color-surface-50)',
            border: '1px solid var(--color-surface-300)',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--color-slate-900)',
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 18,
              color: toast.toastType === 'error'
                ? 'var(--color-amber-400)'
                : 'var(--color-green-500)',
            }}
          >
            {toast.toastType === 'success' ? 'check_circle' : toast.toastType === 'error' ? 'warning' : 'info'}
          </span>
          {toast.message}
        </div>
      ))}
    </div>
  )
}
