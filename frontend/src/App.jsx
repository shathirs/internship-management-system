import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { LoginPage } from './pages/auth/LoginPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { InternDashboard } from './pages/intern/InternDashboard'
import { RoleRoute } from './components/auth/RoleRoute'
import { InternListPage } from './pages/admin/interns/InternListPage'
import { CreateInternPage } from './pages/admin/interns/CreateInternPage'
import { EditInternPage } from './pages/admin/interns/EditInternPage'
import { ProjectListPage } from './pages/admin/projects/ProjectListPage'
import { CreateProjectPage } from './pages/admin/projects/CreateProjectPage'
import { EditProjectPage } from './pages/admin/projects/EditProjectPage'
import { TaskListPage } from './pages/admin/tasks/TaskListPage'
import { CreateTaskPage } from './pages/admin/tasks/CreateTaskPage'
import { EditTaskPage } from './pages/admin/tasks/EditTaskPage'
import { AssignTaskPage } from './pages/admin/tasks/AssignTaskPage'
import { WorkLogListPage } from './pages/admin/work-logs/WorkLogListPage'
import { ReviewWorkLogPage } from './pages/admin/work-logs/ReviewWorkLogPage'
import { InternWorkLogListPage } from './pages/intern/work-logs/InternWorkLogListPage'
import { SubmitWorkLogPage } from './pages/intern/work-logs/SubmitWorkLogPage'
import { SubmissionListPage } from './pages/admin/submissions/SubmissionListPage'
import { ReviewSubmissionPage } from './pages/admin/submissions/ReviewSubmissionPage'
import { InternSubmissionListPage } from './pages/intern/submissions/InternSubmissionListPage'
import { SubmitWorkPage } from './pages/intern/submissions/SubmitWorkPage'
import { AdminFeedbackPage } from './pages/admin/feedback/AdminFeedbackPage'
import { InternFeedbackPage } from './pages/intern/feedback/InternFeedbackPage'
import { ReportsPage } from './pages/admin/reports/ReportsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <RoleRoute allow={['ADMIN']}>
              <AdminDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/interns"
          element={
            <RoleRoute allow={['ADMIN']}>
              <InternListPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/interns/new"
          element={
            <RoleRoute allow={['ADMIN']}>
              <CreateInternPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/interns/:id/edit"
          element={
            <RoleRoute allow={['ADMIN']}>
              <EditInternPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <RoleRoute allow={['ADMIN']}>
              <ProjectListPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/projects/new"
          element={
            <RoleRoute allow={['ADMIN']}>
              <CreateProjectPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/projects/:id/edit"
          element={
            <RoleRoute allow={['ADMIN']}>
              <EditProjectPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/tasks"
          element={
            <RoleRoute allow={['ADMIN']}>
              <TaskListPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/tasks/new"
          element={
            <RoleRoute allow={['ADMIN']}>
              <CreateTaskPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/tasks/:id/assign"
          element={
            <RoleRoute allow={['ADMIN']}>
              <AssignTaskPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/tasks/:id/edit"
          element={
            <RoleRoute allow={['ADMIN']}>
              <EditTaskPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/work-logs"
          element={
            <RoleRoute allow={['ADMIN']}>
              <WorkLogListPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/work-logs/:id/review"
          element={
            <RoleRoute allow={['ADMIN']}>
              <ReviewWorkLogPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/submissions"
          element={
            <RoleRoute allow={['ADMIN']}>
              <SubmissionListPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/submissions/:id/review"
          element={
            <RoleRoute allow={['ADMIN']}>
              <ReviewSubmissionPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/feedback"
          element={
            <RoleRoute allow={['ADMIN']}>
              <AdminFeedbackPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <RoleRoute allow={['ADMIN']}>
              <ReportsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/intern"
          element={
            <RoleRoute allow={['INTERN']}>
              <InternDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/intern/work-logs"
          element={
            <RoleRoute allow={['INTERN']}>
              <InternWorkLogListPage />
            </RoleRoute>
          }
        />
        <Route
          path="/intern/work-logs/new"
          element={
            <RoleRoute allow={['INTERN']}>
              <SubmitWorkLogPage />
            </RoleRoute>
          }
        />
        <Route
          path="/intern/submissions"
          element={
            <RoleRoute allow={['INTERN']}>
              <InternSubmissionListPage />
            </RoleRoute>
          }
        />
        <Route
          path="/intern/submissions/new"
          element={
            <RoleRoute allow={['INTERN']}>
              <SubmitWorkPage />
            </RoleRoute>
          }
        />
        <Route
          path="/intern/feedback"
          element={
            <RoleRoute allow={['INTERN']}>
              <InternFeedbackPage />
            </RoleRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: '0.875rem',
            borderRadius: '0.75rem',
          },
          success: {
            style: {
              background: '#f0fdf4',
              color: '#166534',
              border: '1px solid #bbf7d0',
            },
          },
          error: {
            style: {
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
            },
          },
        }}
      />
    </BrowserRouter>
  )
}

export default App
