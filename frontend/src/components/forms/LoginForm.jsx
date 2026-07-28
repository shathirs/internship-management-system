import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Eye, EyeOff, LoaderCircle, Lock, LogIn, Mail } from 'lucide-react'
import { Button } from '../ui/Button'
import { Checkbox } from '../ui/Checkbox'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values) {
    setIsSubmitting(true)

    try {
      const data = await login(values)

      toast.success('Signed in successfully')

      if (data.role === 'ADMIN') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/intern', { replace: true })
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Invalid email or password. Please try again.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
      <div className="login-field">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          startIcon={Mail}
          autoComplete="email"
          placeholder="you@example.com"
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.email)}
          {...register('email')}
        />
        {errors.email ? (
          <p role="alert" className="login-error">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="login-field">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          startIcon={Lock}
          endIcon={showPassword ? EyeOff : Eye}
          onEndIconClick={() => setShowPassword((prev) => !prev)}
          autoComplete="current-password"
          placeholder="Enter your password"
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.password)}
          {...register('password')}
        />
        {errors.password ? (
          <p role="alert" className="login-error">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <div className="login-options">
        <Checkbox id="remember" label="Remember me" disabled={isSubmitting} />
        <button type="button" className="login-link">
          Forgot password?
        </button>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-5 w-5" />
            Sign in
          </>
        )}
      </Button>

      <p className="login-footer">
        Need an account?{' '}
        <button type="button" className="login-link">
          Contact administrator
        </button>
      </p>
    </form>
  )
}
