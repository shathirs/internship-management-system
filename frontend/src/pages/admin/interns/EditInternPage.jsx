import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { InternForm } from '../../../components/forms/InternForm'
import { getInternById, updateIntern } from '../../../services/internService'

export function EditInternPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [initialValues, setInitialValues] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const intern = await getInternById(id)
        setInitialValues({
          fullName: intern.fullName || '',
          email: intern.email || '',
          phone: intern.phone || '',
          university: intern.university || '',
          department: intern.department || '',
          batch: intern.batch || '',
          startDate: intern.startDate || '',
          endDate: intern.endDate || '',
        })
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load intern')
        navigate('/admin/interns')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id, navigate])

  async function handleSubmit(values) {
    try {
      await updateIntern(id, values)
      toast.success('Intern updated successfully')
      navigate('/admin/interns')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update intern')
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Edit Intern</h1>
          <p>Update intern profile details.</p>
        </div>
      </div>

      <div className="form-card">
        {loading || !initialValues ? (
          <p>Loading...</p>
        ) : (
          <InternForm
            mode="edit"
            submitLabel="Save Changes"
            defaultValues={initialValues}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </DashboardLayout>
  )
}