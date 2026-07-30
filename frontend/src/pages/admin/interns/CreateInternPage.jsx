import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { InternForm } from '../../../components/forms/InternForm'
import { createIntern } from '../../../services/internService'

export function CreateInternPage() {
  const navigate = useNavigate()

  async function handleSubmit(values) {
    try {
      await createIntern(values)
      toast.success('Intern created successfully')
      navigate('/admin/interns')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create intern')
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Create Intern</h1>
          <p>Add a new intern and login account.</p>
        </div>
      </div>

      <div className="form-card">
        <InternForm
          mode="create"
          submitLabel="Create Intern"
          onSubmit={handleSubmit}
          defaultValues={{
            fullName: '',
            email: '',
            password: '',
            phone: '',
            university: '',
            department: '',
            batch: '',
            startDate: '',
            endDate: '',
          }}
        />
      </div>
    </DashboardLayout>
  )
}