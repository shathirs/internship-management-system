import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { TaskForm } from '../../../components/forms/TaskForm'
import { getTaskById, updateTask } from '../../../services/taskService'
import { getProjects } from '../../../services/projectService'
import { getInterns } from '../../../services/internService'

export function EditTaskPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [initialValues, setInitialValues] = useState(null)
  const [projects, setProjects] = useState([])
  const [interns, setInterns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [task, projectList, internList] = await Promise.all([
          getTaskById(id),
          getProjects(),
          getInterns(),
        ])
        setProjects(projectList)
        setInterns(internList)
        setInitialValues({
          title: task.title || '',
          description: task.description || '',
          priority: task.priority || 'MEDIUM',
          status: task.status || 'TODO',
          deadline: task.deadline || '',
          projectId: task.projectId || '',
          assignedInternId: task.assignedInternId || '',
        })
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load task')
        navigate('/admin/tasks')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate])

  async function handleSubmit(values) {
    try {
      await updateTask(id, values)
      toast.success('Task updated successfully')
      navigate('/admin/tasks')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task')
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Edit Task</h1>
          <p>Update task details, status, and assignment.</p>
        </div>
      </div>

      <div className="form-card">
        {loading || !initialValues ? (
          <p>Loading...</p>
        ) : (
          <TaskForm
            mode="edit"
            submitLabel="Save Changes"
            projects={projects}
            interns={interns}
            defaultValues={initialValues}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
