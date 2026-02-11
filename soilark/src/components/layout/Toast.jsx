import { useApp } from '../../context/AppContext'

export default function Toast() {
  const { toasts } = useApp()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-6 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 animate-[slideDown_0.3s_ease-out] ${
            toast.toastType === 'success'
              ? 'bg-emerald-800 text-white'
              : toast.toastType === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-slate-800 text-white'
          }`}
        >
          <span className="material-icons text-base">
            {toast.toastType === 'success' ? 'check_circle' : toast.toastType === 'error' ? 'error' : 'info'}
          </span>
          {toast.message}
        </div>
      ))}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
