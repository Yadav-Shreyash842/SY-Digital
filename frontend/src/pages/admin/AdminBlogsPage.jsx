import { useState } from 'react'
import AdminListPage from '../../components/dashboard/AdminListPage'
import Badge from '../../components/ui/Badge'

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  { key: 'date', label: 'Published' },
  { key: 'status', label: 'Status', render: (row) => <Badge variant={row.status === 'Published' ? 'success' : 'warning'}>{row.status}</Badge> },
]

const data = [
  { id: 1, title: 'The Future of Digital Agencies', author: 'Sarah Chen', date: 'Jul 10, 2026', status: 'Published' },
  { id: 2, title: 'Building Design Systems', author: 'Marcus W.', date: 'Jul 5, 2026', status: 'Published' },
  { id: 3, title: 'React Performance Guide', author: 'Dev Team', date: 'Jun 20, 2026', status: 'Draft' },
]

export default function AdminBlogsPage() {
  const [search, setSearch] = useState('')
  const filtered = data.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()))
  return <AdminListPage title="Blogs" description="Manage blog posts and articles" actionLabel="New Post" columns={columns} data={filtered} searchValue={search} onSearchChange={setSearch} />
}
