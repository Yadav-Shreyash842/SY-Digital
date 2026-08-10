import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, CheckCheck, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useSocket from '../../hooks/useSocket'
import clientService from '../../services/client.service'

const timeAgo = (iso) => {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function ClientNotificationBell() {
  const { connect } = useSocket()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const [items, setItems] = useState([])
  const [marking, setMarking] = useState(false)
  const boxRef = useRef(null)

  const refreshStats = useCallback(async () => {
    try {
      const res = await clientService.notificationStats()
      setUnread(res?.data?.unreadNotifications || 0)
    } catch {
      setUnread(0)
    }
  }, [])

  const refreshList = useCallback(async () => {
    try {
      const res = await clientService.notifications({ page: 1, limit: 10 })
      setItems(res?.data?.notifications || [])
    } catch {
      setItems([])
    }
  }, [])

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      refreshStats()
      refreshList()
    })

    const socket = connect()
    if (!socket) return

    const onNew = (data) => {
      if (data?.notification) {
        setItems((prev) => [
          data.notification,
          ...prev.filter((n) => n._id !== data.notification._id),
        ].slice(0, 10))
        setUnread((u) => u + 1)
      } else {
        refreshStats()
        refreshList()
      }
    }
    const onAllRead = () => setUnread(0)
    const onDeleted = () => { refreshStats(); refreshList() }

    socket.on('newNotification', onNew)
    socket.on('allNotificationsRead', onAllRead)
    socket.on('notificationDeleted', onDeleted)

    return () => {
      cancelAnimationFrame(raf)
      socket.off('newNotification', onNew)
      socket.off('allNotificationsRead', onAllRead)
      socket.off('notificationDeleted', onDeleted)
    }
  }, [connect, refreshStats, refreshList])

  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    const handleKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const handleMarkAll = async () => {
    if (unread === 0) return
    setMarking(true)
    try {
      await clientService.markAllNotificationsRead()
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnread(0)
      toast.success('All notifications marked as read')
    } catch {
      toast.error('Failed to mark notifications as read')
    } finally {
      setMarking(false)
    }
  }

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ''}`}
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex h-12 w-12 items-center justify-center rounded-btn border border-border bg-white/5 text-white transition hover:bg-white/10"
      >
        <Bell strokeWidth={1.75} className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-warning px-1 text-[10px] font-bold leading-none text-primary-bg ring-2 ring-primary-bg">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-14 z-50 w-[360px] max-w-[90vw] overflow-hidden rounded-xl border border-border bg-sidebar-bg shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-sm font-semibold text-white">Notifications</p>
              <button
                type="button"
                onClick={handleMarkAll}
                disabled={marking || unread === 0}
                className="flex items-center gap-1 text-xs font-medium text-accent-blue transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <CheckCheck strokeWidth={2} className="h-3.5 w-3.5" />
                Mark all read
              </button>
            </div>

            <div className="max-h-[360px] overflow-y-auto">
              {items.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-text-muted">No notifications yet.</p>
              ) : (
                items.map((n) => (
                  <div
                    key={n._id}
                    className={`flex items-start gap-3 border-b border-border/60 px-4 py-3 transition hover:bg-white/5 ${
                      n.isRead ? 'opacity-60' : ''
                    }`}
                  >
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.isRead ? 'bg-text-muted/40' : 'bg-accent-blue'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{n.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-text-secondary">{n.message}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-wide text-text-muted">{timeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={() => { setOpen(false); navigate('/client') }}
              className="flex w-full items-center justify-center gap-1.5 border-t border-border px-4 py-3 text-sm font-medium text-accent-cyan transition hover:bg-white/5"
            >
              <ExternalLink strokeWidth={1.75} className="h-4 w-4" />
              View all notifications
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
