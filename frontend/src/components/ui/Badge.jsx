import { cn } from '../../utils/cn'

const variants = {
  default: 'bg-white/10 text-text-secondary border-white/10',
  primary: 'bg-primary/15 text-primary border-primary/25',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  info: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
  gray: 'bg-white/5 text-text-muted border-white/8',
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
