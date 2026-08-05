import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'

const projectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  technology: z.string().min(1, 'Technology is required'),
  deadline: z.string().min(1, 'Deadline is required'),
  status: z.enum([
    'PLANNED',
    'IN_PROGRESS',
    'ON_HOLD',
    'COMPLETED',
    'CANCELLED',
  ]),
  assignedInternIds: z.array(z.string()).optional().default([]),
})

export function ProjectForm({
  mode = 'create',
  defaultValues,
  onSubmit,
  submitLabel = 'Save',
  interns = [],
}) {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues,
  })

  const selectedIds = watch('assignedInternIds') || []

  function toggleIntern(id) {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id]
    setValue('assignedInternIds', next, { shouldValidate: true })
  }

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
        <label htmlFor="name">Name</label>
        <input id="name" type="text" disabled={isSubmitting} {...register('name')} />
        {errors.name ? <p className="intern-field-error">{errors.name.message}</p> : null}
      </div>

      <div className="intern-field intern-field-full">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={4}
          disabled={isSubmitting}
          placeholder="Brief project summary..."
          {...register('description')}
        />
        {errors.description ? (
          <p className="intern-field-error">{errors.description.message}</p>
        ) : null}
      </div>

      <div className="intern-field">
        <label htmlFor="technology">Technology</label>
        <input
          id="technology"
          type="text"
          disabled={isSubmitting}
          {...register('technology')}
        />
        {errors.technology ? (
          <p className="intern-field-error">{errors.technology.message}</p>
        ) : null}
      </div>

      <div className="intern-field">
        <label htmlFor="deadline">Deadline</label>
        <input
          id="deadline"
          type="date"
          disabled={isSubmitting}
          {...register('deadline')}
        />
        {errors.deadline ? (
          <p className="intern-field-error">{errors.deadline.message}</p>
        ) : null}
      </div>

      <div className="intern-field">
        <label htmlFor="status">Status</label>
        <select id="status" disabled={isSubmitting} {...register('status')}>
          <option value="PLANNED">Planned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        {errors.status ? (
          <p className="intern-field-error">{errors.status.message}</p>
        ) : null}
      </div>

      <div className="intern-field intern-field-full">
        <label>Assigned Interns</label>
        {interns.length === 0 ? (
          <p className="intern-field-hint">No interns available.</p>
        ) : (
          <div className="intern-checkbox-list">
            {interns.map((intern) => (
              <label key={intern.id} className="intern-checkbox-item">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(intern.id)}
                  disabled={isSubmitting}
                  onChange={() => toggleIntern(intern.id)}
                />
                <span>
                  {intern.fullName} ({intern.email})
                </span>
              </label>
            ))}
          </div>
        )}
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
          onClick={() => navigate('/admin/projects')}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
