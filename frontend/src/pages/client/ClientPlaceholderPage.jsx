import { motion } from 'framer-motion'

export default function ClientPlaceholderPage({ title, subtitle = 'This section is coming soon.' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="glass-card mx-auto max-w-3xl rounded-[32px] border border-white/10 p-12 text-center shadow-[0_30px_80px_rgba(0,0,0,0.22)]"
    >
      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Client portal</p>
      <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">{title}</h1>
      <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300">{subtitle}</p>
      <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-3 text-sm text-slate-300">
        This page is being designed with the premium workspace experience in mind.
      </div>
    </motion.div>
  )
}
