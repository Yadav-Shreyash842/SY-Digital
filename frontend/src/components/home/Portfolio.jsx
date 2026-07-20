import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import SectionContainer from '../ui/SectionContainer'

const projects = [
  {
    title: 'FinFlow Dashboard',
    category: 'Web App',
    gradient: 'from-primary/80 to-primary/80',
  },
  {
    title: 'Luxe Commerce',
    category: 'E-Commerce',
    gradient: 'from-accent-blue/80 to-accent-cyan/80',
  },
  {
    title: 'Nova Brand Identity',
    category: 'Branding',
    gradient: 'from-primary/80 to-primary/80',
  },
  {
    title: 'Pulse Analytics',
    category: 'SaaS Platform',
    gradient: 'from-accent-cyan/80 to-accent-blue/80',
  },
  {
    title: 'Elevate Mobile',
    category: 'Mobile App',
    gradient: 'from-primary/80 to-primary/80',
  },
  {
    title: 'Vertex Marketing',
    category: 'Campaign',
    gradient: 'from-primary/80 to-primary/80',
  },
]

export default function Portfolio() {
  return (
    <SectionContainer id="portfolio" className="bg-section-bg/50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="mb-16 text-center"
      >
        <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">
          Portfolio
        </span>
        <h2 className="mb-6 text-2xl font-bold sm:text-[32px] lg:text-[40px]">
          Featured <span className="text-gradient">Projects</span>
        </h2>
        <p className="mx-auto max-w-2xl text-base leading-[160%] text-text-secondary sm:text-lg">
          A curated selection of our finest work across industries and disciplines.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <motion.a
            key={project.title}
            href="#"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeInOut' }}
            className="group relative overflow-hidden rounded-[24px] border border-white/8"
          >
            <div className={`aspect-[4/3] bg-gradient-to-br ${project.gradient} transition-transform duration-600 ease-in-out group-hover:scale-110`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
              <div className="absolute inset-0 grid-pattern opacity-30" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary-bg via-primary-bg/40 to-transparent opacity-80 transition-opacity duration-400 group-hover:opacity-90" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="mb-2 inline-block rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-xl">
                {project.category}
              </span>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <ExternalLink
                  strokeWidth={1.75}
                  className="h-5 w-5 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </SectionContainer>
  )
}
