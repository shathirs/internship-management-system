import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { MessageSquare } from 'lucide-react'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { getSubmissions } from '../../../services/submissionService'
import { getInterns } from '../../../services/internService'
import { getTasks } from '../../../services/taskService'

export function SubmissionListPage() {
  const [submissions, setSubmissions] = useState([])
  const [interns, setInterns] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [internId, setInternId] = useState('')

  const internsById = useMemo(() => {
    return Object.fromEntries(interns.map((i) => [i.id, i]))
  }, [interns])

  const tasksById = useMemo(() => {
    return Object.fromEntries(tasks.map((t) => [t.id, t]))
  }, [tasks])

  async function loadLookups() {
    try {
      const [internList, taskList] = await Promise.all([getInterns(), getTasks()])
      setInterns(internList)
      setTasks(taskList)
    } catch {
      toast.error('Failed to load interns or tasks')
    }
  }

  async function loadSubmissions() {
    setLoading(true)
    try {
      const data = await getSubmissions({
        status: status || undefined,
        internId: internId || undefined,
      })
      setSubmissions(data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLookups()
    loadSubmissions()
  }, [])

  function handleFilter(e) {
    e.preventDefault()
    loadSubmissions()
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Submissions</h1>
          <p>Review intern task submissions and leave feedback.</p>
        </div>
      </div>

      <form className="toolbar" onSubmit={handleFilter}>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="REVISION_REQUIRED">Revision Required</option>
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
        ) : submissions.length === 0 ? (
          <p>No submissions found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Intern</th>
                <th>Task</th>
                <th>Status</th>
                <th>Comment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id}>
                  <td>{internsById[submission.internId]?.fullName || '—'}</td>
                  <td>{tasksById[submission.taskId]?.title || '—'}</td>
                  <td>
                    <span
                      className={`status-pill status-${submission.status?.toLowerCase()}`}
                    >
                      {submission.status}
                    </span>
                  </td>
                  <td>{submission.adminComment || '—'}</td>
                  <td className="table-actions">
                    <Link
                      to={`/admin/submissions/${submission.id}/review`}
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
