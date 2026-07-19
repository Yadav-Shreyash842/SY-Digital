import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  LogOut,
  ChevronLeft,
  FolderKanban,
  MessageSquare,
  Calendar,
  Receipt,
  CreditCard,
  LifeBuoy,
  HardDrive,
  Shield,
  User,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from '../components/ui/Logo'

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/admin' },
  { icon: BarChart3, label: 'Analytics', to: '/admin/analytics' },
  { icon: FolderKanban, label: 'Projects', to: '/admin/projects' },
  { icon: ShoppingBag, label: 'Services', to: '/admin/services' },
  { icon: Users, label: 'Clients', to: '/admin/clients' },
  { icon: MessageSquare, label: 'Messages', to: '/admin/messages' },
  { icon: Calendar, label: 'Meetings', to: '/admin/meetings' },
  { icon: CreditCard, label: 'Payments', to: '/admin/payments' },
  { icon: HardDrive, label: 'Media Library', to: '/admin/media' },
  { icon: Users, label: 'Users', to: '/admin/users' },
  { icon: Shield, label: 'Roles', to: '/admin/roles' },
  { icon: Settings, label: 'Settings', to: '/admin/settings' },
  { icon: User, label: 'Profile', to: '/admin/profile' },
  { icon: Receipt, label: 'Portfolio', to: '/admin/portfolio' },
  { icon: Bell, label: 'Notifications', to: '/admin/notifications' },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex h-full flex-col bg-[#050B1B] text-white">
      <div className="flex h-[88px] items-center justify-between border-b border-white/10 px-5">
        {!collapsed && <Logo />}
        {collapsed && !mobile && (
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-purple to-accent-blue text-sm font-bold text-white">
            SY
          </div>
        )}
        {!mobile && (
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-10 w-10 items-center justify-center rounded-3xl border border-white/10 text-white hover:bg-white/5"
          >
            <ChevronLeft strokeWidth={1.75} className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <div className="mb-6 px-2 text-xs uppercase tracking-[0.24em] text-slate-500">Main</div>
        <div className="space-y-2">
          {sidebarLinks.slice(0, 5).map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              onClick={() => mobile && setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-[22px] px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary-purple/25 text-white shadow-[0_0_20px_rgba(124,58,237,0.22)]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon strokeWidth={1.75} className="h-5 w-5" />
              {(!collapsed || mobile) && <span>{label}</span>}
            </NavLink>
          ))}
        </div>

        <div className="mt-8 mb-6 px-2 text-xs uppercase tracking-[0.24em] text-slate-500">Operations</div>
        <div className="space-y-2">
          {sidebarLinks.slice(5, 12).map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => mobile && setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-[22px] px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary-purple/25 text-white shadow-[0_0_20px_rgba(124,58,237,0.22)]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon strokeWidth={1.75} className="h-5 w-5" />
              {(!collapsed || mobile) && <span>{label}</span>}
            </NavLink>
          ))}
        </div>

        <div className="mt-8 mb-6 px-2 text-xs uppercase tracking-[0.24em] text-slate-500">Administration</div>
        <div className="space-y-2">
          {sidebarLinks.slice(12).map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => mobile && setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-[22px] px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary-purple/25 text-white shadow-[0_0_20px_rgba(124,58,237,0.22)]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon strokeWidth={1.75} className="h-5 w-5" />
              {(!collapsed || mobile) && <span>{label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-[22px] bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10"
        >
          <LogOut strokeWidth={1.75} className="h-5 w-5" />
          {(!collapsed || mobile) && <span>Back to Site</span>}
        </Link>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#02040C] text-white">
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-white/10 bg-[#050B1B] transition-all duration-300 lg:block ${
          collapsed ? 'w-[96px]' : 'w-[300px]'
        }`}
      >
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
              className="fixed inset-y-0 left-0 z-50 w-[300px] border-r border-white/10 bg-[#050B1B] lg:hidden"
            >
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className={`flex flex-1 flex-col transition-all duration-300 ${collapsed ? 'lg:ml-[96px]' : 'lg:ml-[300px]'}`}>
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[rgba(4,10,25,0.76)] backdrop-blur-xl px-4 py-4 shadow-[0_16px_40px_rgba(0,0,0,0.24)] sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
                  placeholder="Search anything..."
                  className="h-12 w-[320px] rounded-full border border-white/10 bg-[#0A1328] px-14 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
              >
                <Bell strokeWidth={1.75} className="h-5 w-5" />
                <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-warning ring-2 ring-[#02040C]" />
              </button>
              <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-purple to-accent-blue text-sm font-bold text-white">
                  JD
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-white">John Doe</p>
                  <p className="text-xs text-slate-400">Super Admin</p>
                </div>
              </div>
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
