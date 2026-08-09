import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { InternDashboardStatCards } from '../../components/dashboard/InternDashboardStatCards'
import { InternQuickActions } from '../../components/dashboard/InternQuickActions'
import { RecentActivities } from '../../components/dashboard/RecentActivities'
import { InternUpcomingDeadlines } from '../../components/dashboard/InternUpcomingDeadlines'
import { getInternDashboardSummary } from '../../services/dashboardService'

export function InternDashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        setSummary(await getInternDashboardSummary())
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
          <h1>Intern Dashboard</h1>
          <p>
            Welcome back, <strong>{user?.name}</strong>. Here’s your internship overview.
          </p>
        </div>
      </div>

      {loading ? (
        <p>Loading dashboard…</p>
      ) : !summary ? (
        <p>No dashboard data available.</p>
      ) : (
        <>
          <InternDashboardStatCards summary={summary} />

          <div className="dashboard-panels">
            <RecentActivities items={summary.recentNotifications} />
            <InternQuickActions />
          </div>

          <div className="dashboard-panels">
            <InternUpcomingDeadlines items={summary.upcomingDeadlines} />
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
