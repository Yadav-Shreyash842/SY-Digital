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
      <div className="relative overflow-hidden rounded-[24px] border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-8 sm:p-12 lg:p-16">
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-accent-purple/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-accent-orange/8 blur-[100px]" />

        <div className="light-streak top-[20%] left-0" />
        <div className="light-streak top-[70%] right-0" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="relative mb-14 text-center"
        >
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-accent-purple">
            By The Numbers
          </span>
          <h2 className="text-2xl font-bold sm:text-[32px] lg:text-[40px]">
            Results That <span className="text-gradient">Speak Volumes</span>
          </h2>
        </motion.div>

        <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeInOut' }}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-[24px] p-6 text-center transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-accent-purple/30"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent-purple/20 to-accent-orange/20 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                <stat.icon strokeWidth={1.75} className="h-7 w-7 text-accent-purple" />
              </div>
              <div className="mb-1 text-4xl font-extrabold text-white lg:text-5xl">
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
