const TOKEN_KEY = 'ims_token'
const USER_KEY = 'ims_user'

export function saveAuth({ token, email, name, role }) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({ email, name, role }),
  )
}

export function updateStoredUser(partial) {
  const current = getUser() || {}
  const next = { ...current, ...partial }
  localStorage.setItem(USER_KEY, JSON.stringify(next))
  return next
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function getRole() {
  return getUser()?.role ?? null
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}