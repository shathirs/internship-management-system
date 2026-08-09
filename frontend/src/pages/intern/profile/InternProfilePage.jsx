import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { ProfileForm } from '../../../components/forms/ProfileForm'
import { useAuth } from '../../../context/AuthContext'
import { getMyProfile, updateMyProfile } from '../../../services/userService'

export function InternProfilePage() {
  const { updateUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyProfile()
        setProfile(data)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  async function handleSubmit({ name }) {
    try {
      const updated = await updateMyProfile({ name })
      setProfile(updated)
      updateUser({
        name: updated.name,
        email: updated.email,
        role: updated.role,
      })
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <p>View and update your intern account details.</p>
        </div>
      </div>

      <div className="form-card">
        {loading || !profile ? (
          <p>Loading...</p>
        ) : (
          <ProfileForm
            defaultValues={{ name: profile.name || '' }}
            email={profile.email}
            role={profile.role}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
