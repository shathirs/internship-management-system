import api from '../lib/api'

export async function getTasks({ search, status, projectId } = {}) {
  const { data } = await api.get('/api/tasks', {
    params: { search, status, projectId },
  })
  return data
}

export async function getMyTasks() {
  const { data } = await api.get('/api/tasks/me')
  return data
}

export async function getTaskById(id) {
  const { data } = await api.get(`/api/tasks/${id}`)
  return data
}

export async function createTask(payload) {
  const { data } = await api.post('/api/tasks', payload)
  return data
}

export async function updateTask(id, payload) {
  const { data } = await api.put(`/api/tasks/${id}`, payload)
  return data
}

export async function assignTask(id, assignedInternId) {
  const { data } = await api.patch(`/api/tasks/${id}/assign`, {
    assignedInternId,
  })
  return data
}

export async function deleteTask(id) {
  await api.delete(`/api/tasks/${id}`)
}