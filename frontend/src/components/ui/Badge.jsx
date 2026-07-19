import { cn } from '../../utils/cn'

const variants = {
  default: 'bg-white/10 text-text-secondary border-white/10',
  purple: 'bg-primary-purple/20 text-primary-purple border-primary-purple/30',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  blue: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
}

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
