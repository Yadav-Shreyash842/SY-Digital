import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function Modal({ isOpen, onClose, title, children, size = 'md', className = '' }) {
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

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            className={cn(
             'relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-modal border border-border bg-card-bg shadow-xl',
              sizes[size],
              className,
            )}
          >
            {(title || onClose) && (
              <div className="flex items-center justify-between border-b border-white/10 p-4 sm:p-6">
                {title && <h2 id="modal-title" className="text-lg font-bold sm:text-xl">{title}</h2>}
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 hover:bg-white/5"
                    aria-label="Close modal"
                  >
                    <X strokeWidth={1.75} className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}
           <div className="flex-1 overflow-y-auto p-4 sm:p-6">
  {children}
</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
