import { Search } from 'lucide-react'
import Input from './Input'
import Pagination from './Pagination'
import EmptyState from '../feedback/EmptyState'
import { Inbox } from 'lucide-react'
import { cn } from '../../utils/cn'
import { SkeletonTable } from './Skeleton'

export default function Table({
  columns = [],
  data = [],
  theme = 'light',
  searchable = false,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  pagination,
  emptyTitle = 'No data found',
  emptyDescription = 'There are no records to display.',
  loading = false,
  className = '',
}) {
  if (loading) {
    return <SkeletonTable rows={6} theme={theme} />
  }

  return (
    <div className={cn('space-y-4', className)}>
      {searchable && (
        <div className="relative max-w-sm">
          <Search strokeWidth={1.75} className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
          <Input
            theme={theme}
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            inputClassName="pl-11"
            className="mb-0"
          />
        </div>
      )}

      {data.length === 0 ? (
        <EmptyState icon={Inbox} title={emptyTitle} description={emptyDescription} theme={theme} />
      ) : (
        <div className={cn('overflow-hidden rounded-card border shadow-sm', theme === 'dark' ? 'border-border bg-card-bg' : 'border-gray-200 bg-white')}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={cn('sticky top-0 z-10', theme === 'dark' ? 'bg-card-bg' : 'bg-gray-50')}>
                <tr className={cn('border-b', theme === 'dark' ? 'border-divider' : 'border-gray-100')}>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={cn(
                        'px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider',
                        theme === 'dark' ? 'text-text-muted' : 'text-gray-500',
                      )}
                      style={{ width: col.width }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr
                    key={row._id || row.id || i}
                    className={cn(
                      'border-b transition-colors',
                      theme === 'dark' ? 'border-divider hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/80',
                    )}
                    style={{ height: '60px' }}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={cn('px-6 py-4 text-sm', theme === 'dark' ? 'text-text-secondary' : 'text-gray-600')}>
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pagination && data.length > 0 && (
        <Pagination {...pagination} theme={theme} />
      )}
    </div>
  )
}
