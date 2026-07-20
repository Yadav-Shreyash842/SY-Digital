import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function ServiceCard({ icon: Icon, title, description, tags = [], href = '#', index = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeInOut' }}
      className={cn('group premium-card p-8', className)}
    >
      {Icon && (
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/20 transition-all duration-400 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]">
          <Icon strokeWidth={1.75} className="h-7 w-7 text-primary" />
        </div>
      )}
      <h3 className="mb-3 text-xl font-bold">{title}</h3>
      <p className="mb-6 text-base leading-[160%] text-text-secondary">{description}</p>
      {tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-text-secondary">
              {tag}
            </span>
          ))}
        </div>
      )}
      <a href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2">
        Learn more <ArrowUpRight strokeWidth={1.75} className="h-4 w-4" />
      </a>
    </motion.div>
  )
}
