import api from '../lib/api'

// ADMIN
export async function getWorkLogs({ status, internId } = {}) {
  const { data } = await api.get('/api/work-logs', {
    params: { status, internId },
  })
  return data
}

export async function getWorkLogById(id) {
  const { data } = await api.get(`/api/work-logs/${id}`)
  return data
}

export async function reviewWorkLog(id, payload) {
  const { data } = await api.patch(`/api/work-logs/${id}/review`, payload)
  return data
}

// INTERN
export async function getMyWorkLogs() {
  const { data } = await api.get('/api/work-logs/me')
  return data
}

export async function getMyWorkLogById(id) {
  const { data } = await api.get(`/api/work-logs/me/${id}`)
  return data
}

export async function createWorkLog(payload) {
  const { data } = await api.post('/api/work-logs', payload)
  return data
}
