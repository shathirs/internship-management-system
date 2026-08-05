import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LoaderCircle } from 'lucide-react'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { getTaskById, assignTask } from '../../../services/taskService'
import { getInterns } from '../../../services/internService'

export function AssignTaskPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [interns, setInterns] = useState([])
  const [assignedInternId, setAssignedInternId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [taskData, internList] = await Promise.all([
          getTaskById(id),
          getInterns(),
        ])
        setTask(taskData)
        setInterns(internList)
        setAssignedInternId(taskData.assignedInternId || '')
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load task')
        navigate('/admin/tasks')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!assignedInternId) {
      toast.error('Select an intern')
      return
    }

    setSaving(true)
    try {
      await assignTask(id, assignedInternId)
      toast.success('Task assigned successfully')
      navigate('/admin/tasks')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign task')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Assign Task</h1>
          <p>Assign this task to an intern.</p>
        </div>
      </div>

      <div className="form-card">
        {loading || !task ? (
          <p>Loading...</p>
        ) : (
          <form className="intern-form" onSubmit={handleSubmit} noValidate>
            <div className="intern-field intern-field-full">
              <label>Task</label>
              <input type="text" value={task.title} disabled readOnly />
            </div>

            <div className="intern-field">
              <label>Current status</label>
              <input type="text" value={task.status || '—'} disabled readOnly />
            </div>

            <div className="intern-field">
              <label>Deadline</label>
              <input type="text" value={task.deadline || '—'} disabled readOnly />
            </div>

            <div className="intern-field intern-field-full">
              <label htmlFor="assignedInternId">Assigned Intern</label>
              <select
                id="assignedInternId"
                value={assignedInternId}
                disabled={saving}
                onChange={(e) => setAssignedInternId(e.target.value)}
              >
                <option value="">Select intern</option>
                {interns.map((intern) => (
                  <option key={intern.id} value={intern.id}>
                    {intern.fullName} ({intern.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="intern-form-actions">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  'Assign Task'
                )}
              </button>
              <button
                type="button"
                className="btn-secondary"
                disabled={saving}
                onClick={() => navigate('/admin/tasks')}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  )
}
