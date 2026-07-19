import { useState } from 'react'
import AdminListPage from '../../components/dashboard/AdminListPage'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'

const columns = [
  { key: 'name', label: 'User', render: (row) => (
    <div className="flex items-center gap-3">
      <Avatar name={row.name} size="sm" />
      <div>
        <p className="font-medium text-gray-900">{row.name}</p>
        <p className="text-xs text-gray-500">{row.email}</p>
      </div>
    </div>
  )},
  { key: 'role', label: 'Role', render: (row) => <Badge variant={row.role === 'Admin' ? 'purple' : 'blue'}>{row.role}</Badge> },
  { key: 'status', label: 'Status', render: (row) => <Badge variant={row.status === 'Active' ? 'success' : 'warning'}>{row.status}</Badge> },
  { key: 'joined', label: 'Joined' },
]

const data = [
  { id: 1, name: 'Admin User', email: 'admin@sydigital.com', role: 'Admin', status: 'Active', joined: 'Jan 2024' },
  { id: 2, name: 'John Doe', email: 'john@client.com', role: 'Client', status: 'Active', joined: 'Mar 2025' },
  { id: 3, name: 'Sarah Chen', email: 'sarah@techventures.com', role: 'Client', status: 'Active', joined: 'Jun 2025' },
  { id: 4, name: 'Marcus W.', email: 'marcus@elevate.com', role: 'Client', status: 'Inactive', joined: 'Feb 2025' },
]

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const filtered = data.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase()))
  return <AdminListPage title="Users" description="Manage platform users and access" actionLabel="Add User" columns={columns} data={filtered} searchValue={search} onSearchChange={setSearch} />
}
