import api from '../lib/api'

export async function getDashboardSummary() {
  const { data } = await api.get('/api/dashboard/summary')
  return data
}

export async function getInternDashboardSummary() {
  const { data } = await api.get('/api/dashboard/me')
  return data
}
