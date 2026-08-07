import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { getInternFeedbackInbox } from '../../../services/feedbackService'

export function InternFeedbackPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await getInternFeedbackInbox()
        setItems(data)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load feedback')
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
          <h1>Feedback</h1>
          <p>Supervisor comments on your submissions and work logs.</p>
        </div>
      </div>

      <div className="table-card">
        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p>No feedback yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Title</th>
                <th>Status</th>
                <th>Comment</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.source === 'SUBMISSION' ? 'Submission' : 'Work log'}
                  </td>
                  <td>{item.title}</td>
                  <td>
                    <span
                      className={`status-pill status-${item.status?.toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>{item.comment || '—'}</td>
                  <td>
                    {item.date ? new Date(item.date).toLocaleDateString() : '—'}
                  </td>
                  <td>
                    <Link to={item.href} className="btn-secondary">
                      Open
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
