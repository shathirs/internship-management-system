import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(1, 'New password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from the current password',
    path: ['newPassword'],
  })

export function ChangePasswordForm({ onSubmit, submitLabel = 'Update password' }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  async function submitHandler(values) {
    setIsSubmitting(true)
    try {
      await onSubmit({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="intern-form" onSubmit={handleSubmit(submitHandler)} noValidate>
      <div className="intern-field">
        <label htmlFor="currentPassword">Current password</label>
        <input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          disabled={isSubmitting}
          {...register('currentPassword')}
        />
        {errors.currentPassword ? (
          <p className="intern-field-error">{errors.currentPassword.message}</p>
        ) : null}
      </div>

      <div className="intern-field">
        <label htmlFor="newPassword">New password</label>
        <input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          disabled={isSubmitting}
          {...register('newPassword')}
        />
        {errors.newPassword ? (
          <p className="intern-field-error">{errors.newPassword.message}</p>
        ) : null}
      </div>

      <div className="intern-field">
        <label htmlFor="confirmPassword">Confirm new password</label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          disabled={isSubmitting}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword ? (
          <p className="intern-field-error">{errors.confirmPassword.message}</p>
        ) : null}
      </div>

      <div className="intern-form-actions">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  )
}
