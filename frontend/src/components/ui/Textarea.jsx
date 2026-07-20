import { cn } from '../../utils/cn'

export default function Textarea({
  label,
  error,
  hint,
  className = '',
  theme = 'dark',
  id,
  rows = 4,
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
      <textarea
        id={inputId}
        rows={rows}
        className={cn(
          'w-full resize-none rounded-input border px-4 py-3 text-base transition-all duration-300 focus:outline-none focus:ring-2',
          theme === 'dark'
            ? 'border-border bg-white/5 text-white placeholder:text-text-placeholder focus:border-primary focus:ring-primary/20'
            : 'border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary/20',
          error && 'border-danger',
        )}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="text-sm text-danger" role="alert">{error}</p>}
      {hint && !error && <p className="text-sm text-text-muted">{hint}</p>}
    </div>
  )
}
