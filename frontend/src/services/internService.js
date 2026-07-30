import api from '../lib/api'

export async function getInterns({ search, status, department } = {}) {
  const { data } = await api.get('/api/interns', {
    params: { search, status, department },
  })
  return data
}

export async function getInternById(id) {
  const { data } = await api.get(`/api/interns/${id}`)
  return data
}

export async function createIntern(payload) {
  const { data } = await api.post('/api/interns', payload)
  return data
}

export async function updateIntern(id, payload) {
  const { data } = await api.put(`/api/interns/${id}`, payload)
  return data
}

export async function deleteIntern(id) {
  await api.delete(`/api/interns/${id}`)
}

export async function activateIntern(id) {
  const { data } = await api.patch(`/api/interns/${id}/activate`)
  return data
}

export async function deactivateIntern(id) {
  const { data } = await api.patch(`/api/interns/${id}/deactivate`)
  return data
}
