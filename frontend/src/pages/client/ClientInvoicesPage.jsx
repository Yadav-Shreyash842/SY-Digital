import { useState } from 'react'
import { FileText, Download } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import Table from '../../components/ui/Table'

const invoices = [
  { id: 'INV-2026-042', amount: '$8,500', status: 'Paid', date: 'Jul 1, 2026' },
  { id: 'INV-2026-041', amount: '$12,000', status: 'Pending', date: 'Jun 15, 2026' },
  { id: 'INV-2026-040', amount: '$6,200', status: 'Paid', date: 'May 28, 2026' },
]

const columns = [
  { key: 'id', label: 'Invoice' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status', render: (row) => <Badge variant={row.status === 'Paid' ? 'success' : 'warning'}>{row.status}</Badge> },
  { key: 'date', label: 'Date' },
  { key: 'action', label: '', render: () => (
    <button type="button" className="rounded-lg p-2 transition hover:bg-white/10" aria-label="Download invoice">
      <Download strokeWidth={1.75} className="h-4 w-4 text-slate-200" />
    </button>
  )},
]

export default function ClientInvoicesPage() {
  const [search, setSearch] = useState('')
  const filtered = invoices.filter((i) => i.id.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-8">
      <PageHeader
        title="Invoices"
        description="Review invoice history, download receipts, and track payment status." 
        theme="dark"
      />

      <div className="glass-card rounded-[32px] border border-white/10 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Billing overview</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Payments at a glance</h2>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full bg-white/5 px-4 py-3 text-sm text-slate-300">
            <FileText strokeWidth={1.75} className="h-4 w-4 text-accent-blue" />
            {filtered.length} invoices found
          </div>
        </div>

        <div className="mt-8">
          <Table
            columns={columns}
            data={filtered}
            theme="dark"
            searchable
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search invoices..."
          />
        </div>
      </div>
    </div>
  )
}
