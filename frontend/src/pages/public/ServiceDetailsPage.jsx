import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, MessageSquare } from 'lucide-react'
import SectionContainer from '../../components/ui/SectionContainer'
import Button from '../../components/ui/Button'
import Accordion from '../../components/ui/Accordion'
import Skeleton from '../../components/ui/Skeleton'
import ProjectRequestOverlay from '../../components/forms/ProjectRequestOverlay'
import { useDisclosure } from '../../hooks/useDisclosure'
import { serviceService } from '../../services/service.service'
import serviceDetails from '../../data/serviceDetails'
import NotFoundPage from './NotFoundPage'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
}

function SectionHeader({ tag, title }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="mb-12 text-center"
    >
      <span className="mb-3 inline-block text-sm font-bold uppercase tracking-[1.5px] text-primary">{tag}</span>
      <h2 className="text-[26px] font-extrabold leading-tight tracking-tight sm:text-[32px] lg:text-[38px]">{title}</h2>
    </motion.div>
  )
}

export default function ServiceDetailsPage() {
  const { slug } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isOpen, open, close } = useDisclosure()

  const content = serviceDetails[slug]

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await serviceService.get(slug)
        setService(res?.data || null)
      } catch (err) {
        if (err?.response?.status === 404) {
          setService(null)
        } else if (err?.response?.status === 401 || err?.response?.status === 403) {
          setService(null)
        } else {
          setError(err?.response?.data?.message || 'Failed to load service details.')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchService()
  }, [slug])

  if (loading) {
    return (
      <>
        <section className="relative overflow-hidden border-b border-border pt-28 pb-16 md:pt-32 md:pb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent-blue/5 to-transparent opacity-80" />
          <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1200px]">
              <Skeleton className="mb-4 h-4 w-32" />
              <Skeleton className="mb-6 h-12 w-96" />
              <Skeleton className="h-5 w-[500px] max-w-full" />
            </div>
          </div>
        </section>
        <SectionContainer>
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </SectionContainer>
      </>
    )
  }

  if (error) {
    return (
      <SectionContainer>
        <p className="py-12 text-center text-text-secondary">{error}</p>
      </SectionContainer>
    )
  }

  if (!service && !content) return <NotFoundPage />

  const title = content?.heroTitle || service?.title || slug
  const description = content?.heroDescription || service?.shortDescription || ''
  const overview = content?.overview || service?.description || ''
  const offerings = content?.offerings || []
  const techStack = content?.techStack || service?.technologies || []
  const process = content?.process || []
  const testimonials = content?.testimonials || []
  const faqs = content?.faqs || []

  return (
    <>
      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden border-b border-border pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent-blue/5 to-transparent opacity-80" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-primary/15 blur-[100px]" />

        <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <div className="mb-6">
                <Link to="/services" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-white">
                  ← Back to Services
                </Link>
              </div>
              <h1 className="mb-5 text-[36px] font-extrabold leading-[1.15] tracking-tight sm:text-[44px] lg:text-[52px]">
                {title.split(' ').map((word, i) => {
                  const highlightWords = ['Web', 'UI/UX', 'Digital', 'Development', 'Design', 'Marketing']
                  return highlightWords.includes(word) ? (
                    <span key={i} className="text-primary">{word} </span>
                  ) : (
                    <span key={i}>{word} </span>
                  )
                })}
              </h1>
              <p className="mb-8 max-w-xl text-base leading-[160%] text-text-secondary sm:text-lg">{description}</p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button variant="primary" className="w-full sm:w-auto" onClick={open}>
                  Start Your Project
                  <ArrowUpRight strokeWidth={1.75} className="h-5 w-5" />
                </Button>
                <Link to="/contact">
                  <Button variant="secondary" className="w-full sm:w-auto">
                    Talk to an Expert
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeInOut' }}
              className="hidden lg:block"
            >
              <div
                className="flex h-[380px] items-center justify-center rounded-[24px] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(23,31,46,0.8) 100%)' }}
              >
                <div className="w-[80%] rounded-2xl border border-white/10 bg-[#0f1117] p-5 font-mono text-sm leading-relaxed text-primary shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <span className="text-text-muted">&lt;</span>
                  <span className="text-accent-cyan">SYDigital</span>
                  <span className="text-text-muted">&gt;</span>
                  <br />
                  <span className="text-text-muted">&nbsp;&nbsp;&lt;</span>
                  <span className="text-accent-cyan">Service</span>
                  <span className="text-text-muted"> name=</span>
                  <span className="text-accent-green">&quot;{slug}&quot;</span>
                  <span className="text-text-muted">&gt;</span>
                  <br />
                  <span className="text-text-muted">&nbsp;&nbsp;&nbsp;&nbsp;&lt;</span>
                  <span className="text-accent-cyan">Performance</span>
                  <span className="text-text-muted"> level=</span>
                  <span className="text-accent-green">&quot;100%&quot;</span>
                  <span className="text-text-muted"> /&gt;</span>
                  <br />
                  <span className="text-text-muted">&nbsp;&nbsp;&nbsp;&nbsp;&lt;</span>
                  <span className="text-accent-cyan">Scale</span>
                  <span className="text-text-muted"> enterprise=</span>
                  <span className="text-primary">{'{true}'}</span>
                  <span className="text-text-muted"> /&gt;</span>
                  <br />
                  <span className="text-text-muted">&nbsp;&nbsp;&lt;/</span>
                  <span className="text-accent-cyan">Service</span>
                  <span className="text-text-muted">&gt;</span>
                  <br />
                  <span className="text-text-muted">&lt;/</span>
                  <span className="text-accent-cyan">SYDigital</span>
                  <span className="text-text-muted">&gt;</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: OVERVIEW */}
      <SectionContainer>
        <SectionHeader tag="Overview" title="Built for Performance and Scale" />
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-[1200px] rounded-[24px] border border-white/8 bg-card-bg/75 p-8 backdrop-blur-xl sm:p-12"
        >
          <p className="text-base leading-[180%] text-gray-300 sm:text-lg">{overview}</p>
        </motion.div>
      </SectionContainer>

      {/* SECTION 3: WHAT WE OFFER */}
      {offerings.length > 0 && (
        <SectionContainer className="!pt-0">
          <SectionHeader tag="What We Offer" title="Tailored Solutions" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {offerings.map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group rounded-[24px] border border-white/8 bg-card-bg/75 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/12 transition-all duration-300 group-hover:shadow-[0_0_24px_rgba(239,68,68,0.25)]">
                  <item.icon strokeWidth={1.75} className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-text-muted">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </SectionContainer>
      )}

      {/* SECTION 4: TECH STACK */}
      {techStack.length > 0 && (
        <SectionContainer className="!pt-0">
          <SectionHeader tag="Tech Stack" title="Technologies We Master" />
          <div className="mx-auto grid max-w-[900px] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {techStack.map((tech) => (
              <motion.div
                key={tech}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-center justify-center rounded-[18px] border border-white/8 bg-card-bg/75 p-5 text-center text-sm font-bold backdrop-blur-xl transition-all duration-200 hover:border-primary hover:scale-105"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </SectionContainer>
      )}

      {/* SECTION 5: PROCESS */}
      {process.length > 0 && (
        <SectionContainer className="!pt-0">
          <SectionHeader tag="Development Process" title="Our Proven Execution Framework" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {process.map((step) => (
              <motion.div
                key={step.number}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-[24px] border border-white/8 bg-card-bg/75 p-7 backdrop-blur-xl"
              >
                <div className="mb-3 text-[36px] font-black text-primary/25">{step.number}</div>
                <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
                <p className="text-[13px] leading-relaxed text-text-muted">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </SectionContainer>
      )}

      {/* SECTION 6: TESTIMONIALS */}
      {testimonials.length > 0 && (
        <SectionContainer className="!pt-0">
          <SectionHeader tag="Testimonials" title="What Our Clients Say" />
          <div className="mx-auto grid max-w-[900px] gap-6 sm:grid-cols-2">
            {testimonials.map((t) => (
              <motion.div
                key={t.client}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-[24px] border border-white/8 bg-card-bg/75 p-8 backdrop-blur-xl"
              >
                <p className="mb-5 text-sm leading-relaxed text-gray-300 italic">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-bold">{t.client}</p>
                  <p className="text-xs text-text-muted">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionContainer>
      )}

      {/* SECTION 7: FAQS */}
      {faqs.length > 0 && (
        <SectionContainer className="!pt-0">
          <SectionHeader tag="FAQs" title="Frequently Asked Questions" />
          <div className="mx-auto max-w-[800px]">
            <Accordion
              items={faqs.map((f) => ({ question: f.question, answer: f.answer }))}
            />
          </div>
        </SectionContainer>
      )}

      {/* SECTION 8: FINAL CTA */}
      <SectionContainer className="!pt-0">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-[1200px] overflow-hidden rounded-[32px] border border-white/10 p-8 sm:p-12 lg:p-16"
          style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(23,31,46,0.9) 100%)' }}
        >
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-[26px] font-extrabold sm:text-[32px] lg:text-[36px]">Ready to Build?</h2>
            <p className="max-w-lg text-base leading-relaxed text-text-muted">
              Let&apos;s discuss your project requirements and build something extraordinary together.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button variant="primary" className="w-full sm:w-auto" onClick={open}>
                Start Your Project
                <ArrowUpRight strokeWidth={1.75} className="h-5 w-5" />
              </Button>
              <Link to="/contact">
                <Button variant="secondary" className="w-full sm:w-auto">
                  <MessageSquare strokeWidth={1.75} className="h-4 w-4" />
                  Talk to an Expert
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </SectionContainer>

      <ProjectRequestOverlay isOpen={isOpen} onClose={close} />
    </>
  )
}
