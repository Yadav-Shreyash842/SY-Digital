import { useState } from 'react'
import AdminListPage from '../../components/dashboard/AdminListPage'
import Badge from '../../components/ui/Badge'

const columns = [
  { key: 'title', label: 'Notification' },
  { key: 'type', label: 'Type', render: (row) => <Badge variant={row.type === 'Alert' ? 'danger' : row.type === 'Update' ? 'blue' : 'default'}>{row.type}</Badge> },
  { key: 'date', label: 'Date' },
  { key: 'read', label: 'Status', render: (row) => row.read ? 'Read' : 'Unread' },
]

const data = [
  { id: 1, title: 'New project request from FinFlow Corp', type: 'Alert', date: '1h ago', read: false },
  { id: 2, title: 'Payment received — $12,500', type: 'Update', date: '3h ago', read: false },
  { id: 3, title: 'Blog post published successfully', type: 'Info', date: '1d ago', read: true },
]

export default function AdminNotificationsPage() {
  const [search, setSearch] = useState('')
  const filtered = data.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()))
  return <AdminListPage title="Notifications" description="System and activity notifications" columns={columns} data={filtered} searchValue={search} onSearchChange={setSearch} actionLabel={null} />
}
