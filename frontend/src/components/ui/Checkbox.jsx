import { cn } from '../../utils/cn'

export default function Checkbox({ label, className = '', theme = 'dark', id, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <label htmlFor={inputId} className={cn('flex cursor-pointer items-center gap-3', className)}>
      <input
        id={inputId}
        type="checkbox"
        className="h-5 w-5 rounded-md border-white/20 bg-white/5 text-primary-purple focus:ring-2 focus:ring-primary-purple/30 focus:ring-offset-0"
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
