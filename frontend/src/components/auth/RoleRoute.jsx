import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function RoleRoute({ allow, children }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!allow.includes(user?.role)) {
    const fallback = user?.role === 'ADMIN' ? '/admin' : '/intern'
    return <Navigate to={fallback} replace />
  }

  return children
}