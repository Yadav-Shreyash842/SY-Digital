import { cn } from '../../utils/cn'

export default function ProgressBar({ value = 0, max = 100, className = '', showLabel = false, variant = 'gradient' }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={className}>
      {showLabel && (
        <div className="mb-2 flex justify-between text-xs text-text-muted">
          <span>Progress</span>
          <span>{Math.round(percent)}%</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-600 ease-in-out',
            variant === 'gradient' ? 'bg-gradient-to-r from-primary-purple to-accent-blue' : 'bg-success',
          )}
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  )
}
