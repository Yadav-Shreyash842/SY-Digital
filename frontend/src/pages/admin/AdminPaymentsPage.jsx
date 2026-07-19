import { useState } from 'react'
import { DollarSign, CreditCard, Clock, CheckCircle } from 'lucide-react'
import AdminListPage from '../../components/dashboard/AdminListPage'
import Badge from '../../components/ui/Badge'

const columns = [
  { key: 'id', label: 'Payment ID' },
  { key: 'client', label: 'Client' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status', render: (row) => <Badge variant={row.status === 'Paid' ? 'success' : row.status === 'Pending' ? 'warning' : 'danger'}>{row.status}</Badge> },
  { key: 'date', label: 'Date' },
]

const data = [
  { id: 'PAY-001', client: 'FinFlow Corp', amount: '$12,500', status: 'Paid', date: 'Jul 15, 2026' },
  { id: 'PAY-002', client: 'Luxe Brands', amount: '$8,200', status: 'Pending', date: 'Jul 14, 2026' },
  { id: 'PAY-003', client: 'Nova Inc', amount: '$15,000', status: 'Paid', date: 'Jul 10, 2026' },
]

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState('')
  const filtered = data.filter((d) => d.client.toLowerCase().includes(search.toLowerCase()))
  return (
    <AdminListPage
      title="Payments"
      description="Track invoices and payment transactions"
      columns={columns}
      data={filtered}
      searchValue={search}
      onSearchChange={setSearch}
      stats={[
        { icon: DollarSign, label: 'Total Revenue', value: '$842K', change: '+12%', color: 'from-primary-purple to-secondary-purple' },
        { icon: CheckCircle, label: 'Paid', value: '284', color: 'from-accent-blue to-accent-cyan' },
        { icon: Clock, label: 'Pending', value: '18', color: 'from-warning to-warning' },
        { icon: CreditCard, label: 'This Month', value: '$68K', color: 'from-secondary-purple to-primary-purple' },
      ]}
    />
  )
}
