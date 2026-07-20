import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from '../ui/Logo'
import Button from '../ui/Button'

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'About', href: '#statistics' },
  { label: 'Pricing', href: '#pricing' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 ${
          scrolled ? 'bg-white/[0.03] border-b border-white/[0.05] backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.2)]' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-10 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-text-secondary transition-colors duration-300 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <Link
              to="/login"
              className="text-sm font-medium text-text-secondary transition-colors hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/client"
              className="text-sm font-medium text-text-secondary transition-colors hover:text-white"
            >
              Client Portal
            </Link>
            <Button variant="nav" as="a" href="#contact">
              Get Started
            </Button>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-btn border border-border bg-white/5 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu strokeWidth={1.75} className="h-5 w-5" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="fixed right-0 top-0 z-50 flex h-full w-[min(320px,85vw)] flex-col glass-card border-l border-border p-6 lg:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-btn border border-border"
                  aria-label="Close menu"
                >
                  <X strokeWidth={1.75} className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-medium text-text-secondary hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-medium text-text-secondary hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/client"
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-medium text-text-secondary hover:text-white"
                >
                  Client Portal
                </Link>
              </nav>
              <div className="mt-auto pt-8">
                <Button variant="primary" className="w-full" as="a" href="#contact">
                  Get Started
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
