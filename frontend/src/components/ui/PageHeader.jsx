import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export default function PageHeader({ title, description, action, breadcrumbs, theme = 'light', className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className={cn('mb-8', className)}
    >
      {breadcrumbs}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={cn('text-2xl font-bold sm:text-3xl', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {title}
          </h1>
          {description && (
            <p className={cn('mt-1 text-base', theme === 'dark' ? 'text-text-secondary' : 'text-gray-500')}>
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </motion.div>
  )
}
