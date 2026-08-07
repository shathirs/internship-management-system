import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { SubmissionForm } from '../../../components/forms/SubmissionForm'
import { createSubmission } from '../../../services/submissionService'
import { getMyTasks } from '../../../services/taskService'

export function SubmitWorkPage() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyTasks()
      .then(setTasks)
      .catch(() => toast.error('Failed to load your tasks'))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(values) {
    try {
      await createSubmission(values)
      toast.success('Submission sent')
      navigate('/intern/submissions')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit')
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Submit Work</h1>
          <p>Share repository/document links and completion notes for a task.</p>
        </div>
      </div>
      <div className="form-card">
        {loading ? (
          <p>Loading...</p>
        ) : tasks.length === 0 ? (
          <p>No assigned tasks yet. Ask your supervisor to assign a task first.</p>
        ) : (
          <SubmissionForm
            tasks={tasks}
            submitLabel="Submit Work"
            onSubmit={handleSubmit}
            defaultValues={{
              taskId: '',
              repositoryLink: '',
              documentLink: '',
              completionNotes: '',
            }}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
