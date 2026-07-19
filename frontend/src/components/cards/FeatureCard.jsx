import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export default function FeatureCard({ icon: Icon, title, description, index = 0, theme = 'dark', className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeInOut' }}
      className={cn(
        'rounded-[24px] border p-8',
        theme === 'dark' ? 'border-white/8 bg-card-bg' : 'border-gray-200 bg-white',
        className,
      )}
    >
      {Icon && (
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-purple/15">
          <Icon strokeWidth={1.75} className="h-6 w-6 text-primary-purple" />
        </div>
      )}
      <h3 className={cn('mb-2 text-lg font-bold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>{title}</h3>
      <p className={cn('text-base leading-[160%]', theme === 'dark' ? 'text-text-secondary' : 'text-gray-600')}>
        {description}
      </p>
    </motion.div>
  )
}
