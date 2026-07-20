import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

const Input = forwardRef(function Input({
  label,
  error,
  hint,
  className = '',
  inputClassName = '',
  theme = 'dark',
  id,
  ...props
}, ref) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  const baseInput = cn(
    'h-12 w-full rounded-input border px-4 text-base transition-all duration-300 focus:outline-none focus:ring-2',
    theme === 'dark'
      ? 'border-border bg-white/5 text-white placeholder:text-text-placeholder focus:border-primary focus:ring-primary/20'
      : 'border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary/20',
    error && 'border-danger focus:border-danger focus:ring-danger/20',
    inputClassName,
  )

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label htmlFor={inputId} className={cn('block text-sm font-medium', theme === 'dark' ? 'text-text-secondary' : 'text-gray-700')}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={baseInput}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      {hint && !error && <p className="text-sm text-text-muted">{hint}</p>}
    </div>
  )
})

export default Input
