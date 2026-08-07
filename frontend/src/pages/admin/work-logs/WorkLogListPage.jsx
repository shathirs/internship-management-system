import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { MessageSquare } from 'lucide-react'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { getWorkLogs } from '../../../services/workLogService'
import { getInterns } from '../../../services/internService'

export function WorkLogListPage() {
  const [logs, setLogs] = useState([])
  const [interns, setInterns] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [internId, setInternId] = useState('')

  const internsById = useMemo(() => {
    return Object.fromEntries(interns.map((i) => [i.id, i]))
  }, [interns])

  async function loadInterns() {
    try {
      const data = await getInterns()
      setInterns(data)
    } catch {
      toast.error('Failed to load interns')
    }
  }

  async function loadLogs() {
    setLoading(true)
    try {
      const data = await getWorkLogs({
        status: status || undefined,
        internId: internId || undefined,
      })
      setLogs(data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load work logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInterns()
    loadLogs()
  }, [])

  function handleFilter(e) {
    e.preventDefault()
    loadLogs()
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Daily Work Logs</h1>
          <p>View and review intern daily progress reports.</p>
        </div>
      </div>

      <form className="toolbar" onSubmit={handleFilter}>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="NEEDS_REVISION">Needs Revision</option>
        </select>
        <select value={internId} onChange={(e) => setInternId(e.target.value)}>
          <option value="">All interns</option>
          {interns.map((intern) => (
            <option key={intern.id} value={intern.id}>
              {intern.fullName}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-secondary">
          Apply
        </button>
      </form>

      <div className="table-card">
        {loading ? (
          <p>Loading...</p>
        ) : logs.length === 0 ? (
          <p>No work logs found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Intern</th>
                <th>Hours</th>
                <th>Status</th>
                <th>Comment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.logDate}</td>
                  <td>{internsById[log.internId]?.fullName || '—'}</td>
                  <td>{log.hoursWorked ?? '—'}</td>
                  <td>
                    <span
                      className={`status-pill status-${log.status?.toLowerCase()}`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td>{log.adminComment || '—'}</td>
                  <td className="table-actions">
                    <Link
                      to={`/admin/work-logs/${log.id}/review`}
                      title="Review"
                      aria-label="Review"
                    >
                      <MessageSquare size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  )
}
