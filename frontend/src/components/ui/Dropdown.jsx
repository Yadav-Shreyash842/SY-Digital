import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'

export default function Dropdown({ trigger, items = [], isOpen, onClose, align = 'right', className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose?.()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen, onClose])

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      {trigger}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={cn(
              'absolute z-50 mt-2 min-w-[200px] overflow-hidden rounded-2xl border border-white/10 bg-card-bg shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl',
              align === 'right' ? 'right-0' : 'left-0',
            )}
            role="menu"
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => { item.onClick?.(); onClose?.() }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-white"
              >
                {item.icon && <item.icon strokeWidth={1.75} className="h-4 w-4" />}
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
