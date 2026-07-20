import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '../../utils/cn'

const config = {
  info: { icon: Info, className: 'border-accent-blue/30 bg-accent-blue/10 text-accent-blue' },
  success: { icon: CheckCircle2, className: 'border-success/30 bg-success/10 text-success' },
  warning: { icon: AlertTriangle, className: 'border-warning/30 bg-warning/10 text-warning' },
  error: { icon: AlertCircle, className: 'border-danger/30 bg-danger/10 text-danger' },
}

export default function Alert({ type = 'info', title, children, onClose, className = '' }) {
  const { icon: Icon, className: typeClass } = config[type]

  return (
    <div className={cn('flex gap-3 rounded-card border p-4', typeClass, className)} role="alert">
      <Icon strokeWidth={1.75} className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="flex-1">
        {title && <p className="mb-1 font-semibold">{title}</p>}
        {children && <div className="text-sm opacity-90">{children}</div>}
      </div>
      {onClose && (
        <button type="button" onClick={onClose} className="shrink-0 opacity-70 hover:opacity-100" aria-label="Dismiss">
          <X strokeWidth={1.75} className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
