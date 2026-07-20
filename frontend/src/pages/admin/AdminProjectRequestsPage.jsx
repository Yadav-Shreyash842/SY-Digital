import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  MessageSquare,
  ArrowRight,
  CalendarClock,
  Loader2,
  FolderKanban,
  Sparkles,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Textarea from '../../components/ui/Textarea'
import Select from '../../components/ui/Select'
import projectRequestService from '../../services/projectRequest.service'
import useSocket from '../../hooks/useSocket'

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

const statusVariant = {
  pending: 'warning',
  reviewing: 'blue',
  approved: 'success',
  rejected: 'danger',
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminProjectRequestsPage() {
  const { connect } = useSocket()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const [showView, setShowView] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [selected, setSelected] = useState(null)
  const [rejectNotes, setRejectNotes] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const statsData = {
    total: total,
    pending: data.filter((d) => d.status === 'pending').length,
    approved: data.filter((d) => d.status === 'approved').length,
    rejected: data.filter((d) => d.status === 'rejected').length,
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 12 }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter
      const res = await projectRequestService.list(params)
      const payload = res?.data
      setData(payload?.requests || [])
      setTotalPages(payload?.pagination?.totalPages || 1)
      setTotal(payload?.pagination?.total || 0)
    } catch {
      toast.error('Failed to load project requests')
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setPage(1) }, [search, statusFilter])

  useEffect(() => {
    const socket = connect()
    if (!socket) return
    const handleUpdate = () => { fetchData() }
    socket.on('newProjectRequest', handleUpdate)
    socket.on('projectRequestUpdated', handleUpdate)
    return () => {
      socket.off('newProjectRequest', handleUpdate)
      socket.off('projectRequestUpdated', handleUpdate)
    }
  }, [connect, fetchData])

  const handleView = (row) => { setSelected(row); setShowView(true) }

  const handleApprove = async (row) => {
    setActionLoading(true)
    try {
      await projectRequestService.updateStatus(row._id, { status: 'approved', adminNotes: 'Approved — Project created and client notified.' })
      toast.success('Project approved! Client has been notified.')
      setShowView(false)
      fetchData()
    } catch {
      toast.error('Failed to approve request')
    } finally {
      setActionLoading(false)
    }
  }

  const handleMarkReviewing = async (row) => {
    setActionLoading(true)
    try {
      await projectRequestService.updateStatus(row._id, { status: 'reviewing', adminNotes: 'Under review.' })
      toast.success('Marked as reviewing')
      setShowView(false)
      fetchData()
    } catch {
      toast.error('Failed to update status')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!selected) return
    setActionLoading(true)
    try {
      await projectRequestService.updateStatus(selected._id, { status: 'rejected', adminNotes: rejectNotes || 'Rejected.' })
      toast.success('Project request rejected')
      setShowReject(false)
      setShowView(false)
      setRejectNotes('')
      fetchData()
    } catch {
      toast.error('Failed to reject request')
    } finally {
      setActionLoading(false)
    }
  }

  const stats = [
    { label: 'Total Requests', value: statsData.total, icon: FolderKanban, accent: 'from-primary to-primary' },
    { label: 'Pending Review', value: statsData.pending, icon: Clock, accent: 'from-warning to-orange-400' },
    { label: 'Approved', value: statsData.approved, icon: CheckCircle, accent: 'from-success to-emerald-400' },
    { label: 'Rejected', value: statsData.rejected, icon: XCircle, accent: 'from-danger to-red-400' },
  ]

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-card border border-border bg-card-bg p-4 sm:p-6 lg:p-8"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-btn border border-border bg-card-bg px-4 py-2 text-xs uppercase tracking-[0.24em] text-text-secondary">
              <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.75} />
              Project Requests
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">Client Project Requests</h1>
            <p className="mt-3 max-w-2xl text-sm text-text-muted">
              Review incoming project requests, approve or reject them, and connect with clients to start delivery.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-btn bg-card-bg border border-border px-4 py-3 text-sm text-text-secondary">
            {total} total request{total !== 1 ? 's' : ''}
          </div>
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            className="rounded-card border border-border bg-card-bg p-6"
          >
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-btn bg-linear-to-br from-primary/20 to-primary/20 text-white">
              <item.icon strokeWidth={1.75} className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm uppercase tracking-[0.18em] text-text-muted">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
            <div className={`mt-4 h-2 rounded-full bg-white/10 bg-linear-to-r ${item.accent}`} />
          </motion.div>
        ))}
      </motion.div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search strokeWidth={1.75} className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            placeholder="Search by client, title, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-input border border-border bg-card-bg pl-12 pr-4 text-sm text-white placeholder:text-text-muted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-card border border-border bg-card-bg p-12 text-center">
          <FolderKanban strokeWidth={1.75} className="mx-auto h-10 w-10 text-text-muted" />
          <p className="mt-4 text-text-muted">No project requests found.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((req, i) => (
            <motion.button
              key={req._id}
              type="button"
              onClick={() => handleView(req)}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="rounded-card border border-border bg-card-bg p-6 text-left transition-all duration-300 hover:border-border hover:bg-white/[0.04] hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-white">{req.title}</p>
                  <p className="mt-1 text-sm text-text-muted">{req.clientName}</p>
                </div>
                <Badge variant={statusVariant[req.status]}>{req.status}</Badge>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-btn bg-card-bg border border-border px-3 py-1 text-xs text-text-secondary">{req.category}</span>
                {req.budget > 0 && (
                  <span className="rounded-btn bg-card-bg border border-border px-3 py-1 text-xs text-text-secondary">INR {req.budget.toLocaleString()}</span>
                )}
              </div>

              <p className="mt-3 line-clamp-2 text-sm text-text-muted">{req.description}</p>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs text-text-muted">{formatDate(req.createdAt)}</span>
                {req.projectId && (
                  <span className="inline-flex items-center gap-1 text-xs text-success">
                    <CheckCircle strokeWidth={1.75} className="h-3 w-3" />
                    Project created
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`h-10 w-10 rounded-full text-sm font-semibold transition ${
                page === p
                  ? 'bg-primary text-white'
                  : 'bg-card-bg text-text-muted hover:bg-white/10'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {showView && selected && (
        <Modal onClose={() => setShowView(false)} title="Project Request">
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-text-muted">Client</p>
                <p className="font-semibold text-white">{selected.clientName}</p>
                <p className="text-sm text-text-secondary">{selected.clientEmail}</p>
              </div>
              <Badge variant={statusVariant[selected.status]}>{selected.status}</Badge>
            </div>

            <div>
              <p className="text-sm text-text-muted">Project Title</p>
              <p className="font-semibold text-white">{selected.title}</p>
            </div>

            <div>
              <p className="text-sm text-text-muted">Category</p>
              <Badge variant="primary">{selected.category}</Badge>
            </div>

            <div>
              <p className="text-sm text-text-muted">Description</p>
              <p className="text-sm leading-7 whitespace-pre-wrap text-text-secondary">{selected.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {selected.budget > 0 && (
                <div>
                  <p className="text-sm text-text-muted">Budget</p>
                  <p className="font-semibold text-white">INR {selected.budget.toLocaleString()}</p>
                </div>
              )}
              {selected.timeline && (
                <div>
                  <p className="text-sm text-text-muted">Timeline</p>
                  <p className="font-semibold text-white">{selected.timeline}</p>
                </div>
              )}
            </div>

            {selected.adminNotes && (
              <div className="rounded-btn border border-border bg-card-bg p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Admin Notes</p>
                <p className="mt-1 text-sm text-text-secondary">{selected.adminNotes}</p>
              </div>
            )}

            {selected.projectId && (
              <div className="rounded-btn border border-success/20 bg-success/10 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle strokeWidth={1.75} className="h-4 w-4 text-success" />
                  <p className="text-sm font-semibold text-success">Project Created</p>
                </div>
                <p className="mt-1 text-sm text-text-muted">"{selected.projectId.title}" — Status: {selected.projectId.status}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              {selected.status === 'pending' && (
                <>
                  <Button variant="primary" loading={actionLoading} onClick={() => handleApprove(selected)}>
                    <CheckCircle strokeWidth={1.75} className="h-4 w-4" />
                    Approve & Create Project
                  </Button>
                  <Button variant="secondary" loading={actionLoading} onClick={() => handleMarkReviewing(selected)}>
                    <CalendarClock strokeWidth={1.75} className="h-4 w-4" />
                    Mark as Reviewing
                  </Button>
                  <Button variant="danger" onClick={() => setShowReject(true)}>
                    <XCircle strokeWidth={1.75} className="h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}
              {selected.status === 'reviewing' && (
                <>
                  <Button variant="primary" loading={actionLoading} onClick={() => handleApprove(selected)}>
                    <CheckCircle strokeWidth={1.75} className="h-4 w-4" />
                    Approve & Create Project
                  </Button>
                  <Button variant="danger" onClick={() => setShowReject(true)}>
                    <XCircle strokeWidth={1.75} className="h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}
              <Link
                to="/client/messages"
                className="inline-flex items-center gap-2 rounded-btn border border-border bg-card-bg px-5 py-3 text-sm font-semibold text-text-secondary transition hover:bg-white/10"
              >
                <MessageSquare strokeWidth={1.75} className="h-4 w-4" />
                Contact Client
                <ArrowRight strokeWidth={1.75} className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Modal>
      )}

      {showReject && (
        <Modal onClose={() => setShowReject(false)} title="Reject Project Request">
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">Provide feedback for the client so they understand why this request was rejected.</p>
            <Textarea
              label="Rejection Reason"
              placeholder="Explain why this request cannot be approved..."
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              rows={4}
            />
            <div className="flex gap-3">
              <Button variant="danger" loading={actionLoading} onClick={handleReject}>
                Confirm Rejection
              </Button>
              <Button variant="secondary" onClick={() => setShowReject(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
