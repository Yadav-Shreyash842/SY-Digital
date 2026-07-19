import { useState } from 'react'
import AdminListPage from '../../components/dashboard/AdminListPage'
import Badge from '../../components/ui/Badge'

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'client', label: 'Client' },
  { key: 'featured', label: 'Featured', render: (row) => row.featured ? <Badge variant="purple">Featured</Badge> : <Badge>Standard</Badge> },
]

const data = [
  { id: 1, title: 'FinFlow Dashboard', category: 'Web App', client: 'FinFlow Corp', featured: true },
  { id: 2, title: 'Luxe Commerce', category: 'E-Commerce', client: 'Luxe Brands', featured: true },
  { id: 3, title: 'Nova Brand Identity', category: 'Branding', client: 'Nova Inc', featured: false },
]

export default function AdminPortfolioPage() {
  const [search, setSearch] = useState('')
  const filtered = data.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()))
  return <AdminListPage title="Portfolio" description="Manage portfolio showcase items" actionLabel="Add Project" columns={columns} data={filtered} searchValue={search} onSearchChange={setSearch} />
}
