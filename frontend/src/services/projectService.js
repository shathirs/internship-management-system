import api from '../lib/api'

export async function getProjects({ search, status } = {}) {
  const { data } = await api.get('/api/projects', {
    params: { search, status },
  })
  return data
}

export async function getProjectById(id) {
  const { data } = await api.get(`/api/projects/${id}`)
  return data
}

export async function createProject(payload) {
  const { data } = await api.post('/api/projects', payload)
  return data
}

export async function updateProject(id, payload) {
  const { data } = await api.put(`/api/projects/${id}`, payload)
  return data
}

export async function deleteProject(id) {
  await api.delete(`/api/projects/${id}`)
}