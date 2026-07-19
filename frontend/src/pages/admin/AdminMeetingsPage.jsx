import { useState } from 'react'
import AdminListPage from '../../components/dashboard/AdminListPage'
import Badge from '../../components/ui/Badge'

const columns = [
  { key: 'title', label: 'Meeting' },
  { key: 'client', label: 'Client' },
  { key: 'datetime', label: 'Date & Time' },
  { key: 'type', label: 'Type', render: (row) => <Badge variant="blue">{row.type}</Badge> },
]

const data = [
  { id: 1, title: 'Project Review — FinFlow', client: 'John Doe', datetime: 'Jul 20, 2026 · 2:00 PM', type: 'Video Call' },
  { id: 2, title: 'Design Walkthrough', client: 'Sarah Chen', datetime: 'Jul 22, 2026 · 10:00 AM', type: 'Video Call' },
  { id: 3, title: 'Q3 Strategy Session', client: 'Marcus W.', datetime: 'Jul 25, 2026 · 3:30 PM', type: 'In Person' },
]

export default function AdminMeetingsPage() {
  const [search, setSearch] = useState('')
  const filtered = data.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()))
  return <AdminListPage title="Meetings" description="Schedule and manage client meetings" actionLabel="Schedule Meeting" columns={columns} data={filtered} searchValue={search} onSearchChange={setSearch} />
}
