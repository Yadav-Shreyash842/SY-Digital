import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Button from '../ui/Button'
import { cn } from '../../utils/cn'

export default function PricingCard({ name, price, period, description, features = [], highlighted = false, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeInOut' }}
      className={cn(
        'relative rounded-[28px] border p-8 transition-all duration-400',
        highlighted
          ? 'border-primary-purple/50 bg-gradient-to-b from-primary-purple/10 to-card-bg shadow-[0_0_60px_rgba(124,58,237,0.2)] scale-[1.02] lg:scale-105'
          : 'border-white/8 bg-card-bg premium-card',
      )}
    >
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-purple to-secondary-purple px-4 py-1 text-xs font-semibold">
          Most Popular
        </span>
      )}
      <h3 className="mb-2 text-xl font-bold">{name}</h3>
      <p className="mb-6 text-sm text-text-secondary">{description}</p>
      <div className="mb-8">
        <span className="text-4xl font-extrabold">{price}</span>
        {period && <span className="text-text-muted">{period}</span>}
      </div>
      <ul className="mb-8 space-y-4">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-sm text-text-secondary">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/20">
              <Check strokeWidth={2} className="h-3 w-3 text-success" />
            </div>
            {feature}
          </li>
        ))}
      </ul>
      <Button variant={highlighted ? 'primary' : 'secondary'} className="w-full">
        {price === 'Custom' ? 'Contact Sales' : 'Get Started'}
      </Button>
    </motion.div>
  )
}
