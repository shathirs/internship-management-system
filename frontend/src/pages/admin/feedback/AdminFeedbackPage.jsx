import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { getAdminFeedbackBoard } from '../../../services/feedbackService'
import { getInterns } from '../../../services/internService'

export function AdminFeedbackPage() {
  const [pending, setPending] = useState([])
  const [recent, setRecent] = useState([])
  const [interns, setInterns] = useState([])
  const [loading, setLoading] = useState(true)

  const internsById = useMemo(
    () => Object.fromEntries(interns.map((i) => [i.id, i])),
    [interns]
  )

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [board, internList] = await Promise.all([
          getAdminFeedbackBoard(),
          getInterns(),
        ])
        setPending(board.pending)
        setRecent(board.recent)
        setInterns(internList)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load feedback')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function renderTable(items, { showComment }) {
    if (items.length === 0) {
      return <p>None.</p>
    }

    return (
      <table className="data-table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Intern</th>
            <th>Title</th>
            <th>Status</th>
            {showComment ? <th>Comment</th> : null}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                {item.source === 'SUBMISSION' ? 'Submission' : 'Work log'}
              </td>
              <td>{internsById[item.internId]?.fullName || '—'}</td>
              <td>{item.title}</td>
              <td>
                <span
                  className={`status-pill status-${item.status?.toLowerCase()}`}
                >
                  {item.status}
                </span>
              </td>
              {showComment ? <td>{item.comment || '—'}</td> : null}
              <td>
                <Link to={item.href} className="btn-secondary">
                  {showComment ? 'Open' : 'Review'}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Feedback</h1>
          <p>Pending reviews and recent supervisor comments.</p>
        </div>
      </div>

      {loading ? (
        <div className="table-card">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <div className="table-card" style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ marginBottom: '0.75rem', fontSize: '1.05rem' }}>
              Pending reviews
            </h2>
            {renderTable(pending, { showComment: false })}
          </div>

          <div className="table-card">
            <h2 style={{ marginBottom: '0.75rem', fontSize: '1.05rem' }}>
              Recent feedback
            </h2>
            {renderTable(recent, { showComment: true })}
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
