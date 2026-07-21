import { Search } from 'lucide-react'
import { cn } from '../../utils/cn'

const defaultCategories = [
  'All Projects',
  'Web Development',
  'Mobile Apps',
  'UI/UX Design',
  'Branding',
  'E-Commerce',
]

export default function PortfolioFilters({
  searchValue = '',
  onSearchChange,
  activeCategory = 'All Projects',
  onCategoryChange,
  categories = defaultCategories,
}) {
  return (
    <div className="space-y-6">
      <div className="relative w-full">
        <Search strokeWidth={1.75} className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Search projects by title, technology, or industry..."
          className="h-14 w-full rounded-input border border-border bg-input-bg pl-13 pr-5 text-base text-white placeholder:text-text-muted transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange?.(cat)}
            className={cn(
              'flex h-12 shrink-0 items-center rounded-full border px-5.5 text-sm font-semibold transition-all duration-200',
              activeCategory === cat
                ? 'border-primary bg-primary text-white shadow-[0_4px_14px_rgba(239,68,68,0.3)]'
                : 'border-border bg-card-bg/75 text-text-muted hover:border-white/15 hover:text-white',
            )}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}
