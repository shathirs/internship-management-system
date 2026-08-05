import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { TaskForm } from '../../../components/forms/TaskForm'
import { createTask } from '../../../services/taskService'
import { getProjects } from '../../../services/projectService'
import { getInterns } from '../../../services/internService'

export function CreateTaskPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [interns, setInterns] = useState([])

  useEffect(() => {
    Promise.all([getProjects(), getInterns()])
      .then(([projectList, internList]) => {
        setProjects(projectList)
        setInterns(internList)
      })
      .catch(() => toast.error('Failed to load projects or interns'))
  }, [])

  async function handleSubmit(values) {
    try {
      await createTask(values)
      toast.success('Task created successfully')
      navigate('/admin/tasks')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task')
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Create Task</h1>
          <p>Add a task and optionally assign an intern.</p>
        </div>
      </div>
      <div className="form-card">
        <TaskForm
          mode="create"
          submitLabel="Create Task"
          projects={projects}
          interns={interns}
          onSubmit={handleSubmit}
          defaultValues={{
            title: '',
            description: '',
            priority: 'MEDIUM',
            status: 'TODO',
            deadline: '',
            projectId: '',
            assignedInternId: '',
          }}
        />
      </div>
    </DashboardLayout>
  )
}
