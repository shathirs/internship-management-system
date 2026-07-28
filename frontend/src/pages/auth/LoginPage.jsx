import { GraduationCap } from 'lucide-react'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { LoginForm } from '../../components/forms/LoginForm'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function LoginPage() {
    const navigate = useNavigate()
    const { isAuthenticated, user } = useAuth()

    useEffect(() => {
        if (!isAuthenticated) return
        navigate(user?.role === 'ADMIN' ? '/admin' : '/intern', { replace: true })
    }, [isAuthenticated, user, navigate])

  return (
    <AuthLayout>
      <div className="login-mobile-brand">
        <div className="login-mobile-icon">
          <GraduationCap className="h-5 w-5" />
        </div>
        <p className="login-mobile-title">Internship Management System</p>
      </div>

      <div className="login-card">
        <header className="login-card-header">
          <h2>Welcome back</h2>
          <p>Sign in with your email and password</p>
        </header>

        <LoginForm />
      </div>
    </AuthLayout>
  )
}
