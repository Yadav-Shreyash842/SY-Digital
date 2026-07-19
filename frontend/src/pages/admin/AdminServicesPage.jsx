import { useState } from 'react'
import Badge from '../../components/ui/Badge'
import AdminListPage from '../../components/dashboard/AdminListPage'

const columns = [
  { key: 'name', label: 'Service' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Starting Price' },
  { key: 'status', label: 'Status', render: (row) => <Badge variant={row.status === 'Active' ? 'success' : 'warning'}>{row.status}</Badge> },
]

const data = [
  { id: 1, name: 'Web Development', category: 'Development', price: '$2,499/mo', status: 'Active' },
  { id: 2, name: 'UI/UX Design', category: 'Design', price: '$1,999/mo', status: 'Active' },
  { id: 3, name: 'Digital Marketing', category: 'Marketing', price: '$1,499/mo', status: 'Active' },
  { id: 4, name: 'Brand Strategy', category: 'Strategy', price: '$3,499/mo', status: 'Draft' },
]

export default function AdminServicesPage() {
  const [search, setSearch] = useState('')
  const filtered = data.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <AdminListPage
      title="Services"
      description="Manage your agency service offerings"
      actionLabel="Add Service"
      columns={columns}
      data={filtered}
      searchValue={search}
      onSearchChange={setSearch}
      pagination={{ currentPage: 1, totalPages: 1, onPageChange: () => {} }}
    />
  )
}
