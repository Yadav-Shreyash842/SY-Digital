import { motion } from 'framer-motion'
import { Inbox, Check, Trash2, Calendar, DollarSign, Star, MessageSquare, User, Settings } from 'lucide-react'
import { cn } from '../../../utils/cn'
import Badge from '../../ui/Badge'
import Pagination from '../../ui/Pagination'
import Skeleton from '../../ui/Skeleton'

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

const typeBgMap = {
  meeting: 'bg-primary/15 text-primary',
  payment: 'bg-success/15 text-success',
  review: 'bg-primary/15 text-primary',
  message: 'bg-white/10 text-text-secondary',
  user: 'bg-primary/15 text-primary',
  system: 'bg-warning/15 text-warning',
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.max(0, now - then)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function NotificationDataTable({
  data,
  loading,
  selectedId,
  onSelect,
  onMarkRead,
  onDelete,
  pagination,
}) {
  if (loading) {
    return (
      <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="mb-2 h-4 w-1/3" />
                <Skeleton className="h-3 w-1/5" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[20px] border border-white/10 bg-white/5 px-6 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
          <Inbox strokeWidth={1.5} className="h-7 w-7 text-text-muted" />
        </div>
        <p className="text-lg font-semibold text-white">No notifications found</p>
        <p className="mt-1 text-sm text-text-muted">Try adjusting your search or filter criteria.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="overflow-hidden rounded-[20px] border border-white/10 bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {['Notification', 'Type', 'Status', 'Date', ''].map((h) => (
                  <th
                    key={h}
                    className={cn(
                      'px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-muted',
                      h === '' && 'w-24',
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((n, i) => {
                const isSelected = selectedId === n._id
                const Icon = typeIconMap[n.type] || Calendar

                return (
                  <motion.tr
                    key={n._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.03, ease: 'easeInOut' }}
                    onClick={() => onSelect?.(n)}
                    className={cn(
                      'cursor-pointer border-b border-white/5 transition-all duration-200 last:border-0',
                      isSelected ? 'bg-primary/10' : 'hover:bg-white/[0.04]',
                    )}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <div className={cn('mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', typeBgMap[n.type] || 'bg-white/10 text-text-secondary')}>
                          <Icon strokeWidth={1.75} className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className={cn('text-sm', n.isRead ? 'font-normal text-text-secondary' : 'font-semibold text-white')}>
                            {n.title}
                          </p>
                          <p className="truncate text-xs text-text-muted max-w-xs">{n.message}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={typeBadgeVariant[n.type] || 'default'}>
                        {n.type?.charAt(0).toUpperCase() + n.type?.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={n.isRead ? 'success' : 'warning'}>
                        {n.isRead ? 'Read' : 'Unread'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-text-muted">{timeAgo(n.createdAt)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {!n.isRead && (
                          <button
                            onClick={() => onMarkRead?.(n)}
                            className="rounded-lg p-2 text-text-muted hover:bg-primary/10 hover:text-primary transition-colors"
                            title="Mark as read"
                          >
                            <Check strokeWidth={1.75} className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onDelete?.(n)}
                          className="rounded-lg p-2 text-text-muted hover:bg-danger/10 hover:text-danger transition-colors"
                          title="Delete"
                        >
                          <Trash2 strokeWidth={1.75} className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && data.length > 0 && (
        <div className="mt-4">
          <Pagination {...pagination} theme="dark" />
        </div>
      )}
    </div>
  )
}
