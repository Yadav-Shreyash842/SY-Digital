import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowUpRight, ExternalLink, ArrowLeft, Layers, Target, Lightbulb,
  Rocket, ChevronRight, ChevronLeft, CheckCircle2, X, GitBranch,
  ImageIcon,
} from 'lucide-react'
import PageHero from '../../components/layout/PageHero'
import SectionContainer from '../../components/ui/SectionContainer'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
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

const featureCards = [
  { icon: '🔒', name: 'JWT Authentication', desc: 'Secure token-based authentication system' },
  { icon: '👤', name: 'Visitor Registration', desc: 'Easy self-registration for visitors' },
  { icon: '📱', name: 'QR Code Pass', desc: 'Digital passes with unique QR codes' },
  { icon: '🔍', name: 'QR Scanner', desc: 'Real-time QR code scanning and validation' },
  { icon: '📊', name: 'Dashboard Analytics', desc: 'Comprehensive visitor analytics dashboard' },
  { icon: '📋', name: 'Visitor Logs', desc: 'Detailed visitor entry and exit logs' },
  { icon: '👥', name: 'Role Based Access', desc: 'Granular role and permission control' },
  { icon: '📱', name: 'Responsive Design', desc: 'Fully responsive across all devices' },
]

const mockStats = [
  { label: 'Today', value: '847' },
  { label: 'Active', value: '128' },
  { label: 'Pending', value: '43' },
  { label: 'Avg Time', value: '12m' },
]

const mockVisitors = ['John Doe', 'Jane Smith', 'Mike Johnson']

export default function ProjectDetailsPage() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
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

  const galleryImages = project?.images?.slice(1) || []
  const heroImage = project?.images?.[0]?.url || null

  const openLightbox = useCallback((index) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const goToPrev = useCallback(() => {
    setLightboxIndex((i) => (i > 0 ? i - 1 : galleryImages.length - 1))
  }, [galleryImages.length])

  const goToNext = useCallback(() => {
    setLightboxIndex((i) => (i < galleryImages.length - 1 ? i + 1 : 0))
  }, [galleryImages.length])

  useEffect(() => {
    if (!lightboxOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goToPrev()
      if (e.key === 'ArrowRight') goToNext()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [lightboxOpen, closeLightbox, goToPrev, goToNext])

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
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden pt-16 md:pt-20 lg:pt-[120px] pb-12 md:pb-16 lg:pb-20">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-accent-purple/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-accent-purple/10 blur-[120px]" />

        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1200px]">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] items-center">
              {/* Left column */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <nav className="mb-6 flex items-center gap-2 text-sm text-text-muted">
                  <Link to="/" className="transition-colors hover:text-white">Home</Link>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <Link to="/portfolio" className="transition-colors hover:text-white">Portfolio</Link>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="text-white/60">{project.title}</span>
                </nav>

                <Badge variant="primary" className="mb-5">{project.category}</Badge>

                <h1 className="mb-5 text-4xl font-bold sm:text-5xl lg:text-6xl leading-tight">
                  {project.title}
                </h1>

                <p className="mb-8 max-w-xl text-lg leading-relaxed text-text-secondary">
                  {project.shortDescription}
                </p>

                {project.technologies?.length > 0 && (
                  <div className="mb-8 grid grid-cols-2 gap-3">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <div key={tech} className="flex items-center gap-2 text-sm text-text-secondary">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-purple" />
                        {tech}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-4">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="primary" size="lg">
                        Live Demo
                        <ExternalLink strokeWidth={1.75} className="h-5 w-5" />
                      </Button>
                    </a>
                  )}
                  {project.sourceUrl && (
                    <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="lg">
                        Source Code
                        <GitBranch strokeWidth={1.75} className="h-5 w-5" />
                      </Button>
                    </a>
                  )}
                </div>
              </motion.div>

              {/* Right column — browser mockup */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="relative"
              >
                <div className="overflow-hidden rounded-2xl border border-accent-purple/30 bg-card-bg shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
                  <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-4 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                  </div>
                  {heroImage ? (
                    <img
                      src={heroImage}
                      alt={project.title}
                      className="w-full object-cover"
                      style={{ aspectRatio: '16/10' }}
                    />
                  ) : (
                    <div className="grid min-h-[320px] grid-cols-[140px_1fr]">
                      <div className="space-y-1 border-r border-white/[0.06] bg-white/[0.02] p-3">
                        {['Dashboard', 'Visitors', 'Passes', 'QR Scanner'].map((item) => (
                          <div
                            key={item}
                            className="cursor-default rounded-lg px-3 py-2 text-xs font-medium text-text-muted transition-colors hover:bg-white/[0.04] hover:text-white"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3 p-4">
                        <div className="grid grid-cols-4 gap-2">
                          {mockStats.map((s) => (
                            <div
                              key={s.label}
                              className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2.5 text-center"
                            >
                              <div className="text-sm font-bold text-white">{s.value}</div>
                              <div className="text-[10px] text-text-muted">{s.label}</div>
                            </div>
                          ))}
                        </div>
                        <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-4">
                          <div className="flex h-24 items-end justify-between gap-2">
                            {[65, 40, 80, 55, 90, 70, 45, 75].map((h, i) => (
                              <div
                                key={i}
                                className="flex-1 rounded-t-md bg-gradient-to-t from-accent-purple/40 to-accent-purple/20"
                                style={{ height: `${h}%` }}
                              />
                            ))}
                          </div>
                          <div className="mt-2 flex justify-between text-[10px] text-text-muted">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span>
                            <span>Fri</span><span>Sat</span><span>Sun</span>
                          </div>
                        </div>
                        <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3">
                          <div className="space-y-2">
                            {mockVisitors.map((name) => (
                              <div key={name} className="flex items-center gap-2 text-xs text-text-muted">
                                <div className="h-5 w-5 rounded-full bg-accent-purple/20" />
                                <span className="flex-1">{name}</span>
                                <span className="text-[10px] text-accent-green">Checked In</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <SectionContainer>
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          {/* ===== LEFT COLUMN ===== */}
          <div className="space-y-12">
            {/* Overview */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-[24px] border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-xl md:p-10"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                  <Layers strokeWidth={1.75} className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Project Overview</h2>
              </div>
              <p className="text-base leading-[180%] text-text-secondary">{project.description}</p>
            </motion.div>

            {/* Challenge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-[24px] border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-xl md:p-10"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-orange/15">
                  <Target strokeWidth={1.75} className="h-5 w-5 text-accent-orange" />
                </div>
                <h2 className="text-2xl font-bold">The Challenge</h2>
              </div>
              <p className="text-base leading-[180%] text-text-secondary">
                {project.shortDescription} This project required a meticulous approach to balance innovation with reliability,
                ensuring the solution could scale effectively while maintaining peak performance under demanding conditions.
              </p>
            </motion.div>

            {/* Solution */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-green/15">
                  <Lightbulb strokeWidth={1.75} className="h-5 w-5 text-accent-green" />
                </div>
                <h2 className="text-2xl font-bold">The Solution</h2>
              </div>
              <p className="mb-10 text-base leading-[180%] text-text-secondary">
                Our team delivered a tailored, high-performance solution leveraging the latest technologies and
                industry best practices. Through close collaboration with the client, we ensured every feature aligned
                with their strategic goals and user expectations.
              </p>

              {/* Key Features — 2×4 grid */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {featureCards.map((f) => (
                  <motion.div
                    key={f.name}
                    whileHover={{ y: -4 }}
                    className="cursor-default rounded-[16px] border border-white/[0.06] bg-card-bg p-5 transition-colors hover:border-accent-purple/30"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-purple/10 text-lg">
                      {f.icon}
                    </div>
                    <h3 className="mb-1 text-sm font-bold">{f.name}</h3>
                    <p className="text-xs leading-relaxed text-text-secondary">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Technology Stack */}
            {project.technologies?.length > 0 && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-blue/15">
                    <Rocket strokeWidth={1.75} className="h-5 w-5 text-accent-blue" />
                  </div>
                  <h2 className="text-2xl font-bold">Technology Stack</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech) => (
                    <motion.span
                      key={tech}
                      whileHover={{ y: -2 }}
                      className="cursor-default rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-gray-300 backdrop-blur-xl transition-colors hover:border-accent-purple/30"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h2 className="mb-6 text-2xl font-bold">Gallery</h2>
                <div className="relative">
                  <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
                    {galleryImages.map((img, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => openLightbox(i)}
                        className="snap-start shrink-0 overflow-hidden rounded-[16px] border border-white/10 transition-colors hover:border-accent-purple/30 focus:outline-none"
                        style={{ height: 200, width: 320 }}
                      >
                        <img
                          src={img.url}
                          alt={`${project.title} screenshot ${i + 1}`}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </motion.button>
                    ))}
                  </div>
                  {/* Scroll hint arrows */}
                  {galleryImages.length > 3 && (
                    <>
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-bg via-primary-bg/80 to-transparent pr-6 pointer-events-none">
                        <ChevronLeft className="h-6 w-6 text-text-muted" />
                      </div>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-primary-bg via-primary-bg/80 to-transparent pl-6 pointer-events-none">
                        <ChevronRight className="h-6 w-6 text-text-muted" />
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* ===== SIDEBAR ===== */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-[24px] border border-accent-purple/20 bg-white/[0.02] p-7 backdrop-blur-xl shadow-[0_10px_30px_rgba(139,92,246,0.1)]">
              <div>
                <p className="text-sm text-text-muted">Client</p>
                <p className="mt-1 font-semibold">{project.clientName || 'Confidential'}</p>
              </div>
              <div className="mt-5">
                <p className="text-sm text-text-muted">Category</p>
                <div className="mt-1.5">
                  <Badge variant="primary">{project.category}</Badge>
                </div>
              </div>
              <div className="mt-5">
                <p className="text-sm text-text-muted">Year</p>
                <p className="mt-1 font-semibold">{formatYear(project.completionDate) || 'N/A'}</p>
              </div>
              {project.liveUrl && (
                <div className="mt-5">
                  <p className="text-sm text-text-muted">Live Site</p>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1.5 font-semibold text-accent-purple transition-colors hover:text-accent-orange"
                  >
                    Visit Site
                    <ExternalLink strokeWidth={1.75} className="h-4 w-4" />
                  </a>
                </div>
              )}
              <hr className="my-5 border-white/8" />
              <Button variant="primary" className="w-full" onClick={open}>
                Start Similar Project
                <ArrowUpRight strokeWidth={1.75} className="h-5 w-5" />
              </Button>
              <Link
                to="/portfolio"
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-[16px] border border-white/20 bg-white/[0.04] text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.08]"
              >
                <ArrowLeft strokeWidth={1.75} className="h-4 w-4" />
                Back to Portfolio
              </Link>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 pb-16 md:pb-20 lg:pb-[120px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[24px] border border-accent-purple/20 p-8 sm:p-12 lg:p-16 shadow-[0_20px_50px_rgba(99,102,241,0.3)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/30 via-primary-bg to-accent-orange/20" />
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-accent-purple/20 blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent-orange/20 blur-[80px]" />

          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold sm:text-[32px] lg:text-[40px]">
                Like What You See?
              </h2>
              <p className="mt-3 text-base leading-[160%] text-white/80 sm:text-lg">
                Ready to build something amazing? Let&apos;s turn your vision into a premium digital experience.
              </p>
            </div>
            <Button
              variant="secondary"
              className="!bg-white !text-primary !border-white shrink-0 hover:!bg-white/90"
              onClick={open}
            >
              Start Your Project
              <ArrowUpRight strokeWidth={1.75} className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ===== LIGHTBOX ===== */}
      {lightboxOpen && galleryImages.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl">
          <button
            onClick={closeLightbox}
            className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-xl transition-colors hover:bg-white/20"
          >
            <X strokeWidth={2} className="h-5 w-5" />
          </button>

          {galleryImages.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-xl transition-colors hover:bg-white/20"
              >
                <ChevronLeft strokeWidth={2} className="h-6 w-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-xl transition-colors hover:bg-white/20"
              >
                <ChevronRight strokeWidth={2} className="h-6 w-6" />
              </button>
            </>
          )}

          <motion.img
            key={lightboxIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            src={galleryImages[lightboxIndex]?.url}
            alt={`${project.title} screenshot ${lightboxIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain"
          />

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-sm text-white/80 backdrop-blur-xl">
            {lightboxIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}

      <ProjectRequestOverlay isOpen={isOpen} onClose={close} />
    </>
  )
}
