import { motion } from 'framer-motion'
import Button from '../ui/Button'
import { cn } from '../../utils/cn'

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  theme = 'light',
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className={cn(
        'flex flex-col items-center justify-center rounded-[20px] border px-6 py-16 text-center',
        theme === 'dark' ? 'border-white/8 bg-card-bg' : 'border-gray-200 bg-white',
        className,
      )}
    >
      {Icon && (
        <div className={cn(
          'mb-6 flex h-16 w-16 items-center justify-center rounded-2xl',
          theme === 'dark' ? 'bg-white/5' : 'bg-gray-100',
        )}>
          <Icon strokeWidth={1.75} className={cn('h-8 w-8', theme === 'dark' ? 'text-text-muted' : 'text-gray-400')} />
        </div>
      )}
      <h3 className={cn('mb-2 text-lg font-bold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>{title}</h3>
      <p className={cn('mb-6 max-w-sm text-sm leading-[160%]', theme === 'dark' ? 'text-text-secondary' : 'text-gray-500')}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant={theme === 'dark' ? 'primary' : 'light'} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}
