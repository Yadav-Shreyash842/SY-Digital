import { motion } from 'framer-motion'
import { Star, Inbox } from 'lucide-react'
import { cn } from '../../../utils/cn'
import Badge from '../../ui/Badge'
import Pagination from '../../ui/Pagination'
import Skeleton from '../../ui/Skeleton'
import ServiceActionsDropdown from './ServiceActionsDropdown'

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

function StatusDot({ status }) {
  const colors = {
    published: 'bg-success',
    draft: 'bg-warning',
    archived: 'bg-text-muted',
  }
  return (
    <div className="flex items-center gap-2">
      <span className={cn('h-2 w-2 rounded-full', colors[status] || 'bg-text-muted')} />
      <span className="text-sm capitalize text-text-secondary">{status}</span>
    </div>
  )
}

export default function ServiceDataTable({
  data,
  loading,
  selectedId,
  onSelect,
  onView,
  onEdit,
  onDuplicate,
  onToggleStatus,
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
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-16" />
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
        <p className="text-lg font-semibold text-white">No services found</p>
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
                {['Service', 'Category', 'Price', 'Status', 'Rating', 'Bookings', 'Updated', ''].map((h) => (
                  <th
                    key={h}
                    className={cn(
                      'px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-muted',
                      h === '' && 'w-12',
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((service, i) => {
                const isSelected = selectedId === service._id

                return (
                  <motion.tr
                    key={service._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.03, ease: 'easeInOut' }}
                    onClick={() => onSelect?.(service)}
                    className={cn(
                      'cursor-pointer border-b border-white/5 transition-all duration-200 last:border-0',
                      isSelected
                        ? 'bg-primary/10'
                        : 'hover:bg-white/[0.04]',
                    )}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {service.image?.url ? (
                          <img
                            src={service.image.url}
                            alt={service.title}
                            className="h-10 w-10 flex-shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/20 text-sm font-bold text-primary">
                            {service.title?.charAt(0) || 'S'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {service.title}
                          </p>
                          {service.shortDescription && (
                            <p className="truncate text-xs text-text-muted">
                              {service.shortDescription}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="primary">{service.category}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-semibold text-white">
                        {service.discountPrice > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <span>₹{service.discountPrice.toLocaleString()}</span>
                            <span className="text-xs text-text-muted line-through">
                              ₹{service.price.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span>₹{service.price.toLocaleString()}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusDot status={service.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Star
                          strokeWidth={1.75}
                          className={cn(
                            'h-3.5 w-3.5',
                            service.rating > 0 ? 'fill-warning text-warning' : 'text-text-muted',
                          )}
                        />
                        <span className="text-sm text-text-secondary">
                          {service.rating > 0 ? service.rating.toFixed(1) : '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-text-secondary">{service.bookings || 0}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-text-muted">{timeAgo(service.updatedAt)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div onClick={(e) => e.stopPropagation()}>
                        <ServiceActionsDropdown
                          service={service}
                          onView={onView}
                          onEdit={onEdit}
                          onDuplicate={onDuplicate}
                          onToggleStatus={onToggleStatus}
                          onDelete={onDelete}
                        />
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
