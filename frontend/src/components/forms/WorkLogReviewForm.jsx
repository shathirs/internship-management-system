import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'

const reviewSchema = z.object({
  status: z.enum(['REVIEWED', 'NEEDS_REVISION']),
  adminComment: z.string().min(1, 'Comment is required'),
})

export function WorkLogReviewForm({
  defaultValues,
  onSubmit,
  submitLabel = 'Submit Review',
}) {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
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
        <label htmlFor="status">Review status</label>
        <select id="status" disabled={isSubmitting} {...register('status')}>
          <option value="REVIEWED">Reviewed</option>
          <option value="NEEDS_REVISION">Needs Revision</option>
        </select>
        {errors.status ? (
          <p className="intern-field-error">{errors.status.message}</p>
        ) : null}
      </div>

      <div className="intern-field intern-field-full">
        <label htmlFor="adminComment">Admin comment</label>
        <textarea
          id="adminComment"
          rows={5}
          disabled={isSubmitting}
          placeholder="Feedback for the intern..."
          {...register('adminComment')}
        />
        {errors.adminComment ? (
          <p className="intern-field-error">{errors.adminComment.message}</p>
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
          onClick={() => navigate('/admin/work-logs')}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
