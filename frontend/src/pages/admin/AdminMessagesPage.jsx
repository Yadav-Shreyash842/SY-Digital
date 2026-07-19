import { useState } from 'react'
import AdminListPage from '../../components/dashboard/AdminListPage'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'

const columns = [
  { key: 'from', label: 'From', render: (row) => (
    <div className="flex items-center gap-3">
      <Avatar name={row.from} size="sm" />
      <span className="font-medium text-gray-900">{row.from}</span>
    </div>
  )},
  { key: 'subject', label: 'Subject' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status', render: (row) => <Badge variant={row.unread ? 'purple' : 'default'}>{row.unread ? 'Unread' : 'Read'}</Badge> },
]

const data = [
  { id: 1, from: 'John Doe', subject: 'Project timeline update', date: '2h ago', unread: true },
  { id: 2, from: 'Sarah Chen', subject: 'Design feedback on v2', date: '5h ago', unread: true },
  { id: 3, from: 'Marcus Williams', subject: 'Invoice question', date: '1d ago', unread: false },
]

export default function AdminMessagesPage() {
  const [search, setSearch] = useState('')
  const filtered = data.filter((d) => d.subject.toLowerCase().includes(search.toLowerCase()))
  return <AdminListPage title="Messages" description="Client communication inbox" columns={columns} data={filtered} searchValue={search} onSearchChange={setSearch} actionLabel={null} />
}
