import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Button from '../ui/Button'

export default function CTA() {
  return (
    <section className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 pb-16 md:pb-20 lg:pb-[120px]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[24px] border border-white/10 p-8 sm:p-12 lg:p-16"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-purple via-secondary-purple to-accent-blue opacity-90" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-[80px]" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent-cyan/20 blur-[80px]" />

        <div className="relative text-center">
          <h2 className="mb-4 text-[28px] font-bold sm:text-[32px] lg:text-[40px]">
            Ready to Transform Your Digital Presence?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base leading-[160%] text-white/80 sm:text-lg">
            Join 500+ brands that trust SY Digital to deliver premium digital experiences.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              variant="secondary"
              className="!bg-white !text-primary-purple !border-white hover:!bg-white/90 w-full sm:w-auto"
            >
              Schedule a Call
            </Button>
            <button
              type="button"
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full px-8 text-base font-semibold text-white transition-all duration-300 hover:gap-3"
            >
              View Case Studies
              <ArrowUpRight strokeWidth={1.75} className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
