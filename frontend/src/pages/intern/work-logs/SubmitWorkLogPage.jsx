import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { WorkLogForm } from '../../../components/forms/WorkLogForm'
import { createWorkLog } from '../../../services/workLogService'

export function SubmitWorkLogPage() {
  const navigate = useNavigate()

  async function handleSubmit(values) {
    try {
      await createWorkLog(values)
      toast.success('Work log submitted')
      navigate('/intern/work-logs')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit work log')
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Submit Daily Work Log</h1>
          <p>Record today’s progress for your supervisor.</p>
        </div>
      </div>
      <div className="form-card">
        <WorkLogForm
          submitLabel="Submit Log"
          onSubmit={handleSubmit}
          defaultValues={{
            logDate: new Date().toISOString().slice(0, 10),
            completedWork: '',
            currentWork: '',
            challenges: '',
            hoursWorked: 8,
            tomorrowPlan: '',
          }}
        />
      </div>
    </DashboardLayout>
  )
}
