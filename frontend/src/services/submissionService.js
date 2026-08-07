import api from '../lib/api'

// ADMIN
export async function getSubmissions({ status, internId } = {}) {
  const { data } = await api.get('/api/submissions', {
    params: { status, internId },
  })
  return data
}

export async function getSubmissionById(id) {
  const { data } = await api.get(`/api/submissions/${id}`)
  return data
}

export async function reviewSubmission(id, payload) {
  const { data } = await api.patch(`/api/submissions/${id}/review`, payload)
  return data
}

// INTERN
export async function getMySubmissions() {
  const { data } = await api.get('/api/submissions/me')
  return data
}

export async function getMySubmissionById(id) {
  const { data } = await api.get(`/api/submissions/me/${id}`)
  return data
}

export async function createSubmission(payload) {
  const { data } = await api.post('/api/submissions', payload)
  return data
}
