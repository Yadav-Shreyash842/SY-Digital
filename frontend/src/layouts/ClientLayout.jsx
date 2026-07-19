import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import {
  Bell,
  Search,
  Menu,
  LogOut,
  LifeBuoy,
  Clock3,
  Files,
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

const sections = [
  { title: 'Workspace', items: clientNavLinks.slice(0, 6) },
  { title: 'Support', items: clientNavLinks.slice(6) },
]

export default function ClientLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-[rgba(5,8,22,0.96)] shadow-[0_35px_90px_rgba(0,0,0,0.35)]">
      <div className="flex h-[90px] items-center justify-between border-b border-white/10 px-6">
        <Logo light />
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/60">
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
                    `group flex items-center gap-3 rounded-[22px] px-4 py-3 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-white/10 text-white shadow-[0_10px_30px_rgba(255,255,255,0.08)]'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <Icon strokeWidth={1.75} className="h-5 w-5 text-slate-300 transition-colors duration-300 group-hover:text-white" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 px-4 py-5">
        <div className="mb-4 rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          <p className="font-semibold text-white">Need assistance?</p>
          <p className="mt-1 text-xs text-slate-400">Open a support ticket or review the help center anytime.</p>
        </div>
        <Link
          to="/client/help-center"
          className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-primary-purple px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(124,58,237,0.25)] transition hover:brightness-110"
          onClick={() => setMobileOpen(false)}
        >
          Open Help Center
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(124,58,237,0.18),transparent_18%),radial-gradient(circle_at_15%_12%,_rgba(59,130,246,0.12),transparent_18%),#050816] text-white">
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
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[rgba(5,8,22,0.82)] backdrop-blur-xl px-4 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.18)] sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu strokeWidth={1.75} className="h-5 w-5" />
              </button>
              <div className="relative hidden md:block">
                <Search strokeWidth={1.75} className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search the portal..."
                  className="h-12 w-[320px] rounded-full border border-white/10 bg-slate-950/70 px-12 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
              >
                <Bell strokeWidth={1.75} className="h-5 w-5" />
                <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-warning ring-2 ring-slate-950" />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
              >
                <Avatar name="John Doe" size="sm" className="!h-10 !w-10" />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-white">John Doe</p>
                  <p className="text-xs text-slate-400">Premium Client</p>
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
