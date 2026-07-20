import { Search, RotateCcw } from 'lucide-react'
import Select from '../../ui/Select'

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'payment', label: 'Payment' },
  { value: 'review', label: 'Review' },
  { value: 'message', label: 'Message' },
  { value: 'user', label: 'User' },
  { value: 'system', label: 'System' },
]

const readOptions = [
  { value: '', label: 'All Status' },
  { value: 'false', label: 'Unread' },
  { value: 'true', label: 'Read' },
]

export default function NotificationFilterBar({
  search, onSearchChange,
  type, onTypeChange,
  readStatus, onReadStatusChange,
}) {
  const hasFilters = search || type || readStatus

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-card border border-border bg-white/[0.03] p-4 backdrop-blur-xl">
      <div className="relative min-w-[220px] flex-1">
        <Search strokeWidth={1.75} className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search notifications..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-11 w-full rounded-input border border-border bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <Select
        options={typeOptions}
        value={type}
        onChange={onTypeChange}
        className="!mb-0 min-w-[150px]"
        placeholder="Type"
        theme="dark"
      />

      <Select
        options={readOptions}
        value={readStatus}
        onChange={onReadStatusChange}
        className="!mb-0 min-w-[140px]"
        placeholder="Status"
        theme="dark"
      />

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            onSearchChange('')
            onTypeChange('')
            onReadStatusChange('')
          }}
          className="inline-flex items-center gap-2 rounded-btn border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-white/20 hover:text-white"
        >
          <RotateCcw strokeWidth={1.75} className="h-3.5 w-3.5" />
          Reset
        </button>
      )}
    </div>
  )
}
