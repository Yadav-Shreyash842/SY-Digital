import { cn } from '../../utils/cn'

export default function Radio({ label, className = '', theme = 'dark', id, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <label htmlFor={inputId} className={cn('flex cursor-pointer items-center gap-3', className)}>
      <input
        id={inputId}
        type="radio"
        className="h-5 w-5 border-white/20 bg-white/5 text-primary focus:ring-2 focus:ring-primary/30 focus:ring-offset-0"
        {...props}
      />
      {label && (
        <span className={cn('text-sm', theme === 'dark' ? 'text-text-secondary' : 'text-gray-600')}>
          {label}
        </span>
      )}
    </label>
  )
}
