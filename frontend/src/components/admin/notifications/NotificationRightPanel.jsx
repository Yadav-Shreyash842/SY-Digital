import { motion } from 'framer-motion'
import { BarChart3, Calendar, DollarSign, Star, MessageSquare, User, Settings, Bell } from 'lucide-react'
import { cn } from '../../../utils/cn'
import Badge from '../../ui/Badge'

const typeBadgeVariant = {
  meeting: 'blue',
  payment: 'success',
  review: 'primary',
  message: 'default',
  user: 'blue',
  system: 'warning',
}

const typeIconMap = {
  meeting: Calendar,
  payment: DollarSign,
  review: Star,
  message: MessageSquare,
  user: User,
  system: Settings,
}

const typeBgMap = {
  meeting: 'bg-primary/15 text-primary',
  payment: 'bg-success/15 text-success',
  review: 'bg-primary/15 text-primary',
  message: 'bg-white/10 text-text-secondary',
  user: 'bg-primary/15 text-primary',
  system: 'bg-warning/15 text-warning',
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function NotificationRightPanel({ notification, typeDistribution }) {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
          Preview
        </p>
        <h3 className="text-lg font-bold text-white">
          {notification ? notification.title : 'Notification Overview'}
        </h3>
      </motion.div>

      {notification ? (
        <motion.div
          key={notification._id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden rounded-[20px] border border-white/10 bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl"
        >
          <div className="space-y-4 p-5">
            <div className="flex items-start gap-3">
              {(() => {
                const Icon = typeIconMap[notification.type] || Bell
                return (
                  <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', typeBgMap[notification.type] || 'bg-white/10 text-text-secondary')}>
                    <Icon strokeWidth={1.75} className="h-5 w-5" />
                  </div>
                )
              })()}
              <div className="min-w-0">
                <h4 className="text-base font-bold text-white">{notification.title}</h4>
                <p className="mt-1 text-xs text-text-muted">{formatDate(notification.createdAt)}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant={typeBadgeVariant[notification.type] || 'default'}>
                {notification.type?.charAt(0).toUpperCase() + notification.type?.slice(1)}
              </Badge>
              <Badge variant={notification.isRead ? 'success' : 'warning'}>
                {notification.isRead ? 'Read' : 'Unread'}
              </Badge>
            </div>

            <p className="text-sm leading-relaxed text-text-secondary">
              {notification.message}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="rounded-[20px] border border-white/10 bg-white/5 p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
            <BarChart3 strokeWidth={1.75} className="h-6 w-6 text-text-muted" />
          </div>
          <p className="text-sm text-text-muted">Select a notification from the list to preview its details.</p>
        </div>
      )}

      {typeDistribution && typeDistribution.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08, ease: 'easeInOut' }}
          className="rounded-[20px] border border-white/10 bg-white/5 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/20">
              <BarChart3 strokeWidth={1.75} className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm font-semibold text-white">Type Distribution</p>
          </div>
          <div className="space-y-2">
            {typeDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-2.5">
                <span className="text-sm text-text-secondary capitalize">{item.name}</span>
                <span className="text-sm font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
