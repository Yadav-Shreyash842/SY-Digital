import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  TrendingUp,
  Users,
  BarChart3,
  Zap,
  Globe,
  Layers,
} from 'lucide-react'
import Button from '../ui/Button'

const floatingIcons = [
  { icon: Zap, top: '15%', left: '55%', delay: 0 },
  { icon: Globe, top: '35%', left: '75%', delay: 0.2 },
  { icon: Layers, top: '60%', left: '65%', delay: 0.4 },
]

const stats = [
  { value: '250+', label: 'Projects Delivered' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '15+', label: 'Years Experience' },
]

export default function Hero({ onOpenProjectForm }) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 grid-pattern opacity-40" />

      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-accent-blue/15 blur-[100px]" />
      <div className="absolute top-1/2 right-1/3 h-64 w-64 rounded-full bg-accent-cyan/10 blur-[80px]" />

      <div className="relative mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium text-text-secondary">
                Trusted by 500+ global brands
              </span>
            </div>

            <h1 className="text-[36px] font-extrabold leading-[1.1] tracking-tight sm:text-[48px] lg:text-[64px]">
              We Build{' '}
              <span className="bg-gradient-to-r from-primary via-primary to-accent-cyan bg-clip-text text-transparent">
                Digital Excellence
              </span>{' '}
              That Drives Growth
            </h1>

            <p className="max-w-lg text-base leading-[160%] text-text-secondary sm:text-lg">
              SY Digital transforms ambitious visions into premium digital experiences.
              Strategy, design, and engineering — unified under one roof.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button variant="primary" onClick={onOpenProjectForm}>
                Start Your Project
                <ArrowUpRight strokeWidth={1.75} className="h-5 w-5" />
              </Button>
              <Link to="/portfolio">
                <Button variant="secondary">View Our Work</Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 pt-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease: 'easeInOut' }}
                >
                  <div className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</div>
                  <div className="text-sm text-text-muted">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
            className="relative hidden lg:block"
          >
            {floatingIcons.map(({ icon: Icon, top, left, delay }, i) => (
              <motion.div
                key={i}
                className="absolute z-10 flex h-12 w-12 items-center justify-center rounded-2xl glass-card purple-glow"
                style={{ top, left }}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, delay, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Icon strokeWidth={1.75} className="h-6 w-6 text-primary" />
              </motion.div>
            ))}

            <div className="relative rounded-[24px] border border-white/10 bg-card-bg/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Dashboard Overview</p>
                  <p className="text-xl font-bold">Revenue Analytics</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                  <BarChart3 strokeWidth={1.75} className="h-5 w-5 text-primary" />
                </div>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="rounded-[20px] border border-white/8 bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <TrendingUp strokeWidth={1.75} className="h-4 w-4 text-success" />
                    <span className="text-xs text-text-muted">Revenue</span>
                  </div>
                  <p className="text-2xl font-bold">$84,254</p>
                  <p className="text-xs text-success">+12.5% this month</p>
                </div>
                <div className="rounded-[20px] border border-white/8 bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Users strokeWidth={1.75} className="h-4 w-4 text-accent-cyan" />
                    <span className="text-xs text-text-muted">Clients</span>
                  </div>
                  <p className="text-2xl font-bold">1,429</p>
                  <p className="text-xs text-accent-cyan">+8.2% this month</p>
                </div>
              </div>

              <div className="rounded-[20px] border border-white/8 bg-white/5 p-4">
                <div className="flex h-32 items-end gap-2">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-primary to-primary"
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.6, delay: 0.5 + i * 0.05, ease: 'easeInOut' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
