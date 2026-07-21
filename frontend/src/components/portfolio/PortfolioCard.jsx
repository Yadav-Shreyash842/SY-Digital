import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

function formatYear(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).getFullYear().toString()
}

export default function PortfolioCard({ project, index = 0 }) {
  const hasImage = project.images?.[0]?.url
  const hasLiveUrl = project.liveUrl && project.liveUrl.trim()

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeInOut' }}
      className="group flex flex-col overflow-hidden rounded-[24px] border border-white/8 bg-card-bg/75 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(239,68,68,0.1)]"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#12141d]">
        {hasImage ? (
          <img
            src={project.images[0].url}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/80 to-primary/40">
            <span className="text-4xl font-black text-white/20">SY</span>
          </div>
        )}
        <span className="absolute right-4 top-4 rounded-full border border-white/10 bg-[rgba(15,17,23,0.85)] px-3.5 py-1.5 text-xs font-semibold text-primary backdrop-blur-md">
          {project.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center justify-between text-xs text-text-muted">
          <span>{project.clientName || 'Confidential'}</span>
          <span>{formatYear(project.completionDate)}</span>
        </div>

        <h3 className="mb-2 text-xl font-bold text-white">{project.title}</h3>
        <p className="mb-5 text-sm leading-relaxed text-text-muted line-clamp-2">{project.shortDescription}</p>

        {/* Tech chips */}
        {project.technologies?.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-white/8 bg-input-bg px-2.5 py-1 text-[11px] font-semibold text-gray-300"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="rounded-lg border border-white/8 bg-input-bg px-2.5 py-1 text-[11px] font-semibold text-text-muted">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto grid grid-cols-2 gap-3">
          <Link
            to={`/portfolio/${project.slug}`}
            className="flex h-11 items-center justify-center gap-1.5 rounded-[12px] bg-primary text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-primary-hover"
          >
            Case Study
          </Link>
          {hasLiveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center justify-center gap-1.5 rounded-[12px] border border-border bg-input-bg text-[13px] font-semibold text-white transition-all duration-200 hover:border-white/15 hover:bg-white/[0.08]"
            >
              Live Site
              <ExternalLink strokeWidth={1.75} className="h-3.5 w-3.5" />
            </a>
          ) : (
            <div className="flex h-11 items-center justify-center gap-1.5 rounded-[12px] border border-border bg-input-bg text-[13px] font-semibold text-text-disabled">
              Coming Soon
            </div>
          )}
        </div>
      </div>
    </motion.article>
  )
}
