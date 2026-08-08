import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../../services/notificationService'

function formatType(type) {
  return (type || '')
    .split('_')
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ')
}

export function InternNotificationsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      setItems(await getMyNotifications())
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleMarkRead(id) {
    try {
      const updated = await markNotificationRead(id)
      setItems((prev) => prev.map((n) => (n.id === id ? updated : n)))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark as read')
    }
  }

  async function handleMarkAll() {
    try {
      await markAllNotificationsRead()
      setItems((prev) => prev.map((n) => ({ ...n, read: true })))
      toast.success('All marked as read')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark all as read')
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p>Task assignments, deadlines, and submission updates.</p>
        </div>
        <button type="button" className="btn-secondary" onClick={handleMarkAll}>
          Mark all as read
        </button>
      </div>

      <div className="table-card">
        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Message</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className={item.read ? '' : 'notification-unread'}>
                  <td>
                    <span className="status-pill">{formatType(item.type)}</span>
                  </td>
                  <td>{item.title}</td>
                  <td>{item.message}</td>
                  <td>
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
                  </td>
                  <td className="table-actions">
                    {!item.read && (
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => handleMarkRead(item.id)}
                      >
                        Mark read
                      </button>
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
