import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function Drawer({ isOpen, onClose, title, children, side = 'right', className = '' }) {
  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const slideFrom = side === 'right' ? { x: '100%' } : { x: '-100%' }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={slideFrom}
            animate={{ x: 0 }}
            exit={slideFrom}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className={cn(
              'fixed inset-y-0 z-50 flex w-[min(400px,90vw)] flex-col border-white/10 bg-secondary-bg shadow-2xl',
              side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
              className,
            )}
          >
            <div className="flex h-[72px] items-center justify-between border-b border-white/8 px-6">
              {title && <h2 className="text-lg font-bold">{title}</h2>}
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10"
                aria-label="Close drawer"
              >
                <X strokeWidth={1.75} className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
