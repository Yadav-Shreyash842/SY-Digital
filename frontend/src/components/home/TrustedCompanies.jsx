import { motion } from 'framer-motion'

const companies = [
  'Stripe', 'Vercel', 'Linear', 'Notion', 'Framer', 'Raycast',
]

export default function TrustedCompanies() {
  return (
    <section className="border-y border-white/8 bg-secondary-bg/50 py-12">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-text-muted">
          Trusted by industry leaders
        </p>
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {companies.map((company, i) => (
            <motion.span
              key={company}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-lg font-semibold text-text-muted/60 transition-colors duration-300 hover:text-text-secondary sm:text-xl"
            >
              {company}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}
