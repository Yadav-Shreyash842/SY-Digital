import AdminListPage from '../../components/dashboard/AdminListPage'
import Badge from '../../components/ui/Badge'

const columns = [
  { key: 'name', label: 'Role' },
  { key: 'users', label: 'Users' },
  { key: 'permissions', label: 'Permissions' },
  { key: 'type', label: 'Type', render: (row) => <Badge variant={row.type === 'System' ? 'purple' : 'default'}>{row.type}</Badge> },
]

const data = [
  { id: 1, name: 'Super Admin', users: 2, permissions: 'Full Access', type: 'System' },
  { id: 2, name: 'Admin', users: 5, permissions: 'Manage Content', type: 'System' },
  { id: 3, name: 'Client', users: 142, permissions: 'View Own Data', type: 'Custom' },
  { id: 4, name: 'Editor', users: 8, permissions: 'Manage Blogs', type: 'Custom' },
]

export default function AdminRolesPage() {
  return <AdminListPage title="Roles & Permissions" description="Configure user roles and access levels" actionLabel="Create Role" columns={columns} data={data} searchable={false} />
}
