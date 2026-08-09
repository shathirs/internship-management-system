import { createContext, useContext, useMemo, useState } from 'react'
import { login as loginRequest } from '../services/authService'
import {
  clearAuth,
  getToken,
  getUser,
  saveAuth,
  updateStoredUser,
} from '../lib/authStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken())
  const [user, setUser] = useState(() => getUser())

  async function login(credentials) {
    const data = await loginRequest(credentials)
    // data: { token, email, name, role }

    saveAuth(data)
    setToken(data.token)
    setUser({
      email: data.email,
      name: data.name,
      role: data.role,
    })

    return data
  }

  function logout() {
    clearAuth()
    setToken(null)
    setUser(null)
  }

  function updateUser(partial) {
    const next = updateStoredUser(partial)
    setUser(next)
    return next
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
      updateUser,
    }),
    [token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
