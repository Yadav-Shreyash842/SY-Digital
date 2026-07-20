import { motion } from 'framer-motion'
import Breadcrumb from '../ui/Breadcrumb'
import { cn } from '../../utils/cn'

export default function PageHero({ title, subtitle, breadcrumbs = [], children, className = '' }) {
  return (
    <section className={cn('relative overflow-hidden border-b border-border pt-28 pb-16 md:pt-32 md:pb-20', className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent-blue/5 to-transparent opacity-80" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-primary/15 blur-[100px]" />

      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          {breadcrumbs.length > 0 && (
            <div className="mb-6">
              <Breadcrumb items={breadcrumbs} />
            </div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <h1 className="text-[32px] font-extrabold leading-tight sm:text-[40px] lg:text-[48px]">{title}</h1>
            {subtitle && (
              <p className="mt-4 max-w-2xl text-base leading-[160%] text-text-secondary sm:text-lg">{subtitle}</p>
            )}
            {children && <div className="mt-8">{children}</div>}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
