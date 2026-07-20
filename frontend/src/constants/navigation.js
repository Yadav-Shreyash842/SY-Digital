import {
  LayoutDashboard,
  BarChart3,
  Briefcase,
  FolderKanban,
  FileText,
  Star,
  Calendar,
  CreditCard,
  MessageSquare,
  Bell,
  HardDrive,
  Users,
  Shield,
  Settings,
  User,
  Receipt,
  ClipboardList,
  Send,
} from 'lucide-react'

export const publicNavLinks = [
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
]

export const adminNavLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/admin' },
  { icon: BarChart3, label: 'Analytics', to: '/admin/analytics' },
  { icon: FolderKanban, label: 'Projects', to: '/admin/projects' },
  { icon: ClipboardList, label: 'Project Requests', to: '/admin/project-requests' },
  { icon: Briefcase, label: 'Services', to: '/admin/services' },
  { icon: Receipt, label: 'Portfolio', to: '/admin/portfolio' },
  { icon: FileText, label: 'Blogs', to: '/admin/blogs' },
  { icon: Star, label: 'Reviews', to: '/admin/reviews' },
  { icon: MessageSquare, label: 'Messages', to: '/admin/messages' },
  { icon: Calendar, label: 'Meetings', to: '/admin/meetings' },
  { icon: CreditCard, label: 'Payments', to: '/admin/payments' },
  { icon: Bell, label: 'Notifications', to: '/admin/notifications' },
  { icon: HardDrive, label: 'Media Manager', to: '/admin/media' },
  { icon: Users, label: 'Users', to: '/admin/users' },
  { icon: Shield, label: 'Roles', to: '/admin/roles' },
  { icon: Settings, label: 'Settings', to: '/admin/settings' },
  { icon: User, label: 'Profile', to: '/admin/profile' },
]

export const clientNavLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/client' },
  { icon: FolderKanban, label: 'Projects', to: '/client/projects' },
  { icon: Send, label: 'Request Project', to: '/client/request-project' },
  { icon: MessageSquare, label: 'Messages', to: '/client/messages' },
  { icon: Calendar, label: 'Meetings', to: '/client/meetings' },
  { icon: Receipt, label: 'Invoices', to: '/client/invoices' },
  { icon: User, label: 'Profile', to: '/client/profile' },
  { icon: Settings, label: 'Settings', to: '/client/settings' },
]
