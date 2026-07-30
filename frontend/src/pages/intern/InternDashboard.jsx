import { useAuth } from '../../context/AuthContext'
import { DashboardLayout } from '../../components/layout/DashboardLayout'

export function InternDashboard() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <h1>Intern Dashboard</h1>
      <p>
        Welcome back, <strong>{user?.name}</strong>.
      </p>
    </DashboardLayout>
  )
}
