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
  primary: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-active shadow-[0_4px_20px_rgba(239,68,68,0.3)]',
  secondary: 'border border-border bg-white/[0.03] text-white hover:bg-white/[0.06]',
  ghost: 'text-text-secondary hover:text-white',
  outline: 'border border-border bg-transparent text-white hover:bg-white/5',
  danger: 'bg-danger text-white hover:opacity-90',
  nav: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-active shadow-[0_4px_20px_rgba(239,68,68,0.3)]',
  light: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-active shadow-[0_4px_20px_rgba(239,68,68,0.3)]',
  lightOutline: 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50',
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
    'inline-flex items-center justify-center font-semibold rounded-btn transition-all duration-300',
    isDisabled && 'pointer-events-none opacity-60',
    className,
  )

  const content = (
    <>
      {loading && <Spinner size="sm" />}
      {children}
    </>
  )

  if (as === 'a' || href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        aria-disabled={isDisabled}
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
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      {...props}
    >
      {content}
    </motion.button>
  )
}
