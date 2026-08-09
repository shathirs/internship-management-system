import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { DashboardStatCards } from '../../components/dashboard/DashboardStatCards'
import { QuickActions } from '../../components/dashboard/QuickActions'
import { RecentActivities } from '../../components/dashboard/RecentActivities'
import { UpcomingDeadlines } from '../../components/dashboard/UpcomingDeadlines'
import { getDashboardSummary } from '../../services/dashboardService'

export function AdminDashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        setSummary(await getDashboardSummary())
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Welcome back, <strong>{user?.name}</strong>. Here’s an overview of your
            internship program.
          </p>
        </div>
      </div>

      {loading ? (
        <p>Loading dashboard…</p>
      ) : !summary ? (
        <p>No dashboard data available.</p>
      ) : (
        <>
          <DashboardStatCards summary={summary} />

          <div className="dashboard-panels">
            <RecentActivities items={summary.recentActivities} />
            <QuickActions />
          </div>

          <div className="dashboard-panels">
            <UpcomingDeadlines items={summary.upcomingDeadlines} />
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
