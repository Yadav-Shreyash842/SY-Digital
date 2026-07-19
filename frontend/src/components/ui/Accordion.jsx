import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function Accordion({ items = [], theme = 'dark', className = '' }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div
            key={item.question || item.title}
            className={cn(
              'overflow-hidden rounded-2xl border transition-colors duration-300',
              theme === 'dark' ? 'border-white/8 bg-card-bg' : 'border-gray-200 bg-white',
            )}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="pr-4 font-semibold">{item.question || item.title}</span>
              <ChevronDown
                strokeWidth={1.75}
                className={cn('h-5 w-5 shrink-0 transition-transform duration-300', isOpen && 'rotate-180')}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className={cn('px-6 pb-5 text-base leading-[160%]', theme === 'dark' ? 'text-text-secondary' : 'text-gray-600')}>
                    {item.answer || item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
