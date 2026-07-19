import { cn } from '../../utils/cn'

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-[3px]',
  lg: 'h-12 w-12 border-4',
}

export default function Spinner({ size = 'md', className = '' }) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-white/20 border-t-white',
        sizes[size],
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  )
}
