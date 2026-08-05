import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  status: z.enum([
    'TODO',
    'IN_PROGRESS',
    'SUBMITTED',
    'REVISION_REQUIRED',
    'COMPLETED',
  ]),
  deadline: z.string().min(1, 'Deadline is required'),
  projectId: z.string().min(1, 'Project is required'),
  assignedInternId: z.string().optional(),
})

export function TaskForm({
  mode = 'create',
  defaultValues,
  onSubmit,
  submitLabel = 'Save',
  projects = [],
  interns = [],
}) {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues,
  })

  async function submitHandler(values) {
    setIsSubmitting(true)
    try {
      await onSubmit({
        ...values,
        assignedInternId: values.assignedInternId || undefined,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="intern-form" onSubmit={handleSubmit(submitHandler)} noValidate>
      <div className="intern-field intern-field-full">
        <label htmlFor="title">Title</label>
        <input id="title" type="text" disabled={isSubmitting} {...register('title')} />
        {errors.title ? <p className="intern-field-error">{errors.title.message}</p> : null}
      </div>

      <div className="intern-field intern-field-full">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={4}
          disabled={isSubmitting}
          placeholder="What should be done..."
          {...register('description')}
        />
        {errors.description ? (
          <p className="intern-field-error">{errors.description.message}</p>
        ) : null}
      </div>

      <div className="intern-field">
        <label htmlFor="priority">Priority</label>
        <select id="priority" disabled={isSubmitting} {...register('priority')}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        {errors.priority ? (
          <p className="intern-field-error">{errors.priority.message}</p>
        ) : null}
      </div>

      <div className="intern-field">
        <label htmlFor="status">Status</label>
        <select id="status" disabled={isSubmitting} {...register('status')}>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="REVISION_REQUIRED">Revision Required</option>
          <option value="COMPLETED">Completed</option>
        </select>
        {errors.status ? (
          <p className="intern-field-error">{errors.status.message}</p>
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
        <label htmlFor="projectId">Project</label>
        <select id="projectId" disabled={isSubmitting} {...register('projectId')}>
          <option value="">Select project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        {errors.projectId ? (
          <p className="intern-field-error">{errors.projectId.message}</p>
        ) : null}
      </div>

      <div className="intern-field intern-field-full">
        <label htmlFor="assignedInternId">Assigned Intern</label>
        <select
          id="assignedInternId"
          disabled={isSubmitting}
          {...register('assignedInternId')}
        >
          <option value="">Unassigned</option>
          {interns.map((intern) => (
            <option key={intern.id} value={intern.id}>
              {intern.fullName} ({intern.email})
            </option>
          ))}
        </select>
        {errors.assignedInternId ? (
          <p className="intern-field-error">{errors.assignedInternId.message}</p>
        ) : null}
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
          onClick={() => navigate('/admin/tasks')}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
