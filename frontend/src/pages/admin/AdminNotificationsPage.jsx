import { useState, useEffect, useCallback } from 'react'
import { Bell, Calendar, DollarSign, Star, MessageSquare, User, Settings, Trash2, CheckCheck, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminListPage from '../../components/dashboard/AdminListPage'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import notificationService from '../../services/notification.service'

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'payment', label: 'Payment' },
  { value: 'review', label: 'Review' },
  { value: 'message', label: 'Message' },
  { value: 'user', label: 'User' },
  { value: 'system', label: 'System' },
]

const readOptions = [
  { value: '', label: 'All Status' },
  { value: 'false', label: 'Unread' },
  { value: 'true', label: 'Read' },
]

const typeIconMap = {
  meeting: Calendar,
  payment: DollarSign,
  review: Star,
  message: MessageSquare,
  user: User,
  system: Settings,
}

const typeBadgeVariant = {
  meeting: 'blue',
  payment: 'success',
  review: 'primary',
  message: 'default',
  user: 'blue',
  system: 'warning',
}

function timeAgo(dateStr) {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const seconds = Math.floor((now - then) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

export default function AdminNotificationsPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [readFilter, setReadFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [statsData, setStatsData] = useState({ totalNotifications: 0, unreadNotifications: 0, readNotifications: 0 })

  const [showDelete, setShowDelete] = useState(false)
  const [selected, setSelected] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 10 }
      if (search) params.search = search
      if (typeFilter) params.type = typeFilter
      if (readFilter) params.isRead = readFilter
      const res = await notificationService.list(params)
      const payload = res?.data
      setData(payload?.notifications || [])
      setTotalPages(payload?.pagination?.totalPages || 1)
      setTotal(payload?.pagination?.total || 0)
    } catch (err) {
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }, [page, search, typeFilter, readFilter])

  const fetchStats = useCallback(async () => {
    try {
      const res = await notificationService.stats()
      const payload = res?.data
      setStatsData({
        totalNotifications: payload?.totalNotifications || 0,
        unreadNotifications: payload?.unreadNotifications || 0,
        readNotifications: payload?.readNotifications || 0,
      })
    } catch {
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { fetchStats() }, [fetchStats])

  useEffect(() => {
    setPage(1)
  }, [search, typeFilter, readFilter])

  const handleMarkRead = async (row) => {
    if (row.isRead) return
    try {
      await notificationService.markRead(row._id)
      setData((prev) => prev.map((n) => (n._id === row._id ? { ...n, isRead: true } : n)))
      setStatsData((prev) => ({
        ...prev,
        unreadNotifications: Math.max(0, prev.unreadNotifications - 1),
        readNotifications: prev.readNotifications + 1,
      }))
      toast.success('Marked as read')
    } catch {
      toast.error('Failed to mark as read')
    }
  }

  const handleMarkAllRead = async () => {
    if (statsData.unreadNotifications === 0) return
    setActionLoading(true)
    try {
      await notificationService.markAllRead()
      setData((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setStatsData((prev) => ({
        ...prev,
        unreadNotifications: 0,
        readNotifications: prev.totalNotifications,
      }))
      toast.success('All notifications marked as read')
    } catch {
      toast.error('Failed to mark all as read')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    setActionLoading(true)
    try {
      await notificationService.remove(selected._id)
      toast.success('Notification deleted')
      setShowDelete(false)
      setSelected(null)
      fetchData()
      fetchStats()
    } catch {
      toast.error('Failed to delete notification')
    } finally {
      setActionLoading(false)
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'Notification',
      render: (row) => {
        const Icon = typeIconMap[row.type] || Bell
        return (
          <button
            onClick={() => handleMarkRead(row)}
            className="flex items-start gap-3 text-left w-full"
          >
            <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
              row.type === 'meeting' ? 'bg-primary/15 text-primary' :
              row.type === 'payment' ? 'bg-success/15 text-success' :
              row.type === 'review' ? 'bg-primary/15 text-primary' :
              row.type === 'message' ? 'bg-white/10 text-text-secondary' :
              row.type === 'user' ? 'bg-primary/15 text-primary' :
              'bg-warning/15 text-warning'
            }`}>
              <Icon strokeWidth={1.75} className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className={`text-sm ${row.isRead ? 'font-normal text-text-secondary' : 'font-semibold text-white'}`}>
                {row.title}
              </p>
              <p className="text-xs text-text-muted truncate max-w-xs">{row.message}</p>
            </div>
          </button>
        )
      },
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <Badge variant={typeBadgeVariant[row.type] || 'default'}>
          {row.type?.charAt(0).toUpperCase() + row.type?.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'isRead',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.isRead ? 'success' : 'warning'}>
          {row.isRead ? 'Read' : 'Unread'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (row) => (
        <span className="text-sm text-text-secondary">{timeAgo(row.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex items-center gap-1">
          {!row.isRead && (
            <button
              onClick={() => handleMarkRead(row)}
              className="rounded-lg p-2 text-text-muted hover:bg-primary/10 hover:text-primary transition-colors"
              title="Mark as read"
            >
              <Check strokeWidth={1.75} className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => { setSelected(row); setShowDelete(true) }}
            className="rounded-lg p-2 text-text-muted hover:bg-danger/10 hover:text-danger transition-colors"
            title="Delete"
          >
            <Trash2 strokeWidth={1.75} className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  const stats = [
    {
      icon: Bell,
      label: 'Total Notifications',
      value: statsData.totalNotifications,
      color: 'from-primary to-primary',
    },
    {
      icon: CheckCheck,
      label: 'Read',
      value: statsData.readNotifications,
      color: 'from-success to-success',
    },
    {
      icon: Bell,
      label: 'Unread',
      value: statsData.unreadNotifications,
      color: 'from-warning to-warning',
    },
  ]

  return (
    <>
      <AdminListPage
        title="Notifications"
        description="View and manage system notifications"
        columns={columns}
        data={data}
        tableLoading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        stats={stats}
        emptyTitle="No notifications"
        emptyDescription="There are no notifications to display."
        filters={
          <div className="flex items-center gap-3">
            <Select options={typeOptions} value={typeFilter} onChange={setTypeFilter} className="w-40" />
            <Select options={readOptions} value={readFilter} onChange={setReadFilter} className="w-40" />
          </div>
        }
        toolbar={
          <div className="flex justify-end">
            <Button
              variant="light"
              className="!h-10 !px-4 !text-sm"
              onClick={handleMarkAllRead}
              loading={actionLoading}
              disabled={statsData.unreadNotifications === 0}
            >
              <CheckCheck strokeWidth={1.75} className="h-4 w-4" />
              Mark All as Read
            </Button>
          </div>
        }
        pagination={{ page, totalPages, total, onPageChange: setPage }}
        actionLabel={null}
      />

      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Notification"
        message={`Are you sure you want to delete "${selected?.title}"? This action cannot be undone.`}
        loading={actionLoading}
        variant="danger"
      />
    </>
  )
}
