import { motion } from 'framer-motion'
import Spinner from './Spinner'
import { cn } from '../../utils/cn'

const variants = {
  primary: 'btn-primary text-white font-semibold rounded-full h-[52px] px-8 text-base',
  secondary: 'btn-secondary text-white font-semibold rounded-full h-[52px] px-8 text-base',
  ghost: 'text-text-secondary hover:text-white font-medium transition-colors duration-300',
  nav: 'btn-primary text-white font-semibold rounded-full py-3.5 px-7 text-sm',
  outline: 'border border-white/10 bg-transparent text-white font-semibold rounded-full h-[52px] px-8 hover:bg-white/5 transition-all duration-300',
  light: 'bg-primary-purple text-white font-semibold rounded-full h-[52px] px-8 hover:bg-secondary-purple transition-colors duration-300 shadow-[0_4px_20px_rgba(124,58,237,0.3)]',
  lightOutline: 'border border-gray-200 bg-white text-gray-900 font-semibold rounded-full h-[52px] px-8 hover:bg-gray-50 transition-all duration-300',
  danger: 'bg-danger text-white font-semibold rounded-full h-[52px] px-8 hover:opacity-90 transition-opacity duration-300',
  sm: 'btn-primary text-white font-semibold rounded-full h-10 px-5 text-sm',
}

export default function Button({
  children,
  variant = 'primary',
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
    'inline-flex items-center justify-center gap-2',
    isDisabled && 'pointer-events-none opacity-60',
    className,
  )

  const content = (
    <>
      {loading && <Spinner size="sm" className={variant.includes('light') ? 'border-gray-300 border-t-primary-purple' : ''} />}
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
