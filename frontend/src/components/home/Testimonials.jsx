import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import SectionContainer from '../ui/SectionContainer'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CEO, TechVentures',
    content: 'SY Digital transformed our entire digital presence. Their attention to detail and strategic approach exceeded every expectation.',
    rating: 5,
  },
  {
    name: 'Marcus Williams',
    role: 'Founder, Elevate Labs',
    content: 'Working with SY Digital felt like having an elite in-house team. Premium quality, seamless communication, outstanding results.',
    rating: 5,
  },
  {
    name: 'Elena Rodriguez',
    role: 'CMO, Nova Brands',
    content: 'The dashboard they built for us is world-class. Our client satisfaction scores jumped 40% within the first quarter.',
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <SectionContainer id="testimonials">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="mb-16 text-center"
      >
        <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary-purple">
          Testimonials
        </span>
        <h2 className="mb-6 text-[28px] font-bold sm:text-[32px] lg:text-[40px]">
          What Our <span className="text-gradient">Clients Say</span>
        </h2>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeInOut' }}
            className="glass-card rounded-[24px] p-8"
          >
            <Quote strokeWidth={1.75} className="mb-4 h-8 w-8 text-primary-purple/50" />
            <p className="mb-6 text-base leading-[160%] text-text-secondary">{item.content}</p>
            <div className="mb-4 flex gap-1">
              {Array.from({ length: item.rating }).map((_, j) => (
                <Star key={j} strokeWidth={1.75} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary-purple to-accent-blue text-sm font-bold">
                {item.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-text-muted">{item.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  )
}
