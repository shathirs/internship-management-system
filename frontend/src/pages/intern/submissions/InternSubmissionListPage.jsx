import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { getMySubmissions } from '../../../services/submissionService'
import { getMyTasks } from '../../../services/taskService'

export function InternSubmissionListPage() {
  const [submissions, setSubmissions] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const tasksById = useMemo(() => {
    return Object.fromEntries(tasks.map((t) => [t.id, t]))
  }, [tasks])

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [submissionList, taskList] = await Promise.all([
          getMySubmissions(),
          getMyTasks(),
        ])
        setSubmissions(submissionList)
        setTasks(taskList)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load submissions')
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
          <h1>My Submissions</h1>
          <p>View submitted work and supervisor feedback.</p>
        </div>
        <Link to="/intern/submissions/new" className="btn-primary">
          Submit Work
        </Link>
      </div>

      <div className="table-card">
        {loading ? (
          <p>Loading...</p>
        ) : submissions.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Admin comment</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id}>
                  <td>{tasksById[submission.taskId]?.title || '—'}</td>
                  <td>
                    <span
                      className={`status-pill status-${submission.status?.toLowerCase()}`}
                    >
                      {submission.status}
                    </span>
                  </td>
                  <td>{submission.completionNotes || '—'}</td>
                  <td>{submission.adminComment || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  )
}
