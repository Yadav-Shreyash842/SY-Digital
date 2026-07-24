import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'

export default function CTA() {
  return (
    <section className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 pb-16 md:pb-20 lg:pb-[120px]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[24px] border border-accent-purple/20 bg-[#080A14] p-8 sm:p-12 lg:p-16 shadow-[0_0_60px_rgba(139,92,246,0.08)]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/[0.08] via-transparent to-accent-orange/[0.06]" />
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-accent-purple/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-accent-orange/10 blur-[120px]" />

        <div className="light-streak top-[30%] left-0" />
        <div className="light-streak top-[70%] right-0" />

        <div className="relative text-center">
          <h2 className="mb-4 text-2xl font-bold sm:text-[32px] lg:text-[40px]">
            Ready to Transform Your Digital Presence?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base leading-[160%] text-white/60 sm:text-lg">
            Join 500+ brands that trust SY Digital to deliver premium digital experiences.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/schedule-meeting">
              <Button variant="primary" className="w-full sm:w-auto">
                Schedule a Call
              </Button>
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[16px] border border-white/20 bg-white/[0.04] backdrop-blur-xl px-6 text-base font-semibold text-white transition-all duration-300 hover:bg-white/[0.08] hover:gap-3"
            >
              View Case Studies
              <ArrowUpRight strokeWidth={1.75} className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
