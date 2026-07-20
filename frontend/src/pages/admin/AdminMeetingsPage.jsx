import { useState, useEffect, useCallback } from 'react'
import { Eye, CheckCircle, XCircle, Clock, CalendarClock, Ban } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminListPage from '../../components/dashboard/AdminListPage'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Select from '../../components/ui/Select'
import Timeline from '../../components/ui/Timeline'
import useSocket from '../../hooks/useSocket'
import meetingService from '../../services/meeting.service'

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'rejected', label: 'Rejected' },
]

const meetingTypeOptions = [
  { value: '', label: 'All Types' },
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
]

const statusVariant = {
  pending: 'warning',
  approved: 'success',
  completed: 'blue',
  cancelled: 'danger',
  rejected: 'gray',
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const historyIcon = {
  created: Clock,
  approved: CheckCircle,
  completed: CheckCircle,
  cancelled: Ban,
  rejected: XCircle,
  updated: CalendarClock,
}

const columns = [
  {
    key: 'name',
    label: 'Client',
    render: (row) => (
      <div>
        <p className="font-medium text-white">{row.name}</p>
        <p className="text-xs text-text-secondary">{row.email}</p>
      </div>
    ),
  },
  {
    key: 'service',
    label: 'Service',
    render: (row) => <Badge variant="primary">{row.service?.title || '—'}</Badge>,
  },
  {
    key: 'meetingType',
    label: 'Type',
    render: (row) => (
      <Badge variant={row.meetingType === 'online' ? 'blue' : 'primary'}>
        {row.meetingType === 'online' ? 'Online' : 'Offline'}
      </Badge>
    ),
  },
  {
    key: 'meetingDate',
    label: 'Date',
    render: (row) => <span className="text-sm text-text-secondary">{formatDate(row.meetingDate)}</span>,
  },
  {
    key: 'meetingTime',
    label: 'Time',
    render: (row) => <span className="text-sm text-text-secondary">{row.meetingTime || '—'}</span>,
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => (
      <Badge variant={statusVariant[row.status] || 'gray'}>
        {row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
      </Badge>
    ),
  },
]

export default function AdminMeetingsPage() {
  const { connect } = useSocket()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [stats, setStats] = useState({ pending: 0, approved: 0, completed: 0 })

  const [showView, setShowView] = useState(false)
  const [showReschedule, setShowReschedule] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const [showStatusConfirm, setShowStatusConfirm] = useState(false)
  const [selected, setSelected] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  const [rescheduleData, setRescheduleData] = useState({ meetingDate: '', meetingTime: '' })
  const [cancelReason, setCancelReason] = useState('')
  const [statusAction, setStatusAction] = useState({ status: '', adminNotes: '', meetingLink: '' })

  const [meetingHistory, setMeetingHistory] = useState([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 10 }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter
      if (typeFilter) params.meetingType = typeFilter

      const res = await meetingService.list(params)
      const payload = res?.data
      setData(payload?.meetings || [])
      setTotalPages(payload?.pagination?.totalPages || 1)
      setTotal(payload?.pagination?.totalItems || 0)

      const allRes = await meetingService.list({ limit: 100 })
      const allMeetings = allRes?.data?.meetings || []
      setStats({
        pending: allMeetings.filter((m) => m.status === 'pending').length,
        approved: allMeetings.filter((m) => m.status === 'approved').length,
        completed: allMeetings.filter((m) => m.status === 'completed').length,
      })
    } catch {
      toast.error('Failed to load meetings')
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter, typeFilter])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setPage(1) }, [search, statusFilter, typeFilter])

  useEffect(() => {
    const socket = connect()
    if (!socket) return

    const handleNewMeeting = () => { fetchData() }
    socket.on('newMeeting', handleNewMeeting)

    return () => { socket.off('newMeeting', handleNewMeeting) }
  }, [connect, fetchData])

  const openView = async (row) => {
    setSelected(row)
    setShowView(true)
    try {
      const res = await meetingService.getById(row._id)
      const detail = res?.data
      if (detail) setSelected(detail)
      const histRes = await meetingService.history(row._id)
      setMeetingHistory(histRes?.data || detail?.history || [])
    } catch {
      toast.error('Failed to load meeting details')
    }
  }

  const openReschedule = (row) => {
    setSelected(row)
    setRescheduleData({
      meetingDate: row.meetingDate ? new Date(row.meetingDate).toISOString().split('T')[0] : '',
      meetingTime: row.meetingTime || '',
    })
    setShowReschedule(true)
  }

  const openCancel = (row) => {
    setSelected(row)
    setCancelReason('')
    setShowCancel(true)
  }

  const openStatusAction = (row, status) => {
    setSelected(row)
    setStatusAction({ status, adminNotes: '', meetingLink: '' })
    setShowStatusConfirm(true)
  }

  const handleStatusUpdate = async () => {
    setFormLoading(true)
    try {
      await meetingService.updateStatus(selected._id, {
        status: statusAction.status,
        adminNotes: statusAction.adminNotes,
        meetingLink: statusAction.meetingLink,
      })
      toast.success(`Meeting ${statusAction.status}`)
      setShowStatusConfirm(false)
      fetchData()
      if (showView) openView(selected)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status')
    } finally {
      setFormLoading(false)
    }
  }

  const handleReschedule = async () => {
    if (!rescheduleData.meetingDate || !rescheduleData.meetingTime) {
      toast.error('Please select date and time')
      return
    }
    setFormLoading(true)
    try {
      await meetingService.reschedule(selected._id, rescheduleData)
      toast.success('Meeting rescheduled')
      setShowReschedule(false)
      fetchData()
      if (showView) openView(selected)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to reschedule')
    } finally {
      setFormLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason')
      return
    }
    setFormLoading(true)
    try {
      await meetingService.cancel(selected._id, cancelReason)
      toast.success('Meeting cancelled')
      setShowCancel(false)
      fetchData()
      if (showView) openView(selected)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to cancel')
    } finally {
      setFormLoading(false)
    }
  }

  const getActions = (row) => {
    const base = [{ icon: Eye, label: 'View', onClick: openView }]
    if (row.status === 'pending') {
      base.push({ icon: CheckCircle, label: 'Approve', onClick: () => openStatusAction(row, 'approved') })
      base.push({ icon: XCircle, label: 'Reject', onClick: () => openStatusAction(row, 'rejected'), variant: 'danger' })
    }
    if (row.status === 'approved') {
      base.push({ icon: CheckCircle, label: 'Complete', onClick: () => openStatusAction(row, 'completed') })
      base.push({ icon: CalendarClock, label: 'Reschedule', onClick: () => openReschedule(row) })
      base.push({ icon: Ban, label: 'Cancel', onClick: () => openCancel(row), variant: 'danger' })
    }
    return base
  }

  const timelineItems = meetingHistory.map((h) => ({
    date: formatDate(h.createdAt),
    title: h.action?.charAt(0).toUpperCase() + h.action?.slice(1),
    description: h.description,
    icon: historyIcon[h.action] || Clock,
  }))

  return (
    <>
      <AdminListPage
        title="Meetings"
        description="Schedule and manage client meetings"
        columns={columns}
        data={data}
        loading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        emptyTitle="No meetings found"
        emptyDescription="No meetings match your current filters."
        stats={[
          { label: 'Total', value: total, color: 'from-primary to-primary' },
          { label: 'Pending', value: stats.pending, color: 'from-yellow-500 to-orange-500' },
          { label: 'Approved', value: stats.approved, color: 'from-green-500 to-emerald-500' },
          { label: 'Completed', value: stats.completed, color: 'from-blue-500 to-cyan-500' },
        ]}
        filters={
          <div className="flex gap-4">
            <Select options={statusOptions} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-44" />
            <Select options={meetingTypeOptions} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-40" />
          </div>
        }
        pagination={{ page, totalPages, total, onPageChange: setPage }}
        actions={getActions}
      />

      {/* View Details Modal */}
      <Modal isOpen={showView} onClose={() => setShowView(false)} title="Meeting Details" size="lg">
        {selected && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-text-secondary">Client:</span> <span className="font-medium">{selected.name}</span></div>
              <div><span className="text-text-secondary">Email:</span> {selected.email}</div>
              <div><span className="text-text-secondary">Phone:</span> {selected.phone}</div>
              <div><span className="text-text-secondary">Service:</span> <Badge variant="primary">{selected.service?.title || '—'}</Badge></div>
              <div><span className="text-text-secondary">Type:</span> <Badge variant={selected.meetingType === 'online' ? 'blue' : 'primary'}>{selected.meetingType}</Badge></div>
              <div><span className="text-text-secondary">Status:</span> <Badge variant={statusVariant[selected.status]}>{selected.status?.charAt(0).toUpperCase() + selected.status?.slice(1)}</Badge></div>
              <div><span className="text-text-secondary">Date:</span> {formatDate(selected.meetingDate)}</div>
              <div><span className="text-text-secondary">Time:</span> {selected.meetingTime}</div>
              <div><span className="text-text-secondary">Duration:</span> {selected.duration || 30} min</div>
              <div><span className="text-text-secondary">Budget:</span> ₹{selected.budget?.toLocaleString() || '0'}</div>
            </div>

            {selected.projectRequirements && (
              <div>
                <p className="text-sm text-text-muted mb-1">Requirements</p>
                <p className="text-sm text-text-secondary">{selected.projectRequirements}</p>
              </div>
            )}

            {selected.meetingType === 'online' && selected.meetingLink && (
              <div>
                <p className="text-sm text-text-muted mb-1">Meeting Link</p>
                <a href={selected.meetingLink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">{selected.meetingLink}</a>
              </div>
            )}

            {selected.meetingType === 'offline' && selected.officeAddress && (
              <div>
                <p className="text-sm text-text-muted mb-1">Office Address</p>
                <p className="text-sm text-text-secondary">{selected.officeAddress}</p>
              </div>
            )}

            {selected.adminNotes && (
              <div>
                <p className="text-sm text-text-muted mb-1">Admin Notes</p>
                <p className="text-sm text-text-secondary">{selected.adminNotes}</p>
              </div>
            )}

            {selected.cancellationReason && (
              <div>
                <p className="text-sm text-text-secondary mb-1">Cancellation Reason</p>
                <p className="text-sm text-danger">{selected.cancellationReason}</p>
              </div>
            )}

            {timelineItems.length > 0 && (
              <div>
                <p className="text-sm text-text-muted mb-3">History</p>
                <Timeline items={timelineItems} />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              {selected.status === 'pending' && (
                <>
                  <Button variant="primary" onClick={() => openStatusAction(selected, 'approved')}>Approve</Button>
                  <Button variant="danger" onClick={() => openStatusAction(selected, 'rejected')}>Reject</Button>
                </>
              )}
              {selected.status === 'approved' && (
                <>
                  <Button variant="primary" onClick={() => openStatusAction(selected, 'completed')}>Mark Complete</Button>
                  <Button variant="outline" onClick={() => { openReschedule(selected) }}>Reschedule</Button>
                  <Button variant="danger" onClick={() => openCancel(selected)}>Cancel</Button>
                </>
              )}
              <Button variant="outline" onClick={() => setShowView(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Status Confirm Modal */}
      <Modal isOpen={showStatusConfirm} onClose={() => setShowStatusConfirm(false)} title={`${statusAction.status?.charAt(0).toUpperCase() + statusAction.status?.slice(1)} Meeting`} size="md">
        <div className="space-y-4">
          <Textarea
            label="Admin Notes"
            placeholder="Optional notes..."
            value={statusAction.adminNotes}
            onChange={(e) => setStatusAction({ ...statusAction, adminNotes: e.target.value })}
          />
          {statusAction.status === 'approved' && selected?.meetingType === 'online' && (
            <Input
              label="Meeting Link"
              placeholder="https://..."
              value={statusAction.meetingLink}
              onChange={(e) => setStatusAction({ ...statusAction, meetingLink: e.target.value })}
            />
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowStatusConfirm(false)}>Cancel</Button>
            <Button variant={statusAction.status === 'rejected' ? 'danger' : 'primary'} onClick={handleStatusUpdate} loading={formLoading}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reschedule Modal */}
      <Modal isOpen={showReschedule} onClose={() => setShowReschedule(false)} title="Reschedule Meeting" size="md">
        <div className="space-y-4">
          <Input
            label="New Date"
            type="date"
            value={rescheduleData.meetingDate}
            onChange={(e) => setRescheduleData({ ...rescheduleData, meetingDate: e.target.value })}
          />
          <Input
            label="New Time"
            type="time"
            value={rescheduleData.meetingTime}
            onChange={(e) => setRescheduleData({ ...rescheduleData, meetingTime: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowReschedule(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleReschedule} loading={formLoading}>Reschedule</Button>
          </div>
        </div>
      </Modal>

      {/* Cancel Modal */}
      <Modal isOpen={showCancel} onClose={() => setShowCancel(false)} title="Cancel Meeting" size="md">
        <div className="space-y-4">
          <Textarea
            label="Reason for Cancellation"
            placeholder="Provide a reason..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowCancel(false)}>Close</Button>
            <Button variant="danger" onClick={handleCancel} loading={formLoading}>Cancel Meeting</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
