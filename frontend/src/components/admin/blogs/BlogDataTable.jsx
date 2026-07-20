import { motion } from 'framer-motion'
import { Star, Inbox } from 'lucide-react'
import { cn } from '../../../utils/cn'
import Badge from '../../ui/Badge'
import Pagination from '../../ui/Pagination'
import Skeleton from '../../ui/Skeleton'
import BlogActionsDropdown from './BlogActionsDropdown'

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

const categoryBadgeVariant = {
  technology: 'blue',
  business: 'primary',
  design: 'pink',
  marketing: 'green',
  general: 'gray',
}

export default function BlogDataTable({
  data,
  loading,
  selectedId,
  onSelect,
  onView,
  onEdit,
  onToggleFeatured,
  onDelete,
  pagination,
}) {
  if (loading) {
    return (
      <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-14 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="mb-2 h-4 w-1/3" />
                <Skeleton className="h-3 w-1/5" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-12" />
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
        <p className="text-lg font-semibold text-white">No blogs found</p>
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
                {['Blog', 'Category', 'Author', 'Status', 'Views', 'Featured', 'Updated', ''].map((h) => (
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
              {data.map((blog, i) => {
                const isSelected = selectedId === blog._id

                return (
                  <motion.tr
                    key={blog._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.03, ease: 'easeInOut' }}
                    onClick={() => onSelect?.(blog)}
                    className={cn(
                      'cursor-pointer border-b border-white/5 transition-all duration-200 last:border-0',
                      isSelected
                        ? 'bg-primary/10'
                        : 'hover:bg-white/[0.04]',
                    )}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {blog.featuredImage?.url ? (
                          <img
                            src={blog.featuredImage.url}
                            alt={blog.title}
                            className="h-10 w-16 flex-shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/20 text-sm font-bold text-primary">
                            {blog.title?.charAt(0) || 'B'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {blog.title}
                          </p>
                          {blog.shortDescription && (
                            <p className="truncate text-xs text-text-muted">
                              {blog.shortDescription}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={categoryBadgeVariant[blog.category] || 'gray'}>
                        {blog.category?.charAt(0).toUpperCase() + blog.category?.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-text-secondary">{blog.author || '-'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusDot status={blog.status} />
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-text-secondary">{(blog.views || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      {blog.isFeatured ? (
                        <Star strokeWidth={1.75} className="h-4 w-4 fill-warning text-warning" />
                      ) : (
                        <span className="text-sm text-text-muted">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-text-muted">{timeAgo(blog.updatedAt)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div onClick={(e) => e.stopPropagation()}>
                        <BlogActionsDropdown
                          blog={blog}
                          onView={onView}
                          onEdit={onEdit}
                          onToggleFeatured={onToggleFeatured}
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
