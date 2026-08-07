import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { SubmissionReviewForm } from '../../../components/forms/SubmissionReviewForm'
import {
  getSubmissionById,
  reviewSubmission,
} from '../../../services/submissionService'
import { getInterns } from '../../../services/internService'
import { getTasks } from '../../../services/taskService'

export function ReviewSubmissionPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [submission, setSubmission] = useState(null)
  const [internName, setInternName] = useState('')
  const [taskTitle, setTaskTitle] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [submissionData, interns, tasks] = await Promise.all([
          getSubmissionById(id),
          getInterns(),
          getTasks(),
        ])
        setSubmission(submissionData)
        setInternName(
          interns.find((i) => i.id === submissionData.internId)?.fullName || '—'
        )
        setTaskTitle(
          tasks.find((t) => t.id === submissionData.taskId)?.title || '—'
        )
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load submission')
        navigate('/admin/submissions')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate])

  async function handleSubmit(values) {
    try {
      await reviewSubmission(id, values)
      toast.success('Review submitted')
      navigate('/admin/submissions')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Review Submission</h1>
          <p>Approve, reject, or request revisions with comments.</p>
        </div>
      </div>

      <div className="form-card">
        {loading || !submission ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="intern-form" style={{ marginBottom: '1.5rem' }}>
              <div className="intern-field">
                <label>Intern</label>
                <input type="text" value={internName} disabled readOnly />
              </div>
              <div className="intern-field">
                <label>Task</label>
                <input type="text" value={taskTitle} disabled readOnly />
              </div>
              <div className="intern-field">
                <label>Status</label>
                <input
                  type="text"
                  value={submission.status || '—'}
                  disabled
                  readOnly
                />
              </div>
              <div className="intern-field intern-field-full">
                <label>Repository link</label>
                {submission.repositoryLink ? (
                  <a
                    href={submission.repositoryLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {submission.repositoryLink}
                  </a>
                ) : (
                  <input type="text" value="—" disabled readOnly />
                )}
              </div>
              <div className="intern-field intern-field-full">
                <label>Document link</label>
                {submission.documentLink ? (
                  <a
                    href={submission.documentLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {submission.documentLink}
                  </a>
                ) : (
                  <input type="text" value="—" disabled readOnly />
                )}
              </div>
              <div className="intern-field intern-field-full">
                <label>Completion notes</label>
                <textarea
                  rows={4}
                  value={submission.completionNotes || ''}
                  disabled
                  readOnly
                />
              </div>
            </div>

            <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Review</h2>
            <SubmissionReviewForm
              submitLabel="Submit Review"
              defaultValues={{
                status:
                  submission.status === 'SUBMITTED'
                    ? 'APPROVED'
                    : submission.status,
                adminComment: submission.adminComment || '',
              }}
              onSubmit={handleSubmit}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
