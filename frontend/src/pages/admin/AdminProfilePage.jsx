import { useContext, useState } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import Avatar from '../../components/ui/Avatar'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import authService from '../../services/auth.service'
import AuthContext from '../../context/AuthContext'
import toast from 'react-hot-toast'

const getRoleBadgeLabel = (role) => {
  const roleMap = {
    admin: 'Super Admin',
    client: 'Client',
  }
  return roleMap[role] || 'User'
}

export default function AdminProfilePage() {
  const { user, setUser } = useContext(AuthContext) || {}
  const [editing, setEditing] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'User'
  const email = user?.email || 'No email'
  const role = user?.role || 'client'
  const roleBadgeLabel = getRoleBadgeLabel(role)

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    try {
      const updated = await authService.updateProfile({ firstName, lastName, phone })
      setUser(updated)
      setEditing(false)
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setPasswordLoading(true)
    try {
      await authService.changePassword(currentPassword, newPassword)
      toast.success('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Manage your admin account" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-card border border-border bg-card-bg p-6 text-center shadow-sm">
          <Avatar name={fullName} size="xl" className="mx-auto mb-4 !h-20 !w-20 !text-xl" />
          <h3 className="text-lg font-bold text-white">{fullName}</h3>
          <p className="text-sm text-text-secondary">{email}</p>
          <Badge variant="primary" className="mt-3">{roleBadgeLabel}</Badge>
          {user?.isVerified && (
            <Badge variant="green" className="mt-2">Verified</Badge>
          )}
        </div>

        <div className="space-y-5 rounded-card border border-border bg-card-bg p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Profile Information</h3>
            {!editing && (
              <Button variant="outline" onClick={() => setEditing(true)}>
                Edit
              </Button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <Input label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
              <Input label="Email" value={email} disabled />
              <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <div className="flex gap-3">
                <Button loading={profileLoading} type="submit">
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(false)
                    setFirstName(user?.firstName || '')
                    setLastName(user?.lastName || '')
                    setPhone(user?.phone || '')
                  }}
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-text-secondary">Full Name</p>
                <p className="text-sm text-white">{fullName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Email</p>
                <p className="text-sm text-white">{email}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Phone</p>
                <p className="text-sm text-white">{phone || 'Not set'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={handleChangePassword}
        className="space-y-5 rounded-card border border-border bg-card-bg p-6 shadow-sm"
      >
        <h3 className="text-base font-bold text-white">Change Password</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <Button loading={passwordLoading} type="submit">
          Update Password
        </Button>
      </form>
    </div>
  )
}