import { useState, useEffect, useCallback } from 'react'
import { DollarSign, CreditCard, Clock, CheckCircle, Eye, Pencil, Ban, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminListPage from '../../components/dashboard/AdminListPage'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Select from '../../components/ui/Select'
import paymentService from '../../services/payment.service'

const currencyOptions = [
  { value: 'INR', label: 'INR' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
]

const paymentMethodOptions = [
  { value: 'razorpay', label: 'Razorpay' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'cash', label: 'Cash' },
  { value: 'bank-transfer', label: 'Bank Transfer' },
]

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
]

const methodFilterOptions = [
  { value: '', label: 'All Methods' },
  { value: 'razorpay', label: 'Razorpay' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'cash', label: 'Cash' },
  { value: 'bank-transfer', label: 'Bank Transfer' },
]

const currencyFilterOptions = [
  { value: '', label: 'All Currencies' },
  { value: 'INR', label: 'INR' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
]

const statusVariant = {
  pending: 'warning',
  paid: 'success',
  failed: 'danger',
  refunded: 'blue',
}

const methodVariant = {
  razorpay: 'primary',
  stripe: 'blue',
  cash: 'success',
  'bank-transfer': 'gray',
}

const formatCurrency = (amount, currency = 'INR') => {
  const symbols = { INR: '₹', USD: '$', EUR: '€' }
  return `${symbols[currency] || '₹'}${Number(amount).toLocaleString('en-IN')}`
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const columns = [
  {
    key: 'clientName',
    label: 'Client',
    render: (row) => (
      <div>
        <p className="font-medium text-white">{row.clientName}</p>
        <p className="text-xs text-text-secondary">{row.clientEmail}</p>
      </div>
    ),
  },
  {
    key: 'amount',
    label: 'Amount',
    render: (row) => (
      <span className="font-semibold text-white">
        {formatCurrency(row.amount, row.currency)}
      </span>
    ),
  },
  {
    key: 'currency',
    label: 'Currency',
    render: (row) => (
      <Badge variant="gray">{row.currency}</Badge>
    ),
  },
  {
    key: 'paymentMethod',
    label: 'Method',
    render: (row) => (
      <Badge variant={methodVariant[row.paymentMethod] || 'gray'}>
        {row.paymentMethod?.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
      </Badge>
    ),
  },
  {
    key: 'paymentStatus',
    label: 'Status',
    render: (row) => (
      <Badge variant={statusVariant[row.paymentStatus] || 'gray'}>
        {row.paymentStatus?.charAt(0).toUpperCase() + row.paymentStatus?.slice(1)}
      </Badge>
    ),
  },
  {
    key: 'meeting',
    label: 'Meeting',
    render: (row) => (
      <span className="text-sm text-text-secondary">
        {row.meeting?.title || row.meeting?._id?.slice(-6) || '—'}
      </span>
    ),
  },
  {
    key: 'paidAt',
    label: 'Paid At',
    render: (row) => (
      <span className="text-sm text-text-secondary">{formatDate(row.paidAt)}</span>
    ),
  },
]

const emptyForm = {
  clientName: '',
  clientEmail: '',
  amount: '',
  currency: 'INR',
  paymentMethod: 'razorpay',
  meeting: '',
  notes: '',
}

export default function AdminPaymentsPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [methodFilter, setMethodFilter] = useState('')
  const [currencyFilter, setCurrencyFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [stats, setStats] = useState(null)
  const [meetings, setMeetings] = useState([])

  const [showCreate, setShowCreate] = useState(false)
  const [showView, setShowView] = useState(false)
  const [showStatus, setShowStatus] = useState(false)
  const [selected, setSelected] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [formLoading, setFormLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 10 }
      if (search) params.search = search
      if (statusFilter) params.paymentStatus = statusFilter
      if (methodFilter) params.paymentMethod = methodFilter
      if (currencyFilter) params.currency = currencyFilter
      const res = await paymentService.list(params)
      const payload = res?.data
      setData(payload?.payments || [])
      setTotalPages(payload?.totalPages || 1)
      setTotal(payload?.total || 0)
    } catch (err) {
      toast.error('Failed to load payments')
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter, methodFilter, currencyFilter])

  const fetchStats = useCallback(async () => {
    try {
      const res = await paymentService.stats()
      setStats(res?.data)
    } catch {
      // silent
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { fetchStats() }, [fetchStats])
  useEffect(() => { setPage(1) }, [search, statusFilter, methodFilter, currencyFilter])

  const validateForm = () => {
    const e = {}
    if (!formData.clientName?.trim()) e.clientName = 'Client name is required'
    if (!formData.clientEmail?.trim()) e.clientEmail = 'Email is required'
    if (!formData.amount || Number(formData.amount) <= 0) e.amount = 'Amount must be greater than 0'
    if (!formData.meeting) e.meeting = 'Meeting is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleCreate = async () => {
    if (!validateForm()) return
    setFormLoading(true)
    try {
      await paymentService.create({
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        amount: Number(formData.amount),
        currency: formData.currency,
        paymentMethod: formData.paymentMethod,
        meeting: formData.meeting,
        notes: formData.notes,
      })
      toast.success('Payment created successfully')
      setShowCreate(false)
      setFormData(emptyForm)
      setErrors({})
      fetchData()
      fetchStats()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create payment')
    } finally {
      setFormLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    setFormLoading(true)
    try {
      await paymentService.updateStatus(selected._id, newStatus)
      toast.success(`Payment marked as ${newStatus}`)
      setShowStatus(false)
      setSelected(null)
      fetchData()
      fetchStats()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status')
    } finally {
      setFormLoading(false)
    }
  }

  const openCreate = () => {
    setFormData(emptyForm)
    setErrors({})
    setShowCreate(true)
  }

  const openView = (row) => {
    setSelected(row)
    setShowView(true)
  }

  const openStatus = (row) => {
    setSelected(row)
    setShowStatus(true)
  }

  const statCards = stats
    ? [
        { icon: DollarSign, label: 'Total Payments', value: stats.totalPayments ?? 0, color: 'from-primary to-primary' },
        { icon: Clock, label: 'Pending', value: stats.pendingPayments ?? 0, color: 'from-warning to-warning' },
        { icon: CheckCircle, label: 'Paid', value: stats.paidPayments ?? 0, color: 'from-accent-blue to-accent-cyan' },
        { icon: CreditCard, label: 'Total Revenue', value: formatCurrency(stats.totalRevenue ?? 0), color: 'from-primary to-primary' },
      ]
    : []

  const actions = [
    { icon: Eye, label: 'View', onClick: openView },
    { icon: RefreshCw, label: 'Update Status', onClick: openStatus },
  ]

  return (
    <>
      <AdminListPage
        title="Payments"
        description="Track invoices and payment transactions"
        actionLabel="Create Payment"
        onAction={openCreate}
        columns={columns}
        data={data}
        loading={loading}
        tableLoading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        emptyTitle="No payments found"
        emptyDescription="Create your first payment to get started."
        stats={statCards}
        filters={
          <div className="flex flex-wrap gap-3">
            <Select options={statusOptions} value={statusFilter} onChange={setStatusFilter} className="w-40" />
            <Select options={methodFilterOptions} value={methodFilter} onChange={setMethodFilter} className="w-44" />
            <Select options={currencyFilterOptions} value={currencyFilter} onChange={setCurrencyFilter} className="w-40" />
          </div>
        }
        pagination={{ page, totalPages, total, onPageChange: setPage }}
        actions={actions}
      />

      {/* Create Payment Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Payment" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Client Name"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              error={errors.clientName}
            />
            <Input
              label="Client Email"
              type="email"
              value={formData.clientEmail}
              onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              error={errors.clientEmail}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              error={errors.amount}
            />
            <Select
              label="Currency"
              options={currencyOptions}
              value={formData.currency}
              onChange={(v) => setFormData({ ...formData, currency: v })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Payment Method"
              options={paymentMethodOptions}
              value={formData.paymentMethod}
              onChange={(v) => setFormData({ ...formData, paymentMethod: v })}
            />
            <Input
              label="Meeting ID"
              value={formData.meeting}
              onChange={(e) => setFormData({ ...formData, meeting: e.target.value })}
              error={errors.meeting}
              placeholder="MongoDB ObjectId"
            />
          </div>
          <Textarea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate} loading={formLoading}>Create Payment</Button>
          </div>
        </div>
      </Modal>

      {/* View Payment Detail Modal */}
      <Modal isOpen={showView} onClose={() => setShowView(false)} title="Payment Details" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{selected.clientName}</h3>
                <p className="text-sm text-text-secondary">{selected.clientEmail}</p>
              </div>
              <Badge variant={statusVariant[selected.paymentStatus] || 'gray'}>
                {selected.paymentStatus?.charAt(0).toUpperCase() + selected.paymentStatus?.slice(1)}
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-secondary">Amount:</span>{' '}
                <span className="font-semibold">{formatCurrency(selected.amount, selected.currency)}</span>
              </div>
              <div>
                <span className="text-text-secondary">Currency:</span>{' '}
                <Badge variant="gray">{selected.currency}</Badge>
              </div>
              <div>
                <span className="text-text-secondary">Method:</span>{' '}
                <Badge variant={methodVariant[selected.paymentMethod] || 'gray'}>
                  {selected.paymentMethod?.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </Badge>
              </div>
              <div>
                <span className="text-text-secondary">Meeting:</span>{' '}
                {selected.meeting?.title || selected.meeting?._id || '—'}
              </div>
              <div>
                <span className="text-text-secondary">Transaction ID:</span>{' '}
                {selected.transactionId || '—'}
              </div>
              <div>
                <span className="text-text-secondary">Order ID:</span>{' '}
                {selected.orderId || '—'}
              </div>
              <div>
                <span className="text-text-secondary">Paid At:</span>{' '}
                {formatDate(selected.paidAt)}
              </div>
              <div>
                <span className="text-text-secondary">Created:</span>{' '}
                {formatDate(selected.createdAt)}
              </div>
            </div>
            {selected.notes && (
              <div>
                <span className="text-sm text-text-secondary">Notes:</span>
                <p className="text-sm mt-1">{selected.notes}</p>
              </div>
            )}
            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => setShowView(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Status Update Modal */}
      <Modal isOpen={showStatus} onClose={() => setShowStatus(false)} title="Update Payment Status" size="sm">
        {selected && (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Update status for payment to <span className="font-medium">{selected.clientName}</span> ({formatCurrency(selected.amount, selected.currency)})
            </p>
            <p className="text-xs text-text-secondary">
              Current status: <Badge variant={statusVariant[selected.paymentStatus]}>{selected.paymentStatus}</Badge>
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {selected.paymentStatus !== 'paid' && (
                <Button variant="primary" onClick={() => handleStatusUpdate('paid')} loading={formLoading}>
                  Mark as Paid
                </Button>
              )}
              {selected.paymentStatus !== 'failed' && (
                <Button variant="danger" onClick={() => handleStatusUpdate('failed')} loading={formLoading}>
                  Mark as Failed
                </Button>
              )}
              {selected.paymentStatus !== 'refunded' && (
                <Button variant="outline" onClick={() => handleStatusUpdate('refunded')} loading={formLoading}>
                  Mark as Refunded
                </Button>
              )}
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => setShowStatus(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
