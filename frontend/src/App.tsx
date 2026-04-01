import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import AuthGuard from '@/components/AuthGuard'
import Layout from '@/components/Layout'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import TaskListPage from '@/pages/TaskListPage'
import TaskFormPage from '@/pages/TaskFormPage'
import TrashPage from '@/pages/TrashPage'
import SettingsPage from '@/pages/SettingsPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AuthGuard><Layout /></AuthGuard>}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tasks" element={<TaskListPage />} />
            <Route path="/tasks/new" element={<TaskFormPage />} />
            <Route path="/tasks/:id/edit" element={<TaskFormPage />} />
            <Route path="/trash" element={<TrashPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
