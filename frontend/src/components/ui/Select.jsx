import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function Select({
  label,
  error,
  options = [],
  className = '',
  theme = 'dark',
  id,
  placeholder = 'Select an option',
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label htmlFor={inputId} className={cn('block text-sm font-medium', theme === 'dark' ? 'text-text-secondary' : 'text-gray-700')}>
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={inputId}
          className={cn(
            'h-12 w-full appearance-none rounded-input border px-4 pr-10 text-base transition-all duration-300 focus:outline-none focus:ring-2',
            theme === 'dark'
              ? 'border-border bg-white/5 text-white focus:border-primary focus:ring-primary/20'
              : 'border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-primary/20',
            error && 'border-danger',
          )}
          aria-invalid={!!error}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown strokeWidth={1.75} className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
      </div>
      {error && <p className="text-sm text-danger" role="alert">{error}</p>}
    </div>
  )
}
