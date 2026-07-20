import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Award, Rocket, Globe2, HeartHandshake } from 'lucide-react'
import SectionContainer from '../ui/SectionContainer'

function Counter({ value, suffix = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)
  const numericValue = parseInt(value.replace(/\D/g, ''), 10)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 2000
    const step = numericValue / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= numericValue) {
        setCount(numericValue)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, numericValue])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

const stats = [
  { icon: Award, value: '250', suffix: '+', label: 'Projects Completed' },
  { icon: Rocket, value: '98', suffix: '%', label: 'Success Rate' },
  { icon: Globe2, value: '40', suffix: '+', label: 'Countries Served' },
  { icon: HeartHandshake, value: '500', suffix: '+', label: 'Happy Clients' },
]

export default function Statistics() {
  return (
    <SectionContainer id="statistics">
      <div className="relative overflow-hidden rounded-[24px] border border-white/8 bg-gradient-to-br from-section-bg to-secondary-bg p-8 sm:p-12 lg:p-16">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-accent-blue/10 blur-[80px]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="relative mb-12 text-center"
        >
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">
            By The Numbers
          </span>
          <h2 className="text-2xl font-bold sm:text-[32px] lg:text-[40px]">
            Results That <span className="text-gradient">Speak Volumes</span>
          </h2>
        </motion.div>

        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeInOut' }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <stat.icon strokeWidth={1.75} className="h-7 w-7 text-primary" />
              </div>
              <div className="mb-2 text-4xl font-extrabold text-white lg:text-5xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-text-secondary">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionContainer>
  )
}
