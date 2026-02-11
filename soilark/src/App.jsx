import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Shell from './components/layout/Shell'
import OverviewPage from './modules/overview/OverviewPage'
import FieldsPage from './modules/fields/FieldsPage'
import TasksPage from './modules/tasks/TasksPage'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<Shell />}>
            <Route index element={<OverviewPage />} />
            <Route path="fields" element={<FieldsPage />} />
            <Route path="tasks" element={<TasksPage />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}
