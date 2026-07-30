import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'

const baseSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  phone: z.string().optional(),
  university: z.string().optional(),
  department: z.string().optional(),
  batch: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

const createSchema = baseSchema.extend({
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

export function InternForm({
  mode = 'create',
  defaultValues,
  onSubmit,
  submitLabel = 'Save',
}) {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const schema = mode === 'create' ? createSchema : baseSchema

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  })

  async function submitHandler(values) {
    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="intern-form" onSubmit={handleSubmit(submitHandler)} noValidate>
      <div className="intern-field">
        <label htmlFor="fullName">Full name</label>
        <input id="fullName" type="text" disabled={isSubmitting} {...register('fullName')} />
        {errors.fullName ? (
          <p className="intern-field-error">{errors.fullName.message}</p>
        ) : null}
      </div>

      <div className="intern-field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" disabled={isSubmitting} {...register('email')} />
        {errors.email ? (
          <p className="intern-field-error">{errors.email.message}</p>
        ) : null}
      </div>

      {mode === 'create' ? (
        <div className="intern-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            disabled={isSubmitting}
            {...register('password')}
          />
          {errors.password ? (
            <p className="intern-field-error">{errors.password.message}</p>
          ) : null}
        </div>
      ) : null}

      <div className="intern-field">
        <label htmlFor="phone">Phone</label>
        <input id="phone" type="text" disabled={isSubmitting} {...register('phone')} />
      </div>

      <div className="intern-field">
        <label htmlFor="university">University</label>
        <input id="university" type="text" disabled={isSubmitting} {...register('university')} />
      </div>

      <div className="intern-field">
        <label htmlFor="department">Department</label>
        <input id="department" type="text" disabled={isSubmitting} {...register('department')} />
      </div>

      <div className="intern-field">
        <label htmlFor="batch">Batch</label>
        <input id="batch" type="text" disabled={isSubmitting} {...register('batch')} />
      </div>

      <div className="intern-field">
        <label htmlFor="startDate">Start date</label>
        <input id="startDate" type="date" disabled={isSubmitting} {...register('startDate')} />
      </div>

      <div className="intern-field">
        <label htmlFor="endDate">End date</label>
        <input id="endDate" type="date" disabled={isSubmitting} {...register('endDate')} />
      </div>

      <div className="intern-form-actions">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </button>
        <button
          type="button"
          className="btn-secondary"
          disabled={isSubmitting}
          onClick={() => navigate('/admin/interns')}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}