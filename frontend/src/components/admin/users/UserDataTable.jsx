import { motion } from 'framer-motion'
import { Inbox } from 'lucide-react'
import { cn } from '../../../utils/cn'
import Badge from '../../ui/Badge'
import Avatar from '../../ui/Avatar'
import Pagination from '../../ui/Pagination'
import Skeleton from '../../ui/Skeleton'
import UserActionsDropdown from './UserActionsDropdown'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function UserDataTable({
  data,
  loading,
  selectedId,
  onSelect,
  onView,
  onEdit,
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
        <p className="text-lg font-semibold text-white">No users found</p>
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
                {['User', 'Role', 'Status', 'Joined', ''].map((h) => (
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
              {data.map((user, i) => {
                const isSelected = selectedId === user._id

                return (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.03, ease: 'easeInOut' }}
                    onClick={() => onSelect?.(user)}
                    className={cn(
                      'cursor-pointer border-b border-white/5 transition-all duration-200 last:border-0',
                      isSelected ? 'bg-primary/10' : 'hover:bg-white/[0.04]',
                    )}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={`${user.firstName} ${user.lastName}`} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="truncate text-xs text-text-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={user.role === 'admin' ? 'primary' : 'blue'}>
                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={user.isVerified ? 'success' : 'warning'}>
                        {user.isVerified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-text-muted">{formatDate(user.createdAt)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div onClick={(e) => e.stopPropagation()}>
                        <UserActionsDropdown
                          user={user}
                          onView={onView}
                          onEdit={onEdit}
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
