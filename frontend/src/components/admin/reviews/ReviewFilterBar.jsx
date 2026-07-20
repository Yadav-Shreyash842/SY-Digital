import { Search, RotateCcw } from 'lucide-react'
import Select from '../../ui/Select'
import { cn } from '../../../utils/cn'

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

const ratingOptions = [
  { value: '', label: 'All Ratings' },
  { value: '5', label: '5 Stars' },
  { value: '4', label: '4 Stars' },
  { value: '3', label: '3 Stars' },
  { value: '2', label: '2 Stars' },
  { value: '1', label: '1 Star' },
]

const featuredOptions = [
  { value: '', label: 'All' },
  { value: 'true', label: 'Featured' },
  { value: 'false', label: 'Not Featured' },
]

export default function ReviewFilterBar({
  search, onSearchChange,
  status, onStatusChange,
  rating, onRatingChange,
  featured, onFeaturedChange,
}) {
  const hasFilters = search || status || rating || featured

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-card border border-border bg-white/[0.03] p-4 backdrop-blur-xl">
      <div className="relative min-w-[220px] flex-1">
        <Search strokeWidth={1.75} className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search by client name, email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-11 w-full rounded-input border border-border bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <Select
        options={statusOptions}
        value={status}
        onChange={onStatusChange}
        className="!mb-0 min-w-[130px]"
        placeholder="Status"
        theme="dark"
      />

      <Select
        options={ratingOptions}
        value={rating}
        onChange={onRatingChange}
        className="!mb-0 min-w-[130px]"
        placeholder="Rating"
        theme="dark"
      />

      <Select
        options={featuredOptions}
        value={featured}
        onChange={onFeaturedChange}
        className="!mb-0 min-w-[130px]"
        placeholder="Featured"
        theme="dark"
      />

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            onSearchChange('')
            onStatusChange('')
            onRatingChange('')
            onFeaturedChange('')
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
