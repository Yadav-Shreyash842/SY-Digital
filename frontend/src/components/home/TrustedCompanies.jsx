import { motion } from 'framer-motion'

const companies = [
  'Stripe', 'Vercel', 'Linear', 'Notion', 'Framer', 'Raycast',
]

export default function TrustedCompanies() {
  return (
    <section className="relative bg-white/[0.01] backdrop-blur-xl border-y border-white/[0.05] py-14 overflow-hidden">
      <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-accent-purple/20 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-accent-orange/20 to-transparent pointer-events-none" />
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <p className="mb-10 text-center text-sm font-medium uppercase tracking-widest text-text-muted">
          Trusted by industry leaders
        </p>
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-16 gap-y-8">
          {companies.map((company, i) => (
            <motion.span
              key={company}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-xl font-semibold tracking-tight text-white/40 transition-colors duration-300 hover:text-white/80"
            >
              {company}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}
