import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export default function StatsCard({ icon: Icon, label, value, change, positive = true, color, theme = 'dark', index = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeInOut' }}
      className={cn(
        'rounded-card border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md',
        theme === 'dark' ? 'border-border bg-card-bg' : 'border-gray-200 bg-white',
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        {Icon && (
          <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br', color)}>
            <Icon strokeWidth={1.75} className="h-5 w-5 text-white" />
          </div>
        )}
        {change && (
          <span className={cn('text-xs font-semibold', positive ? 'text-success' : 'text-danger')}>
            {change}
          </span>
        )}
      </div>
      <p className={cn('text-sm', theme === 'dark' ? 'text-text-muted' : 'text-gray-500')}>{label}</p>
      <p className={cn('mt-1 text-2xl font-bold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>{value}</p>
    </motion.div>
  )
}
