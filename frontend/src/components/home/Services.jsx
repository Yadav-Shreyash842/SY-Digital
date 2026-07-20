import { motion } from 'framer-motion'
import { Code2, Palette, Megaphone, ArrowUpRight } from 'lucide-react'
import SectionContainer from '../ui/SectionContainer'

const services = [
  {
    icon: Code2,
    title: 'Web Development',
    description: 'Scalable, performant web applications built with cutting-edge technologies and best practices.',
    tags: ['React', 'Node.js', 'Next.js'],
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'Beautiful, intuitive interfaces that delight users and drive conversions across every touchpoint.',
    tags: ['Figma', 'Prototyping', 'Design Systems'],
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing',
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
        <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">
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
            className="group premium-card p-8"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/20 transition-all duration-400 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              <service.icon strokeWidth={1.75} className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-bold">{service.title}</h3>
            <p className="mb-6 text-base leading-[160%] text-text-secondary">{service.description}</p>
            <div className="mb-6 flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2"
            >
              Learn more
              <ArrowUpRight strokeWidth={1.75} className="h-4 w-4" />
            </a>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  )
}
