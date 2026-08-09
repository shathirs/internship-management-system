import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'

const schema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters'),
})

export function ProfileForm({ defaultValues, email, role, onSubmit, submitLabel = 'Save changes' }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        <label htmlFor="name">Full name</label>
        <input id="name" type="text" disabled={isSubmitting} {...register('name')} />
        {errors.name ? <p className="intern-field-error">{errors.name.message}</p> : null}
      </div>

      <div className="intern-field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email || ''} disabled readOnly />
      </div>

      <div className="intern-field">
        <label htmlFor="role">Role</label>
        <input id="role" type="text" value={role || ''} disabled readOnly />
      </div>

      <div className="intern-form-actions">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  )
}
