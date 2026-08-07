import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { getMyWorkLogs } from '../../../services/workLogService'

export function InternWorkLogListPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await getMyWorkLogs()
        setLogs(data)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load work logs')
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
          <h1>My Daily Work Logs</h1>
          <p>View submitted logs and supervisor feedback.</p>
        </div>
        <Link to="/intern/work-logs/new" className="btn-primary">
          Submit Log
        </Link>
      </div>

      <div className="table-card">
        {loading ? (
          <p>Loading...</p>
        ) : logs.length === 0 ? (
          <p>No work logs yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Hours</th>
                <th>Status</th>
                <th>Admin comment</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.logDate}</td>
                  <td>{log.hoursWorked ?? '—'}</td>
                  <td>
                    <span
                      className={`status-pill status-${log.status?.toLowerCase()}`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td>{log.adminComment || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  )
}
