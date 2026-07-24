import { motion } from 'framer-motion'
import Spinner from './Spinner'
import { cn } from '../../utils/cn'

const sizeClasses = {
  xs: 'h-8 px-4 text-xs gap-1.5',
  sm: 'h-10 px-5 text-sm gap-2',
  md: 'h-12 px-6 text-sm gap-2',
  lg: 'h-14 px-8 text-base gap-2.5',
  xl: 'h-16 px-10 text-base gap-3',
}

const variants = {
  primary: 'bg-gradient-to-r from-accent-purple to-accent-orange text-white shadow-[0_4px_24px_rgba(139,92,246,0.3)] hover:shadow-[0_8px_32px_rgba(139,92,246,0.45)]',
  secondary: 'border border-white/20 bg-white/[0.04] text-white hover:bg-white/[0.08] backdrop-blur-xl',
  ghost: 'text-text-secondary hover:text-white',
  outline: 'border border-white/20 bg-transparent text-white hover:bg-white/5 backdrop-blur-xl',
  danger: 'bg-danger text-white hover:opacity-90',
  nav: 'bg-gradient-to-r from-accent-purple to-accent-orange text-white shadow-[0_4px_24px_rgba(139,92,246,0.3)] hover:shadow-[0_8px_32px_rgba(139,92,246,0.45)]',
  light: 'bg-gradient-to-r from-accent-purple to-accent-orange text-white shadow-[0_4px_24px_rgba(139,92,246,0.3)] hover:shadow-[0_8px_32px_rgba(139,92,246,0.45)]',
  lightOutline: 'border border-white/20 bg-white/[0.04] text-white hover:bg-white/[0.08] backdrop-blur-xl',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  as = 'button',
  href,
  loading = false,
  disabled = false,
  ...props
}) {
  const isDisabled = disabled || loading
  const classes = cn(
    variants[variant] || variants.primary,
    sizeClasses[size] || sizeClasses.md,
    'inline-flex items-center justify-center font-semibold rounded-[16px] transition-all duration-300',
    isDisabled && 'pointer-events-none opacity-60',
    className,
  )

  const content = (
    <>
      {loading && <Spinner size="sm" />}
      {children}
    </>
  )

  const handleClick = (e) => {
    if (isDisabled) return
    if (as !== 'a' && !href) return
  }

  if (as === 'a' || href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={isDisabled ? undefined : { scale: 1.03 }}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        aria-disabled={isDisabled}
        onClick={handleClick}
        {...props}
      >
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      type="button"
      className={classes}
      disabled={isDisabled}
      whileHover={isDisabled ? undefined : { scale: 1.03 }}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={handleClick}
      {...props}
    >
      {content}
    </motion.button>
  )
}
