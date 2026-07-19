import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import Avatar from '../ui/Avatar'
import { cn } from '../../utils/cn'

export default function ReviewCard({ name, role, content, rating = 5, index = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeInOut' }}
      className={cn('glass-card rounded-[24px] p-8', className)}
    >
      <Quote strokeWidth={1.75} className="mb-4 h-8 w-8 text-primary-purple/50" />
      <p className="mb-6 text-base leading-[160%] text-text-secondary">{content}</p>
      <div className="mb-4 flex gap-1">
        {Array.from({ length: rating }).map((_, j) => (
          <Star key={j} strokeWidth={1.75} className="h-4 w-4 fill-warning text-warning" />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Avatar name={name} size="md" />
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-text-muted">{role}</p>
        </div>
      </div>
    </motion.div>
  )
}
