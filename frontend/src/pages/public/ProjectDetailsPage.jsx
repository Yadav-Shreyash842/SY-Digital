import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, ExternalLink, ArrowLeft, Layers, Target, Lightbulb, Rocket } from 'lucide-react'
import PageHero from '../../components/layout/PageHero'
import SectionContainer from '../../components/ui/SectionContainer'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import CTA from '../../components/home/CTA'
import NotFoundPage from './NotFoundPage'
import ProjectRequestOverlay from '../../components/forms/ProjectRequestOverlay'
import { useDisclosure } from '../../hooks/useDisclosure'
import { projectService } from '../../services/project.service'

function formatYear(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).getFullYear().toString()
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
}

export default function ProjectDetailsPage() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isOpen, open, close } = useDisclosure()

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await projectService.getBySlug(slug)
        setProject(res?.data || null)
      } catch (err) {
        if (err?.response?.status === 404) {
          setProject(null)
        } else {
          setError(err?.response?.data?.message || 'Failed to load project details.')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [slug])

  if (loading) {
    return (
      <>
        <PageHero
          title="Loading..."
          subtitle=""
          breadcrumbs={[{ label: 'Portfolio', href: '/portfolio' }, { label: '...' }]}
        />
        <SectionContainer>
          <Skeleton className="mb-12 aspect-[21/9] w-full rounded-2xl" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-4 rounded-[24px] border border-white/8 bg-card-bg p-6">
              <div><Skeleton className="mb-1 h-4 w-16" /><Skeleton className="h-5 w-32" /></div>
              <div><Skeleton className="mb-1 h-4 w-16" /><Skeleton className="h-6 w-24 rounded-full" /></div>
              <div><Skeleton className="mb-1 h-4 w-16" /><Skeleton className="h-5 w-16" /></div>
              <Skeleton className="h-12 w-full rounded-btn" />
            </div>
          </div>
        </SectionContainer>
        <CTA />
      </>
    )
  }

  if (error) {
    return (
      <>
        <PageHero title="Error" subtitle="" breadcrumbs={[{ label: 'Portfolio', href: '/portfolio' }]} />
        <SectionContainer>
          <p className="py-12 text-center text-text-secondary">{error}</p>
        </SectionContainer>
      </>
    )
  }

  if (!project) return <NotFoundPage />

  return (
    <>
      <PageHero
        title={project.title}
        subtitle={project.shortDescription}
        breadcrumbs={[{ label: 'Portfolio', href: '/portfolio' }, { label: project.title }]}
      />

      <SectionContainer>
        {/* Hero image */}
        {project.images?.[0]?.url ? (
          <motion.img
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            src={project.images[0].url}
            alt={project.title}
            className="mb-12 w-full rounded-2xl object-cover"
            style={{ aspectRatio: '21/9' }}
          />
        ) : (
          <div className="mb-12 flex aspect-[21/9] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-primary/60 to-primary/20">
            <span className="text-6xl font-black text-white/10">SY</span>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                  <Layers strokeWidth={1.75} className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Project Overview</h2>
              </div>
              <p className="text-base leading-[170%] text-text-secondary">{project.description}</p>
            </motion.div>

            {/* The Challenge */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-orange/15">
                  <Target strokeWidth={1.75} className="h-5 w-5 text-accent-orange" />
                </div>
                <h2 className="text-2xl font-bold">The Challenge</h2>
              </div>
              <p className="text-base leading-[170%] text-text-secondary">
                {project.shortDescription} This project required a meticulous approach to balance innovation with reliability,
                ensuring the solution could scale effectively while maintaining peak performance under demanding conditions.
              </p>
            </motion.div>

            {/* The Solution */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-green/15">
                  <Lightbulb strokeWidth={1.75} className="h-5 w-5 text-accent-green" />
                </div>
                <h2 className="text-2xl font-bold">The Solution</h2>
              </div>
              <p className="text-base leading-[170%] text-text-secondary">
                Our team delivered a tailored, high-performance solution leveraging the latest technologies and
                industry best practices. Through close collaboration with the client, we ensured every feature aligned
                with their strategic goals and user expectations.
              </p>
            </motion.div>

            {/* Technology Stack */}
            {project.technologies?.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-blue/15">
                    <Rocket strokeWidth={1.75} className="h-5 w-5 text-accent-blue" />
                  </div>
                  <h2 className="text-2xl font-bold">Technology Stack</h2>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-xl border border-white/8 bg-input-bg px-4 py-2 text-sm font-semibold text-gray-300 transition-colors duration-200 hover:border-white/15"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Gallery */}
            {project.images?.length > 1 && (
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <h2 className="mb-6 text-2xl font-bold">Gallery</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {project.images.slice(1).map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      alt={`${project.title} screenshot ${i + 1}`}
                      loading="lazy"
                      className="w-full rounded-xl border border-white/8 object-cover"
                      style={{ aspectRatio: '16/10' }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-5 rounded-[24px] border border-white/8 bg-card-bg p-6">
              <div>
                <p className="text-sm text-text-muted">Client</p>
                <p className="mt-1 font-semibold">{project.clientName || 'Confidential'}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Category</p>
                <div className="mt-1.5">
                  <Badge variant="primary">{project.category}</Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-text-muted">Year</p>
                <p className="mt-1 font-semibold">{formatYear(project.completionDate) || 'N/A'}</p>
              </div>
              {project.liveUrl && (
                <div>
                  <p className="text-sm text-text-muted">Live Site</p>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1.5 font-semibold text-primary transition-colors hover:text-primary-hover"
                  >
                    Visit Site
                    <ExternalLink strokeWidth={1.75} className="h-4 w-4" />
                  </a>
                </div>
              )}
              <hr className="border-white/8" />
              <Button variant="primary" className="w-full" onClick={open}>
                Start Similar Project
                <ArrowUpRight strokeWidth={1.75} className="h-5 w-5" />
              </Button>
              <Link
                to="/portfolio"
                className="flex h-12 items-center justify-center gap-2 rounded-btn border border-border bg-white/[0.03] text-sm font-semibold text-white transition-all duration-300 hover:bg-white/[0.06]"
              >
                <ArrowLeft strokeWidth={1.75} className="h-4 w-4" />
                Back to Portfolio
              </Link>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 pb-16 md:pb-20 lg:pb-[120px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[24px] border border-white/10 p-8 sm:p-12 lg:p-16"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-accent-blue opacity-90" />
          <div className="absolute inset-0 grid-pattern opacity-20" />
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent-cyan/20 blur-[80px]" />

          <div className="relative text-center">
            <h2 className="mb-4 text-2xl font-bold sm:text-[32px] lg:text-[40px]">
              Like What You See?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-base leading-[160%] text-white/80 sm:text-lg">
              Ready to build something amazing? Let's turn your vision into a premium digital experience.
            </p>
            <Button
              variant="secondary"
              className="!bg-white !text-primary !border-white hover:!bg-white/90"
              onClick={open}
            >
              Start Your Project
              <ArrowUpRight strokeWidth={1.75} className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </section>

      <ProjectRequestOverlay isOpen={isOpen} onClose={close} />
    </>
  )
}
