import toast from 'react-hot-toast'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { ChangePasswordForm } from '../../../components/forms/ChangePasswordForm'
import { changeMyPassword } from '../../../services/userService'

export function AdminSettingsPage() {
  async function handleSubmit(values) {
    try {
      await changeMyPassword(values)
      toast.success('Password updated successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password')
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account security.</p>
        </div>
      </div>

      <div className="form-card">
        <h2 className="form-section-title">Change password</h2>
        <p className="form-section-subtitle">
          Use a strong password you do not reuse on other sites.
        </p>
        <ChangePasswordForm onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  )
}
