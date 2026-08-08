import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { getMyTasks } from '../../../services/taskService'

export function InternTaskListPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')

  const filteredTasks = useMemo(() => {
    if (!status) return tasks
    return tasks.filter((task) => task.status === status)
  }, [tasks, status])

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        setTasks(await getMyTasks())
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load tasks')
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
          <h1>My Tasks</h1>
          <p>Tasks assigned to you by your supervisor.</p>
        </div>
        <Link to="/intern/submissions/new" className="btn-primary">
          Submit Work
        </Link>
      </div>

      <div className="toolbar">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="REVISION_REQUIRED">Revision Required</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <div className="table-card">
        {loading ? (
          <p>Loading...</p>
        ) : filteredTasks.length === 0 ? (
          <p>No tasks assigned yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Deadline</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.priority || '—'}</td>
                  <td>
                    <span className={`status-pill status-${task.status?.toLowerCase()}`}>
                      {task.status}
                    </span>
                  </td>
                  <td>{task.deadline || '—'}</td>
                  <td className="table-actions">
                    {task.status !== 'COMPLETED' && (
                      <Link to="/intern/submissions/new" className="btn-secondary">
                        Submit
                      </Link>
                    )}
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
