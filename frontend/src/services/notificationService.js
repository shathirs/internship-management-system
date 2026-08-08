import api from '../lib/api'

export async function getMyNotifications() {
  const { data } = await api.get('/api/notifications')
  return data
}

export async function getUnreadCount() {
  const { data } = await api.get('/api/notifications/unread-count')
  return data.count
}

export async function markNotificationRead(id) {
  const { data } = await api.patch(`/api/notifications/${id}/read`)
  return data
}

export async function markAllNotificationsRead() {
  await api.patch('/api/notifications/read-all')
}
