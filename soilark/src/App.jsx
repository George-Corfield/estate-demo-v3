import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { ROLES } from './constants/roles'
import Shell from './components/layout/Shell'
import OverviewPage from './modules/overview/OverviewPage'
import FieldsPage from './modules/fields/FieldsPage'
import TasksPage from './modules/tasks/TasksPage'
import MachineryPage from './modules/machinery/MachineryPage'
import StaffPage from './modules/staff/StaffPage'

function RequireRole({ role, children }) {
  const { currentUser } = useApp()
  if (currentUser.role !== role) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<Shell />}>
            <Route index element={<OverviewPage />} />
            <Route path="fields" element={<FieldsPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="staff" element={<RequireRole role={ROLES.FARM_MANAGER}><StaffPage /></RequireRole>} />
            <Route path="machinery" element={<RequireRole role={ROLES.FARM_MANAGER}><MachineryPage /></RequireRole>} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}
