import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionContainer from '../ui/SectionContainer'
import Skeleton from '../ui/Skeleton'
import { projectService } from '../../services/project.service'

const gradients = [
  'from-primary/80 to-primary/80',
  'from-accent-blue/80 to-accent-cyan/80',
  'from-accent-purple/80 to-accent-orange/80',
  'from-accent-cyan/80 to-accent-blue/80',
  'from-primary/80 to-accent-purple/80',
  'from-accent-orange/80 to-primary/80',
]

export default function Portfolio() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    projectService.featured()
      .then((res) => setProjects(res?.data || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <SectionContainer id="portfolio" className="bg-section-bg/50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="mb-16 text-center"
      >
        <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-accent-purple">
          Portfolio
        </span>
        <h2 className="mb-6 text-2xl font-bold sm:text-[32px] lg:text-[40px]">
          Featured <span className="text-gradient">Projects</span>
        </h2>
        <p className="mx-auto max-w-2xl text-base leading-[160%] text-text-secondary sm:text-lg">
          A curated selection of our finest work across industries and disciplines.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-[24px] border border-white/8">
              <Skeleton className="aspect-[4/3] rounded-none" />
              <div className="space-y-3 p-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-48" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? null : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Link
              key={project._id || project.slug}
              to={`/portfolio/${project.slug}`}
              className="group relative overflow-hidden rounded-[24px] border border-white/[0.06] bg-white/[0.02] transition-all duration-400 hover:border-accent-purple/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]"
            >
              {project.images?.[0]?.url ? (
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.images[0].url}
                    alt={project.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-600 ease-in-out group-hover:scale-110"
                  />
                </div>
              ) : (
                <div className={`aspect-[4/3] bg-gradient-to-br ${gradients[i % gradients.length]} transition-transform duration-600 ease-in-out group-hover:scale-110`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
                  <div className="absolute inset-0 grid-pattern opacity-30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-bg via-primary-bg/40 to-transparent opacity-80 transition-opacity duration-400 group-hover:opacity-90" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-block rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-xl">
                    {project.category}
                  </span>
                  <Star strokeWidth={1.75} className="h-4 w-4 text-accent-blue" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <ExternalLink
                    strokeWidth={1.75}
                    className="h-5 w-5 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </SectionContainer>
  )
}
