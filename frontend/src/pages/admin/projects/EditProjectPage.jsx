import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { ProjectForm } from '../../../components/forms/ProjectForm'
import { getProjectById, updateProject } from '../../../services/projectService'
import { getInterns } from '../../../services/internService'

export function EditProjectPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [initialValues, setInitialValues] = useState(null)
  const [interns, setInterns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [project, internList] = await Promise.all([
          getProjectById(id),
          getInterns(),
        ])
        setInterns(internList)
        setInitialValues({
          name: project.name || '',
          description: project.description || '',
          technology: project.technology || '',
          deadline: project.deadline || '',
          status: project.status || 'PLANNED',
          assignedInternIds: project.assignedInternIds || [],
        })
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load project')
        navigate('/admin/projects')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate])

  async function handleSubmit(values) {
    try {
      await updateProject(id, values)
      toast.success('Project updated successfully')
      navigate('/admin/projects')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update project')
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Edit Project</h1>
          <p>Update project details and assigned interns.</p>
        </div>
      </div>

      <div className="form-card">
        {loading || !initialValues ? (
          <p>Loading...</p>
        ) : (
          <ProjectForm
            mode="edit"
            submitLabel="Save Changes"
            interns={interns}
            defaultValues={initialValues}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
