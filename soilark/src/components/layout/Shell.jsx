import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import Toast from './Toast'
import FAB from './FAB'
import BottomNav from './BottomNav'
import useIsMobile from '../../hooks/useIsMobile'

export default function Shell() {
  const isMobile = useIsMobile()

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
    </div>
  )
}
