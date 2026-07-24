import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Code2, Palette, Megaphone, ArrowUpRight } from 'lucide-react'
import SectionContainer from '../ui/SectionContainer'

const services = [
  {
    icon: Code2,
    title: 'Web Development',
    slug: 'web-development',
    description: 'Scalable, performant web applications built with cutting-edge technologies and best practices.',
    tags: ['React', 'Node.js', 'Next.js'],
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    slug: 'ui-ux-design',
    description: 'Beautiful, intuitive interfaces that delight users and drive conversions across every touchpoint.',
    tags: ['Figma', 'Prototyping', 'Design Systems'],
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing',
    slug: 'digital-marketing',
    description: 'Data-driven strategies that amplify your brand and accelerate growth across all channels.',
    tags: ['SEO', 'Analytics', 'Campaigns'],
  },
]

export default function Services() {
  return (
    <SectionContainer id="services">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="mb-16 text-center"
      >
        <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-accent-purple">
          Our Services
        </span>
        <h2 className="mb-6 text-2xl font-bold sm:text-[32px] lg:text-[40px]">
          Everything You Need to{' '}
          <span className="text-gradient">Scale Your Brand</span>
        </h2>
        <p className="mx-auto max-w-2xl text-base leading-[160%] text-text-secondary sm:text-lg">
          End-to-end digital solutions crafted with precision, delivered with excellence.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {services.map((service, i) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeInOut' }}
            className="group bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-[24px] p-8 transition-all duration-400 hover:border-accent-purple/40 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] hover:scale-[1.02]"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-purple/20 to-accent-orange/20 transition-all duration-400 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]">
              <service.icon strokeWidth={1.75} className="h-7 w-7 text-accent-purple" />
            </div>
            <h3 className="mb-3 text-xl font-bold">{service.title}</h3>
            <p className="mb-6 text-base leading-[160%] text-text-secondary">{service.description}</p>
            <div className="mb-6 flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm px-3 py-1 text-xs font-medium text-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              to={`/services/${service.slug}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-accent-purple transition-all duration-300 group-hover:gap-3"
            >
              Learn more
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowUpRight strokeWidth={1.75} className="h-4 w-4" />
              </motion.span>
            </Link>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  )
}
