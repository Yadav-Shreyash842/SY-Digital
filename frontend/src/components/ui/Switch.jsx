import { cn } from '../../utils/cn'

export default function Switch({ label, checked, onChange, className = '', theme = 'dark', id }) {
  const inputId = id || 'switch'

  return (
    <label htmlFor={inputId} className={cn('flex cursor-pointer items-center justify-between gap-4', className)}>
      {label && (
        <span className={cn('text-sm font-medium', theme === 'dark' ? 'text-text-secondary' : 'text-gray-700')}>
          {label}
        </span>
      )}
      <button
        id={inputId}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange?.(!checked)}
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-purple/30',
          checked ? 'bg-primary-purple' : 'bg-white/10',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-300',
            checked && 'translate-x-5',
          )}
        />
      </button>
    </label>
  )
}
