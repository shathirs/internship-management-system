import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'

const workLogSchema = z.object({
  logDate: z.string().min(1, 'Log date is required'),
  completedWork: z.string().min(1, 'Completed work is required'),
  currentWork: z.string().min(1, 'Current work is required'),
  challenges: z.string().optional(),
  hoursWorked: z.coerce
    .number({ invalid_type_error: 'Hours worked is required' })
    .min(0.5, 'Hours worked must be at least 0.5'),
  tomorrowPlan: z.string().min(1, 'Tomorrow plan is required'),
})

export function WorkLogForm({
  defaultValues,
  onSubmit,
  submitLabel = 'Submit Log',
}) {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(workLogSchema),
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
        <label htmlFor="logDate">Log date</label>
        <input
          id="logDate"
          type="date"
          disabled={isSubmitting}
          {...register('logDate')}
        />
        {errors.logDate ? (
          <p className="intern-field-error">{errors.logDate.message}</p>
        ) : null}
      </div>

      <div className="intern-field">
        <label htmlFor="hoursWorked">Hours worked</label>
        <input
          id="hoursWorked"
          type="number"
          step="0.5"
          min="0.5"
          disabled={isSubmitting}
          {...register('hoursWorked')}
        />
        {errors.hoursWorked ? (
          <p className="intern-field-error">{errors.hoursWorked.message}</p>
        ) : null}
      </div>

      <div className="intern-field intern-field-full">
        <label htmlFor="completedWork">Completed work</label>
        <textarea
          id="completedWork"
          rows={4}
          disabled={isSubmitting}
          placeholder="What did you finish today?"
          {...register('completedWork')}
        />
        {errors.completedWork ? (
          <p className="intern-field-error">{errors.completedWork.message}</p>
        ) : null}
      </div>

      <div className="intern-field intern-field-full">
        <label htmlFor="currentWork">Current work</label>
        <textarea
          id="currentWork"
          rows={4}
          disabled={isSubmitting}
          placeholder="What are you working on now?"
          {...register('currentWork')}
        />
        {errors.currentWork ? (
          <p className="intern-field-error">{errors.currentWork.message}</p>
        ) : null}
      </div>

      <div className="intern-field intern-field-full">
        <label htmlFor="challenges">Challenges</label>
        <textarea
          id="challenges"
          rows={3}
          disabled={isSubmitting}
          placeholder="Any blockers or issues?"
          {...register('challenges')}
        />
        {errors.challenges ? (
          <p className="intern-field-error">{errors.challenges.message}</p>
        ) : null}
      </div>

      <div className="intern-field intern-field-full">
        <label htmlFor="tomorrowPlan">Tomorrow plan</label>
        <textarea
          id="tomorrowPlan"
          rows={3}
          disabled={isSubmitting}
          placeholder="What will you do next?"
          {...register('tomorrowPlan')}
        />
        {errors.tomorrowPlan ? (
          <p className="intern-field-error">{errors.tomorrowPlan.message}</p>
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
          onClick={() => navigate('/intern/work-logs')}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
