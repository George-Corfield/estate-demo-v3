import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import Toast from './Toast'
import FAB from './FAB'
import BottomNav from './BottomNav'
import AskLandarkPanel from '../shared/AskLandarkPanel'
import useIsMobile from '../../hooks/useIsMobile'

export default function Shell() {
  const isMobile = useIsMobile()
  const [landarkOpen, setLandarkOpen] = useState(false)

  useEffect(() => {
    const handler = () => setLandarkOpen(true)
    window.addEventListener('open-ask-landark', handler)
    return () => window.removeEventListener('open-ask-landark', handler)
  }, [])

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--color-surface-50)' }}>
      {!isMobile && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar />
        <main
          className="flex-1 overflow-hidden relative"
          style={isMobile ? { paddingBottom: 'var(--bottom-nav-height)' } : undefined}
        >
          <Outlet />
        </main>
      </div>
      <Toast />
      <FAB />
      {isMobile && <BottomNav />}

      {landarkOpen && (
        <>
          {!isMobile && (
            <div
              onClick={() => setLandarkOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.3)',
                zIndex: 55,
              }}
            />
          )}
          <div style={isMobile ? {
            position: 'fixed', inset: 0, zIndex: 60,
            background: 'var(--color-surface-50)',
          } : {
            position: 'fixed', top: 0, right: 0, bottom: 0,
            width: 400, zIndex: 60,
            background: 'var(--color-surface-50)',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
          }}>
            <AskLandarkPanel onClose={() => setLandarkOpen(false)} />
          </div>
        </>
      )}
    </div>
  )
}
