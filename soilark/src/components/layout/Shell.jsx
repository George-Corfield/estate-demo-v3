import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import FAB from './FAB'
import Toast from './Toast'

export default function Shell() {
  return (
    <div className="flex h-screen w-full bg-background-light overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar />
        <main className="flex-1 overflow-hidden relative">
          <Outlet />
        </main>
      </div>
      <FAB />
      <Toast />
    </div>
  )
}
