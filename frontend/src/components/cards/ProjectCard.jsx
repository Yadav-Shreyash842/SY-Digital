import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function ProjectCard({ title, category, slug, gradient, index = 0, className = '' }) {
  const href = slug ? `/portfolio/${slug}` : '#'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeInOut' }}
      className={cn('group relative overflow-hidden rounded-[24px] border border-white/8', className)}
    >
      <Link to={href} className="block">
        <div className={cn('aspect-[4/3] bg-gradient-to-br transition-transform duration-600 ease-in-out group-hover:scale-110', gradient)}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="absolute inset-0 grid-pattern opacity-30" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-bg via-primary-bg/40 to-transparent opacity-80 transition-opacity duration-400 group-hover:opacity-90" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className="mb-2 inline-block rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-xl">
            {category}
          </span>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{title}</h3>
            <ExternalLink strokeWidth={1.75} className="h-5 w-5 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
