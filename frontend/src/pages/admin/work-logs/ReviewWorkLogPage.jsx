import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { WorkLogReviewForm } from '../../../components/forms/WorkLogReviewForm'
import { getWorkLogById, reviewWorkLog } from '../../../services/workLogService'
import { getInterns } from '../../../services/internService'

export function ReviewWorkLogPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [log, setLog] = useState(null)
  const [internName, setInternName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [logData, interns] = await Promise.all([
          getWorkLogById(id),
          getInterns(),
        ])
        setLog(logData)
        const intern = interns.find((i) => i.id === logData.internId)
        setInternName(intern?.fullName || '—')
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load work log')
        navigate('/admin/work-logs')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate])

  async function handleSubmit(values) {
    try {
      await reviewWorkLog(id, values)
      toast.success('Review submitted')
      navigate('/admin/work-logs')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Review Work Log</h1>
          <p>Read the intern’s log and leave feedback.</p>
        </div>
      </div>

      <div className="form-card">
        {loading || !log ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="intern-form" style={{ marginBottom: '1.5rem' }}>
              <div className="intern-field">
                <label>Intern</label>
                <input type="text" value={internName} disabled readOnly />
              </div>
              <div className="intern-field">
                <label>Date</label>
                <input type="text" value={log.logDate || '—'} disabled readOnly />
              </div>
              <div className="intern-field">
                <label>Hours worked</label>
                <input
                  type="text"
                  value={log.hoursWorked ?? '—'}
                  disabled
                  readOnly
                />
              </div>
              <div className="intern-field">
                <label>Status</label>
                <input type="text" value={log.status || '—'} disabled readOnly />
              </div>
              <div className="intern-field intern-field-full">
                <label>Completed work</label>
                <textarea
                  rows={3}
                  value={log.completedWork || ''}
                  disabled
                  readOnly
                />
              </div>
              <div className="intern-field intern-field-full">
                <label>Current work</label>
                <textarea
                  rows={3}
                  value={log.currentWork || ''}
                  disabled
                  readOnly
                />
              </div>
              <div className="intern-field intern-field-full">
                <label>Challenges</label>
                <textarea
                  rows={2}
                  value={log.challenges || ''}
                  disabled
                  readOnly
                />
              </div>
              <div className="intern-field intern-field-full">
                <label>Tomorrow plan</label>
                <textarea
                  rows={2}
                  value={log.tomorrowPlan || ''}
                  disabled
                  readOnly
                />
              </div>
            </div>

            <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Review</h2>
            <WorkLogReviewForm
              submitLabel="Submit Review"
              defaultValues={{
                status:
                  log.status === 'NEEDS_REVISION' ? 'NEEDS_REVISION' : 'REVIEWED',
                adminComment: log.adminComment || '',
              }}
              onSubmit={handleSubmit}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
