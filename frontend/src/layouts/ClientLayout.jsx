import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import {
  Bell,
  Search,
  Menu,
  LogOut,
  Settings,
  User,
  Calendar,
  FolderKanban,
  MessageSquare,
  Receipt,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from '../components/ui/Logo'
import Avatar from '../components/ui/Avatar'
import { clientNavLinks } from '../constants/navigation'
import useAuth from '../hooks/useAuth'

const sections = [
  { title: 'Workspace', items: clientNavLinks.slice(0, 5) },
  { title: 'Account', items: clientNavLinks.slice(5) },
]

export default function ClientLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()

  const userFullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Client'
  const userInitials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() : 'CL'

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-sidebar-bg shadow-[0_35px_90px_rgba(0,0,0,0.35)]">
      <div className="flex h-[90px] items-center justify-between border-b border-border px-6">
        <Logo light />
        <span className="rounded-btn border border-border bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-text-muted">
          Client
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        {sections.map((section) => (
          <div key={section.title} className="mb-6">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/35">{section.title}</p>
            <div className="space-y-2">
              {section.items.map(({ icon: Icon, label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/client'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-btn px-4 py-3 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-white/10 text-white shadow-[0_10px_30px_rgba(255,255,255,0.08)]'
                        : 'text-text-secondary hover:bg-white/5 hover:text-white'
                    }`
                  }
                  >
                    <Icon strokeWidth={1.75} className="h-5 w-5 text-text-secondary transition-colors duration-300 group-hover:text-white" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border px-4 py-5">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-btn bg-white/5 px-4 py-3 text-sm font-medium text-text-secondary transition hover:bg-white/10 hover:text-white"
        >
          <LogOut strokeWidth={1.75} className="h-5 w-5" />
          <span>Back to Site</span>
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/8 via-accent-blue/5 to-primary-bg text-white">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[300px] lg:block">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="fixed inset-y-0 left-0 z-50 w-[300px] lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen flex-col lg:ml-[300px]">
        <header className="sticky top-0 z-30 border-b border-border bg-sidebar-bg/80 backdrop-blur-xl px-4 py-4 shadow-lg sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-btn border border-border bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu strokeWidth={1.75} className="h-5 w-5" />
              </button>
              <div className="relative hidden md:block">
                <Search strokeWidth={1.75} className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
                <input
                  type="search"
                  placeholder="Search the portal..."
                  className="h-12 w-full max-w-[320px] rounded-input border border-border bg-input-bg px-12 text-sm text-white placeholder:text-text-placeholder outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative inline-flex h-12 w-12 items-center justify-center rounded-btn border border-border bg-white/5 text-white transition hover:bg-white/10"
              >
                <Bell strokeWidth={1.75} className="h-5 w-5" />
                <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-warning ring-2 ring-primary-bg" />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-3 rounded-btn border border-border bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
              >
                <Avatar name={userFullName} size="sm" className="!h-10 !w-10" />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-white">{userFullName}</p>
                  <p className="text-xs text-text-muted">Client</p>
                </div>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
