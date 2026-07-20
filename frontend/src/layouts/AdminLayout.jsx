import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
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
  HardDrive,
  Shield,
  User,
  FileText,
  Star,
  Briefcase,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from '../components/ui/Logo'
import useAuth from '../hooks/useAuth'

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/admin' },
  { icon: BarChart3, label: 'Analytics', to: '/admin/analytics' },
  { icon: FolderKanban, label: 'Projects', to: '/admin/projects' },
  { icon: Briefcase, label: 'Services', to: '/admin/services' },
  { icon: Receipt, label: 'Portfolio', to: '/admin/portfolio' },
  { icon: FileText, label: 'Blogs', to: '/admin/blogs' },
  { icon: Star, label: 'Reviews', to: '/admin/reviews' },
  { icon: MessageSquare, label: 'Messages', to: '/admin/messages' },
  { icon: Calendar, label: 'Meetings', to: '/admin/meetings' },
  { icon: CreditCard, label: 'Payments', to: '/admin/payments' },
  { icon: Bell, label: 'Notifications', to: '/admin/notifications' },
  { icon: HardDrive, label: 'Media Library', to: '/admin/media' },
  { icon: Users, label: 'Users', to: '/admin/users' },
  { icon: Shield, label: 'Roles', to: '/admin/roles' },
  { icon: Settings, label: 'Settings', to: '/admin/settings' },
  { icon: User, label: 'Profile', to: '/admin/profile' },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const userInitials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() : 'AD'
  const userFullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Admin'
  const userRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Admin'

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex h-full flex-col bg-sidebar-bg text-white">
      <div className="flex h-[88px] items-center justify-between border-b border-border px-5">
        {!collapsed && <Logo />}
        {collapsed && !mobile && (
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-btn bg-gradient-to-br from-primary to-accent-orange text-sm font-bold text-white">
            SY
          </div>
        )}
        {!mobile && (
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-10 w-10 items-center justify-center rounded-btn border border-border text-white hover:bg-white/5"
          >
            <ChevronLeft strokeWidth={1.75} className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <div className="mb-6 px-2 text-xs uppercase tracking-[0.24em] text-text-muted">Main</div>
        <div className="space-y-2">
          {sidebarLinks.slice(0, 5).map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              onClick={() => mobile && setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-btn px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary/15 text-white shadow-[0_0_20px_rgba(239,68,68,0.18)]'
                    : 'text-text-secondary hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon strokeWidth={1.75} className="h-5 w-5" />
              {(!collapsed || mobile) && <span>{label}</span>}
            </NavLink>
          ))}
        </div>

        <div className="mt-8 mb-6 px-2 text-xs uppercase tracking-[0.24em] text-text-muted">Operations</div>
        <div className="space-y-2">
          {sidebarLinks.slice(5, 12).map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => mobile && setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-btn px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary/15 text-white shadow-[0_0_20px_rgba(239,68,68,0.18)]'
                    : 'text-text-secondary hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon strokeWidth={1.75} className="h-5 w-5" />
              {(!collapsed || mobile) && <span>{label}</span>}
            </NavLink>
          ))}
        </div>

        <div className="mt-8 mb-6 px-2 text-xs uppercase tracking-[0.24em] text-text-muted">Administration</div>
        <div className="space-y-2">
          {sidebarLinks.slice(12).map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => mobile && setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-btn px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary/15 text-white shadow-[0_0_20px_rgba(239,68,68,0.18)]'
                    : 'text-text-secondary hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon strokeWidth={1.75} className="h-5 w-5" />
              {(!collapsed || mobile) && <span>{label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="border-t border-border px-4 py-4 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-btn bg-white/5 px-4 py-3 text-sm font-medium text-text-secondary transition hover:bg-white/10 hover:text-white"
        >
          <LogOut strokeWidth={1.75} className="h-5 w-5" />
          {(!collapsed || mobile) && <span>Back to Site</span>}
        </Link>
        <button
          type="button"
          onClick={() => { logout(); navigate('/login') }}
          className="flex w-full items-center gap-3 rounded-btn bg-danger/10 px-4 py-3 text-sm font-medium text-danger transition hover:bg-danger/20"
        >
          <LogOut strokeWidth={1.75} className="h-5 w-5" />
          {(!collapsed || mobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-primary-bg text-white">
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-border bg-sidebar-bg transition-all duration-300 lg:block ${
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
              className="fixed inset-y-0 left-0 z-50 w-[300px] border-r border-border bg-sidebar-bg lg:hidden"
            >
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className={`flex flex-1 flex-col transition-all duration-300 ${collapsed ? 'lg:ml-[96px]' : 'lg:ml-[300px]'}`}>
        <header className="sticky top-0 z-30 border-b border-border bg-sidebar-bg/80 backdrop-blur-xl px-4 py-4 shadow-lg sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
                  placeholder="Search anything..."
                  className="h-12 w-full max-w-[320px] rounded-input border border-border bg-input-bg px-14 text-sm text-white placeholder:text-text-placeholder outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
              <div className="flex items-center gap-3 rounded-btn border border-border bg-white/5 px-4 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-gradient-to-br from-primary to-accent-orange text-sm font-bold text-white">
                  {userInitials}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-white">{userFullName}</p>
                  <p className="text-xs text-text-muted">{userRole}</p>
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
