import { motion } from 'framer-motion'

const stats = [
  { value: '250+', label: 'Projects Delivered' },
  { value: '120+', label: 'Happy Clients' },
  { value: '15+', label: 'Industries Served' },
  { value: '98%', label: 'Satisfaction' },
]

export default function PortfolioHero() {
  return (
    <section className="relative overflow-hidden border-b border-border pt-28 pb-16 md:pt-32 md:pb-20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent-blue/5 to-transparent opacity-80" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-primary/15 blur-[100px]" />

      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <h1 className="mb-5 text-[36px] font-extrabold leading-[1.15] tracking-tight sm:text-[44px] lg:text-[52px]">
              Explore Our{' '}
              <span className="bg-gradient-to-r from-primary to-accent-cyan bg-clip-text text-transparent">
                Featured Work
              </span>
            </h1>
            <p className="mb-10 max-w-xl text-base leading-[160%] text-text-secondary sm:text-lg">
              We help brands transform ideas into premium digital products through strategy, design, and high-performance engineering.
            </p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
                  className="rounded-[18px] border border-white/8 bg-card-bg/75 p-5 backdrop-blur-xl transition-colors duration-200 hover:border-white/15"
                >
                  <div className="text-2xl font-extrabold text-white sm:text-3xl">{stat.value}</div>
                  <div className="mt-1 text-xs text-text-muted sm:text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeInOut' }}
            className="hidden items-center justify-center lg:flex"
          >
            <div
              className="relative h-[280px] w-[280px] rounded-[36px] border border-white/10 shadow-[0_25px_50px_rgba(0,0,0,0.5),0_0_40px_rgba(239,68,68,0.15)]"
              style={{
                background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(23,31,46,0.8) 100%)',
              }}
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="flex h-full flex-col items-center justify-center"
              >
                <span
                  className="text-[72px] font-black leading-none tracking-tighter text-primary"
                  style={{ textShadow: '0 0 30px rgba(239,68,68,0.5)' }}
                >
                  SY
                </span>
                <p className="mt-2 text-[13px] font-bold tracking-[2px] text-text-muted">DIGITAL WORK</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
