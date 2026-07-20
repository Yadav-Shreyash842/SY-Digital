import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'
import Button from '../ui/Button'
import { cn } from '../../utils/cn'

export default function ErrorState({ title = 'Something went wrong', description, onRetry, theme = 'light', className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className={cn(
        'flex flex-col items-center justify-center rounded-card border px-6 py-16 text-center',
        theme === 'dark' ? 'border-danger/20 bg-danger/5' : 'border-red-200 bg-red-50',
        className,
      )}
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-btn bg-danger/10">
        <AlertCircle strokeWidth={1.75} className="h-8 w-8 text-danger" />
      </div>
      <h3 className={cn('mb-2 text-lg font-bold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>{title}</h3>
      <p className={cn('mb-6 max-w-sm text-sm', theme === 'dark' ? 'text-text-secondary' : 'text-gray-600')}>
        {description || 'We encountered an unexpected error. Please try again.'}
      </p>
      {onRetry && (
        <Button variant={theme === 'dark' ? 'secondary' : 'lightOutline'} onClick={onRetry}>
          <RefreshCw strokeWidth={1.75} className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </motion.div>
  )
}
