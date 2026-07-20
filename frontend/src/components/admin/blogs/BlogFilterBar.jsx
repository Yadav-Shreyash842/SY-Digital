import { Search, RotateCcw } from 'lucide-react'
import Select from '../../ui/Select'
import { cn } from '../../../utils/cn'

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'technology', label: 'Technology' },
  { value: 'business', label: 'Business' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'general', label: 'General' },
]

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'views', label: 'Most Views' },
  { value: 'readTime', label: 'Read Time' },
  { value: 'title', label: 'Title A-Z' },
  { value: 'published', label: 'Recently Published' },
  { value: 'updated', label: 'Recently Updated' },
]

export default function BlogFilterBar({
  search, onSearchChange,
  category, onCategoryChange,
  status, onStatusChange,
  sort, onSortChange,
}) {
  const hasFilters = search || category || status

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-card border border-border bg-white/[0.03] p-4 backdrop-blur-xl">
      <div className="relative min-w-[220px] flex-1">
        <Search strokeWidth={1.75} className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-11 w-full rounded-input border border-border bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <Select
        options={categoryOptions}
        value={category}
        onChange={onCategoryChange}
        className="!mb-0 min-w-[150px]"
        placeholder="Category"
        theme="dark"
      />

      <Select
        options={statusOptions}
        value={status}
        onChange={onStatusChange}
        className="!mb-0 min-w-[130px]"
        placeholder="Status"
        theme="dark"
      />

      <Select
        options={sortOptions}
        value={sort}
        onChange={onSortChange}
        className="!mb-0 min-w-[150px]"
        placeholder="Sort"
        theme="dark"
      />

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            onSearchChange('')
            onCategoryChange('')
            onStatusChange('')
            onSortChange('newest')
          }}
          className={cn(
            'inline-flex items-center gap-2 rounded-btn border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-white/20 hover:text-white',
          )}
        >
          <RotateCcw strokeWidth={1.75} className="h-3.5 w-3.5" />
          Reset
        </button>
      )}
    </div>
  )
}
