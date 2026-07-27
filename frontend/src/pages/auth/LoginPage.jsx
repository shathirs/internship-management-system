import { GraduationCap } from 'lucide-react'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { LoginForm } from '../../components/forms/LoginForm'

export function LoginPage() {
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
