import { cn } from '../../utils/cn'

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

export default function Avatar({ src, name, size = 'md', className = '' }) {
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={cn('rounded-xl object-cover', sizes[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-orange font-bold text-white',
        sizes[size],
        className,
      )}
      aria-label={name}
    >
      {initials || '?'}
    </div>
  )
}
