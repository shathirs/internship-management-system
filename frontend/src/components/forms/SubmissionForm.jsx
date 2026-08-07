import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'

const submissionSchema = z.object({
  taskId: z.string().min(1, 'Task is required'),
  repositoryLink: z.string().optional(),
  documentLink: z.string().optional(),
  completionNotes: z.string().min(1, 'Completion notes are required'),
})

export function SubmissionForm({
  defaultValues,
  onSubmit,
  submitLabel = 'Submit Work',
  tasks = [],
}) {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(submissionSchema),
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
      <div className="intern-field intern-field-full">
        <label htmlFor="taskId">Task</label>
        <select id="taskId" disabled={isSubmitting} {...register('taskId')}>
          <option value="">Select task</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
        {errors.taskId ? (
          <p className="intern-field-error">{errors.taskId.message}</p>
        ) : null}
      </div>

      <div className="intern-field intern-field-full">
        <label htmlFor="repositoryLink">Repository link</label>
        <input
          id="repositoryLink"
          type="url"
          placeholder="https://github.com/..."
          disabled={isSubmitting}
          {...register('repositoryLink')}
        />
        {errors.repositoryLink ? (
          <p className="intern-field-error">{errors.repositoryLink.message}</p>
        ) : null}
      </div>

      <div className="intern-field intern-field-full">
        <label htmlFor="documentLink">Document link</label>
        <input
          id="documentLink"
          type="url"
          placeholder="https://docs.google.com/..."
          disabled={isSubmitting}
          {...register('documentLink')}
        />
        {errors.documentLink ? (
          <p className="intern-field-error">{errors.documentLink.message}</p>
        ) : null}
      </div>

      <div className="intern-field intern-field-full">
        <label htmlFor="completionNotes">Completion notes</label>
        <textarea
          id="completionNotes"
          rows={5}
          disabled={isSubmitting}
          placeholder="What did you complete for this task?"
          {...register('completionNotes')}
        />
        {errors.completionNotes ? (
          <p className="intern-field-error">{errors.completionNotes.message}</p>
        ) : null}
      </div>

      <div className="intern-form-actions">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            submitLabel
          )}
        </button>
        <button
          type="button"
          className="btn-secondary"
          disabled={isSubmitting}
          onClick={() => navigate('/intern/submissions')}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
