import { useState } from 'react'
import AdminListPage from '../../components/dashboard/AdminListPage'
import Badge from '../../components/ui/Badge'

const columns = [
  { key: 'client', label: 'Client' },
  { key: 'rating', label: 'Rating', render: (row) => `${row.rating}/5` },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status', render: (row) => <Badge variant={row.status === 'Approved' ? 'success' : 'warning'}>{row.status}</Badge> },
]

const data = [
  { id: 1, client: 'Sarah Chen — TechVentures', rating: 5, date: 'Jul 12, 2026', status: 'Approved' },
  { id: 2, client: 'Marcus Williams — Elevate Labs', rating: 5, date: 'Jul 8, 2026', status: 'Approved' },
  { id: 3, client: 'James Park — FinFlow', rating: 4, date: 'Jul 3, 2026', status: 'Pending' },
]

export default function AdminReviewsPage() {
  const [search, setSearch] = useState('')
  const filtered = data.filter((d) => d.client.toLowerCase().includes(search.toLowerCase()))
  return <AdminListPage title="Reviews" description="Manage client testimonials and reviews" columns={columns} data={filtered} searchValue={search} onSearchChange={setSearch} actionLabel={null} />
}
