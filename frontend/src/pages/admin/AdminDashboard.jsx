import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      <p>
        Signed in as <strong>{user?.name}</strong> ({user?.role})
      </p>
      <button type="button" onClick={handleLogout}>
        Sign out
      </button>
    </main>
  )
}