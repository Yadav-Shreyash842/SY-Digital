import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { CheckCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import Breadcrumb from '../../components/ui/Breadcrumb'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import useSocket from '../../hooks/useSocket'
import notificationService from '../../services/notification.service'
import NotificationStatsCards from '../../components/admin/notifications/NotificationStatsCards'
import NotificationFilterBar from '../../components/admin/notifications/NotificationFilterBar'
import NotificationDataTable from '../../components/admin/notifications/NotificationDataTable'
import NotificationRightPanel from '../../components/admin/notifications/NotificationRightPanel'

export default function AdminNotificationsPage() {
  const { connect } = useSocket()

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [readFilter, setReadFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const [selectedNotification, setSelectedNotification] = useState(null)
  const [showDelete, setShowDelete] = useState(false)
  const [selected, setSelected] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const [statsData, setStatsData] = useState({ total: 0, read: 0, unread: 0 })

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
    } catch {
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }, [page, search, typeFilter, readFilter])

  const fetchStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const res = await notificationService.stats()
      const payload = res?.data
      setStatsData({
        total: payload?.totalNotifications || 0,
        read: payload?.readNotifications || 0,
        unread: payload?.unreadNotifications || 0,
      })
    } catch {
      // silent
    } finally {
      setStatsLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { fetchStats() }, [fetchStats])
  useEffect(() => { setPage(1) }, [search, typeFilter, readFilter])

  useEffect(() => {
    const socket = connect()
    if (!socket) return
    const handleNew = () => { fetchData(); fetchStats() }
    socket.on('newNotification', handleNew)
    socket.on('allNotificationsRead', handleNew)
    socket.on('notificationDeleted', handleNew)
    return () => {
      socket.off('newNotification', handleNew)
      socket.off('allNotificationsRead', handleNew)
      socket.off('notificationDeleted', handleNew)
    }
  }, [connect, fetchData, fetchStats])

  const typeDistribution = useMemo(() => {
    const map = {}
    data.forEach((n) => {
      const t = n.type || 'other'
      map[t] = (map[t] || 0) + 1
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [data])

  const handleMarkRead = async (row) => {
    if (row.isRead) return
    try {
      await notificationService.markRead(row._id)
      setData((prev) => prev.map((n) => (n._id === row._id ? { ...n, isRead: true } : n)))
      setStatsData((prev) => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1),
        read: prev.read + 1,
      }))
      toast.success('Marked as read')
    } catch {
      toast.error('Failed to mark as read')
    }
  }

  const handleMarkAllRead = async () => {
    if (statsData.unread === 0) return
    setActionLoading(true)
    try {
      await notificationService.markAllRead()
      setData((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setStatsData((prev) => ({
        ...prev,
        unread: 0,
        read: prev.total,
      }))
      toast.success('All notifications marked as read')
    } catch {
      toast.error('Failed to mark all as read')
    } finally {
      setActionLoading(false)
    }
  }

  const openDelete = (row) => {
    setSelected(row)
    setShowDelete(true)
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

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        <Breadcrumb
          items={[
            { label: 'Notifications', href: '/admin/notifications' },
            { label: 'Manage Notifications' },
          ]}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.04, ease: 'easeInOut' }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Notifications</h1>
          <p className="mt-1 text-sm text-text-muted">
            View and manage system notifications
          </p>
        </div>
        <Button
          variant="light"
          className="!h-10 !px-4 !text-sm self-start sm:self-auto"
          onClick={handleMarkAllRead}
          loading={actionLoading}
          disabled={statsData.unread === 0}
        >
          <CheckCheck strokeWidth={1.75} className="h-4 w-4" />
          Mark All as Read
        </Button>
      </motion.div>

      <NotificationStatsCards stats={statsData} loading={statsLoading} />

      <NotificationFilterBar
        search={search}
        onSearchChange={setSearch}
        type={typeFilter}
        onTypeChange={setTypeFilter}
        readStatus={readFilter}
        onReadStatusChange={setReadFilter}
      />

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="min-w-0">
          <NotificationDataTable
            data={data}
            loading={loading}
            selectedId={selectedNotification?._id}
            onSelect={setSelectedNotification}
            onMarkRead={handleMarkRead}
            onDelete={openDelete}
            pagination={{
              page,
              totalPages,
              total,
              onPageChange: setPage,
            }}
          />
        </div>

        <div className="hidden xl:block">
          <div className="sticky top-24">
            <NotificationRightPanel
              notification={selectedNotification}
              typeDistribution={typeDistribution}
            />
          </div>
        </div>
      </div>

      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Delete Notification" size="md">
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Are you sure you want to delete "<span className="font-semibold text-white">{selected?.title}</span>"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={actionLoading}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
