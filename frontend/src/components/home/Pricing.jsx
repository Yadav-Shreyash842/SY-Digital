import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import SectionContainer from '../ui/SectionContainer'
import Button from '../ui/Button'

const plans = [
  {
    name: 'Starter',
    price: '$2,499',
    period: '/month',
    description: 'Perfect for startups launching their digital presence.',
    features: ['5 Page Website', 'Basic SEO Setup', 'Mobile Responsive', 'Email Support', 'Monthly Reports'],
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$4,999',
    period: '/month',
    description: 'For growing businesses ready to scale aggressively.',
    features: ['Custom Web Application', 'Advanced SEO & Analytics', 'UI/UX Design System', 'Priority Support', 'Weekly Strategy Calls', 'Client Dashboard Access'],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored solutions for enterprise-level requirements.',
    features: ['Full-Stack Development', 'Dedicated Team', '24/7 Support', 'Custom Integrations', 'SLA Guarantee', 'White-Label Options'],
    highlighted: false,
  },
]

export default function Pricing() {
  return (
    <SectionContainer id="pricing" className="bg-section-bg/30">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="mb-16 text-center"
      >
        <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-accent-purple">
          Pricing
        </span>
        <h2 className="mb-6 text-2xl font-bold sm:text-[32px] lg:text-[40px]">
          Plans Built for <span className="text-gradient">Every Stage</span>
        </h2>
        <p className="mx-auto max-w-2xl text-base leading-[160%] text-text-secondary sm:text-lg">
          Transparent pricing with no hidden fees. Choose the plan that fits your ambition.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeInOut' }}
            className={`relative rounded-[24px] border p-8 transition-all duration-400 ${
              plan.highlighted
                ? 'border-accent-purple/50 bg-gradient-to-b from-accent-purple/[0.08] to-white/[0.02] backdrop-blur-xl shadow-[0_0_60px_rgba(139,92,246,0.25)] scale-[1.02] lg:scale-105'
                : 'border-white/[0.06] bg-white/[0.02] backdrop-blur-xl hover:border-accent-purple/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] hover:scale-[1.02]'
            }`}
          >
            {plan.highlighted && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-accent-purple to-accent-orange px-5 py-1.5 text-xs font-semibold shadow-[0_4px_16px_rgba(139,92,246,0.3)]">
                Most Popular
              </span>
            )}
            <h3 className="mb-2 text-xl font-bold">{plan.name}</h3>
            <p className="mb-6 text-sm text-text-secondary">{plan.description}</p>
            <div className="mb-8">
              <span className="text-2xl font-extrabold sm:text-3xl lg:text-4xl">{plan.price}</span>
              {plan.period && <span className="text-text-muted">{plan.period}</span>}
            </div>
            <ul className="mb-8 space-y-4">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-text-secondary">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/20">
                    <Check strokeWidth={2} className="h-3 w-3 text-success" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.highlighted ? 'primary' : 'secondary'}
              className="w-full"
            >
              {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
            </Button>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  )
}
