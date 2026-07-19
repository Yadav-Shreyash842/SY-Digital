import { useContext } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import Avatar from '../../components/ui/Avatar'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import AuthContext from '../../context/AuthContext'

const getRoleBadgeLabel = (role) => {
  const roleMap = {
    admin: 'Super Admin',
    client: 'Client',
  }
  return roleMap[role] || 'User'
}

export default function AdminProfilePage() {
  const { user } = useContext(AuthContext) || {}
  
  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'User'
  const email = user?.email || 'No email'
  const phone = user?.phone || ''
  const role = user?.role || 'client'
  const roleBadgeLabel = getRoleBadgeLabel(role)

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Manage your admin account" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[20px] border border-gray-200 bg-white p-6 text-center shadow-sm">
          <Avatar name={fullName} size="xl" className="mx-auto mb-4 !h-20 !w-20 !text-xl" />
          <h3 className="text-lg font-bold text-gray-900">{fullName}</h3>
          <p className="text-sm text-gray-500">{email}</p>
          <Badge variant="purple" className="mt-3">{roleBadgeLabel}</Badge>
        </div>
        <div className="space-y-5 rounded-[20px] border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <Input label="Full Name" defaultValue={fullName} theme="light" />
          <Input label="Email" defaultValue={email} theme="light" />
          <Input label="Phone" defaultValue={phone} theme="light" />
          <Button variant="light">Update Profile</Button>
        </div>
      </div>
    </div>
  )
}
