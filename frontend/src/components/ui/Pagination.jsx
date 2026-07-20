import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function Pagination({ currentPage = 1, totalPages = 1, onPageChange, theme = 'light', className = '' }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-center gap-2', className)}>
      <button
        type="button"
        onClick={() => onPageChange?.(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-xl border transition-colors disabled:opacity-40',
          theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50',
        )}
        aria-label="Previous page"
      >
        <ChevronLeft strokeWidth={1.75} className="h-5 w-5" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange?.(page)}
          aria-current={page === currentPage ? 'page' : undefined}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition-colors',
            page === currentPage
              ? 'bg-primary text-white shadow-sm'
              : theme === 'dark'
                ? 'text-text-secondary hover:bg-white/5'
                : 'text-gray-600 hover:bg-gray-100',
          )}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange?.(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-xl border transition-colors disabled:opacity-40',
          theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50',
        )}
        aria-label="Next page"
      >
        <ChevronRight strokeWidth={1.75} className="h-5 w-5" />
      </button>
    </nav>
  )
}
