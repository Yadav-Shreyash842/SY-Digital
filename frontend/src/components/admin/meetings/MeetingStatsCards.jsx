import { motion } from 'framer-motion'
import {
  Calendar, Clock, CheckCircle2, XCircle, Ban,
} from 'lucide-react'

const cards = [
  {
    key: 'total',
    icon: Calendar,
    label: 'Total Meetings',
    tint: 'from-primary to-accent-orange',
    glow: 'rgba(239,68,68,0.25)',
  },
  {
    key: 'pending',
    icon: Clock,
    label: 'Pending',
    tint: 'from-warning to-orange-400',
    glow: 'rgba(245,158,11,0.25)',
  },
  {
    key: 'approved',
    icon: CheckCircle2,
    label: 'Approved',
    tint: 'from-success to-emerald-400',
    glow: 'rgba(34,197,94,0.25)',
  },
  {
    key: 'completed',
    icon: CheckCircle2,
    label: 'Completed',
    tint: 'from-accent-blue to-accent-cyan',
    glow: 'rgba(59,130,246,0.25)',
  },
  {
    key: 'cancelled',
    icon: Ban,
    label: 'Cancelled',
    tint: 'from-slate-400 to-slate-500',
    glow: 'rgba(148,163,184,0.2)',
  },
  {
    key: 'rejected',
    icon: XCircle,
    label: 'Rejected',
    tint: 'from-danger to-red-400',
    glow: 'rgba(239,68,68,0.25)',
  },
]

export default function MeetingStatsCards({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-card border border-border bg-card-bg p-5">
            <div className="mb-4 h-10 w-10 rounded-btn bg-white/10" />
            <div className="mb-2 h-3 w-20 rounded bg-white/10" />
            <div className="h-6 w-16 rounded bg-white/10" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card, i) => {
        const val = stats?.[card.key] ?? 0
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05, ease: 'easeInOut' }}
            className="group rounded-card border border-border bg-card-bg p-5 shadow-md transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lg"
          >
            <div
              className={`mb-4 flex h-10 w-10 items-center justify-center rounded-btn bg-gradient-to-br ${card.tint} transition-all duration-300 group-hover:shadow-[0_0_24px_var(--glow)]`}
              style={{ '--glow': card.glow }}
            >
              <card.icon strokeWidth={1.75} className="h-5 w-5 text-white" />
            </div>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-text-muted">
              {card.label}
            </p>
            <p className="text-xl font-bold text-white">{val}</p>
          </motion.div>
        )
      })}
    </div>
  )
}
