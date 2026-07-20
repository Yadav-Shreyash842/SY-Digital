import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, ArrowUpRight } from 'lucide-react'
import LazyImage from '../ui/LazyImage'
import Badge from '../ui/Badge'
import { cn } from '../../utils/cn'

export default function BlogCard({ title, excerpt, category, date, slug, imageGradient, index = 0, className = '' }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeInOut' }}
      className={cn('group premium-card overflow-hidden', className)}
    >
      <Link to={`/blog/${slug}`}>
        <LazyImage gradient={imageGradient} alt={title} aspectRatio="16/9" className="rounded-none border-0" />
        <div className="p-6">
          <div className="mb-3 flex items-center justify-between">
            <Badge variant="purple">{category}</Badge>
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <Calendar strokeWidth={1.75} className="h-3.5 w-3.5" />
              {date}
            </span>
          </div>
          <h3 className="mb-2 text-lg font-bold transition-colors group-hover:text-primary">{title}</h3>
          <p className="mb-4 line-clamp-2 text-sm leading-[160%] text-text-secondary">{excerpt}</p>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2">
            Read more <ArrowUpRight strokeWidth={1.75} className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </motion.article>
  )
}
