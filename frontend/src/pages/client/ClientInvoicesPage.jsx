import { useState, useEffect, useMemo } from 'react'
import { FileText, Download, Loader2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import Table from '../../components/ui/Table'
import useAuth from '../../hooks/useAuth'
import clientService from '../../services/client.service'
import toast from 'react-hot-toast'

export default function ClientInvoicesPage() {
  const { user } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await clientService.payments()
        setPayments(res?.data || [])
      } catch {
        toast.error('Failed to load invoices')
      } finally {
        setLoading(false)
      }
    }

    if (user) fetchPayments()
  }, [user])

  const filtered = useMemo(
    () =>
      payments.filter(
        (p) =>
          p.clientName?.toLowerCase().includes(search.toLowerCase()) ||
          p.paymentStatus?.toLowerCase().includes(search.toLowerCase()) ||
          p.paymentMethod?.toLowerCase().includes(search.toLowerCase())
      ),
    [payments, search]
  )

  const totalPaid = useMemo(
    () =>
      payments
        .filter((p) => p.paymentStatus === 'paid')
        .reduce((sum, p) => sum + (p.amount || 0), 0),
    [payments]
  )

  const totalPending = useMemo(
    () =>
      payments
        .filter((p) => p.paymentStatus === 'pending')
        .reduce((sum, p) => sum + (p.amount || 0), 0),
    [payments]
  )

  const columns = [
    {
      key: 'clientName',
      label: 'Client',
      render: (row) => <span className="text-white">{row.clientName}</span>,
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => (
        <span className="text-white font-semibold">
          {row.currency || 'INR'} {row.amount?.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.paymentStatus === 'paid' ? 'success' : row.paymentStatus === 'failed' ? 'danger' : 'warning'}>
          {row.paymentStatus}
        </Badge>
      ),
    },
    {
      key: 'paymentMethod',
      label: 'Method',
      render: (row) => <span className="text-slate-300 capitalize">{row.paymentMethod?.replace('-', ' ')}</span>,
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (row) => (
        <span className="text-slate-400">
          {row.paidAt
            ? new Date(row.paidAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : row.createdAt
              ? new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : '—'}
        </span>
      ),
    },
    {
      key: 'action',
      label: '',
      render: () => (
        <button type="button" className="rounded-lg p-2 transition hover:bg-white/10" aria-label="Download invoice">
          <Download strokeWidth={1.75} className="h-4 w-4 text-slate-200" />
        </button>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Invoices"
        description="Review invoice history, download receipts, and track payment status."
        theme="dark"
      />

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="glass-card rounded-[28px] border border-white/10 p-6">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Total paid</p>
          <p className="mt-3 text-3xl font-semibold text-white">INR {totalPaid.toLocaleString()}</p>
        </div>
        <div className="glass-card rounded-[28px] border border-white/10 p-6">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Pending</p>
          <p className="mt-3 text-3xl font-semibold text-white">INR {totalPending.toLocaleString()}</p>
        </div>
        <div className="glass-card rounded-[28px] border border-white/10 p-6">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Total invoices</p>
          <p className="mt-3 text-3xl font-semibold text-white">{payments.length}</p>
        </div>
      </div>

      <div className="glass-card rounded-[32px] border border-white/10 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Billing overview</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Payments at a glance</h2>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full bg-white/5 px-4 py-3 text-sm text-slate-300">
            <FileText strokeWidth={1.75} className="h-4 w-4 text-accent-blue" />
            {filtered.length} invoice{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="mt-8">
          {filtered.length === 0 ? (
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-12 text-center">
              <p className="text-slate-400">No invoices found.</p>
            </div>
          ) : (
            <Table
              columns={columns}
              data={filtered}
              theme="dark"
              searchable
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search invoices..."
            />
          )}
        </div>
      </div>
    </div>
  )
}
