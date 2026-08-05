import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { ProjectForm } from '../../../components/forms/ProjectForm'
import { createProject } from '../../../services/projectService'
import { getInterns } from '../../../services/internService'

export function CreateProjectPage() {
  const navigate = useNavigate()
  const [interns, setInterns] = useState([])

  useEffect(() => {
    getInterns()
      .then(setInterns)
      .catch(() => toast.error('Failed to load interns'))
  }, [])

  async function handleSubmit(values) {
    try {
      await createProject(values)
      toast.success('Project created successfully')
      navigate('/admin/projects')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project')
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Create Project</h1>
          <p>Add a project and assign interns.</p>
        </div>
      </div>
      <div className="form-card">
        <ProjectForm
          mode="create"
          submitLabel="Create Project"
          interns={interns}
          onSubmit={handleSubmit}
          defaultValues={{
            name: '',
            description: '',
            technology: '',
            deadline: '',
            status: 'PLANNED',
            assignedInternIds: [],
          }}
        />
      </div>
    </DashboardLayout>
  )
}
