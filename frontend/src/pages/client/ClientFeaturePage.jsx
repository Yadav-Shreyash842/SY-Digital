import { motion } from 'framer-motion'
import {
  ArrowRight,
  AlertTriangle,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  Folder,
  HeartHandshake,
  Info,
  LifeBuoy,
  MessageCircle,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  User,
  Users,
  Video,
  Zap,
} from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

const pages = {
  'project-details': {
    stats: [
      { label: 'Phase', value: 'Execution', icon: Folder },
      { label: 'Completion', value: '76%', icon: BarChart3 },
      { label: 'Next review', value: 'Jul 31, 2026', icon: Calendar },
    ],
    blocks: [
      {
        title: 'Core scope',
        description: 'Finalize branding assets, refine launch messaging, and approve the final delivery schedule.',
      },
      {
        title: 'Team alignment',
        description: 'Design, engineering, and strategy teams are synced around the next milestone and handoff checkpoints.',
      },
    ],
    highlights: [
      { label: 'Open actions', value: '4 items', icon: CheckCircle2 },
      { label: 'Client feedback', value: 'Received 2 comments', icon: Sparkles },
    ],
  },
  'meeting-details': {
    stats: [
      { label: 'Attendees', value: '5 people', icon: Users },
      { label: 'Session type', value: 'Video call', icon: Video },
      { label: 'Start time', value: 'Aug 2, 2026 · 10:00 AM', icon: Clock3 },
    ],
    blocks: [
      {
        title: 'Agenda',
        description: 'Review the latest design concepts, align on feature priorities, and prepare the delivery checklist.',
      },
      {
        title: 'Expected outcome',
        description: 'Confirm milestones, delegate follow-up items, and lock the launch timeline for the current sprint.',
      },
    ],
    highlights: [
      { label: 'Recording available', value: 'Yes', icon: Download },
      { label: 'Notes ready', value: 'Shared with stakeholders', icon: FileText },
    ],
  },
  'join-meeting': {
    stats: [
      { label: 'Upcoming session', value: 'FinFlow review', icon: Calendar },
      { label: 'Starts in', value: '00:32:18', icon: Clock3 },
      { label: 'Location', value: 'Secure video room', icon: Bell },
    ],
    blocks: [
      {
        title: 'Ready to join',
        description: 'Your meeting room is prepared. Join the session from this page to collaborate in real time with your account team.',
      },
    ],
    highlights: [
      { label: 'Join now', value: 'One click access', icon: ArrowRight },
    ],
  },
  payments: {
    stats: [
      { label: 'Outstanding', value: '$1,950', icon: FileText },
      { label: 'Due soon', value: '2 invoices', icon: AlertTriangle },
      { label: 'Paid this month', value: '$18,200', icon: CheckCircle2 },
    ],
    blocks: [
      {
        title: 'Latest activity',
        description: 'Your recent invoices and payment receipts are available for download and review from one secure location.',
      },
      {
        title: 'Account balance',
        description: 'A single view of recurring fees, project deposits, and prorated service credits.',
      },
    ],
    highlights: [
      { label: 'Auto-pay enabled', value: 'Active', icon: ShieldCheck },
    ],
  },
  chat: {
    stats: [
      { label: 'Unread conversations', value: '3', icon: MessageCircle },
      { label: 'Team channels', value: '4 live threads', icon: Users },
      { label: 'Last reply', value: '12 min ago', icon: Clock3 },
    ],
    blocks: [
      {
        title: 'Keep the dialogue moving',
        description: 'Review the latest threads and respond to requests from your account leads without losing context.',
      },
      {
        title: 'Featured updates',
        description: 'You have a new message from the strategy team awaiting your approval.',
      },
    ],
  },
  files: {
    stats: [
      { label: 'Total assets', value: '128 files', icon: Folder },
      { label: 'Storage used', value: '2.7 GB', icon: UploadCloud },
      { label: 'Recent uploads', value: '5 items', icon: FileText },
    ],
    blocks: [
      {
        title: 'Shared library',
        description: 'Access the most recent creative assets, briefs, and launch documentation from the portal file hub.',
      },
      {
        title: 'Secure access',
        description: 'Every file is tracked and versioned, so you always have the latest approved deliverable in hand.',
      },
    ],
  },
  downloads: {
    stats: [
      { label: 'Ready to download', value: '8 assets', icon: Download },
      { label: 'Latest update', value: 'Today', icon: Sparkles },
      { label: 'File type', value: 'PDF, SVG, MP4', icon: FileText },
    ],
    blocks: [
      {
        title: 'Download center',
        description: 'Grab the latest brand guidelines, reports and finalized deliverables without waiting for email attachments.',
      },
    ],
  },
  notifications: {
    stats: [
      { label: 'Unread alerts', value: '6', icon: Bell },
      { label: 'System notices', value: '2 critical', icon: ShieldCheck },
      { label: 'Team updates', value: '5 new', icon: MessageCircle },
    ],
    blocks: [
      {
        title: 'Latest alerts',
        description: 'Priority updates appear here first, including payment reminders and deliverable approvals.',
      },
      {
        title: 'Notification settings',
        description: 'Choose how you want to receive updates for meetings, invoices, and file changes.',
      },
    ],
  },
  activity: {
    stats: [
      { label: 'Actions this week', value: '14', icon: Zap },
      { label: 'Project events', value: '8 logged', icon: Calendar },
      { label: 'Engagement score', value: '92%', icon: HeartHandshake },
    ],
    blocks: [
      {
        title: 'Recent activity',
        description: 'Your portal activity is updated in real time so you can monitor approvals, comments, and delivery milestones.',
      },
    ],
  },
  support: {
    stats: [
      { label: 'Open tickets', value: '1', icon: LifeBuoy },
      { label: 'Response time', value: 'Under 2h', icon: Clock3 },
      { label: 'Account specialist', value: 'Assigned', icon: User },
    ],
    blocks: [
      {
        title: 'Need help?',
        description: 'Submit a ticket, review support notes, and track resolution progress with a premium support experience.',
      },
    ],
  },
  'help-center': {
    stats: [
      { label: 'Guides available', value: '12 resources', icon: Info },
      { label: 'Search results', value: 'Instant answers', icon: Search },
      { label: 'Support topics', value: '4 categories', icon: Folder },
    ],
    blocks: [
      {
        title: 'Knowledge base',
        description: 'Find answers to common questions, onboarding guides, and portal tips in one elegant experience.',
      },
    ],
  },
  profile: {
    stats: [
      { label: 'Account type', value: 'Premium client', icon: User },
      { label: 'Last sign in', value: 'Today · 09:10 AM', icon: Clock3 },
      { label: 'Team members', value: '3', icon: Users },
    ],
    blocks: [
      {
        title: 'Profile summary',
        description: 'Your contact information, company details, and notification preferences are all managed securely from here.',
      },
    ],
  },
  settings: {
    stats: [
      { label: 'Settings categories', value: '5 areas', icon: Settings },
      { label: '2FA status', value: 'Enabled', icon: ShieldCheck },
      { label: 'Audit log', value: 'Available', icon: Folder },
    ],
    blocks: [
      {
        title: 'Workspace preferences',
        description: 'Adjust notification delivery, display modes, and security preferences for your premium portal experience.',
      },
    ],
  },
  'account-settings': {
    stats: [
      { label: 'Billing profile', value: 'Verified', icon: FileText },
      { label: 'Subscription', value: 'Enterprise plan', icon: HeartHandshake },
      { label: 'Compliance', value: 'Up to date', icon: ShieldCheck },
    ],
    blocks: [
      {
        title: 'Account controls',
        description: 'Securely update your email, password, and organization details while maintaining the premium service agreement.',
      },
    ],
  },
  security: {
    stats: [
      { label: 'MFA enabled', value: 'Yes', icon: ShieldCheck },
      { label: 'Active sessions', value: '2 devices', icon: User },
      { label: 'Alerts', value: 'All clear', icon: Bell },
    ],
    blocks: [
      {
        title: 'Security posture',
        description: 'Review your active devices, password policy, and login safeguards to keep your portal access protected.',
      },
    ],
  },
}

const iconClasses = 'h-5 w-5 text-primary-purple'

function Panel({ title, description }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm text-slate-300 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
      <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{title}</p>
      <p className="mt-4 leading-7 text-white">{description}</p>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
      <div className="flex items-center gap-3 text-slate-300">
        <Icon strokeWidth={1.75} className={iconClasses} />
        <span className="text-sm uppercase tracking-[0.18em] text-slate-400">{label}</span>
      </div>
      <p className="mt-4 text-2xl font-semibold text-white">{value}</p>
    </div>
  )
}

export default function ClientFeaturePage({ title, subtitle = 'This section is coming soon.', variant }) {
  const page = pages[variant] || pages['help-center']

  return (
    <div className="space-y-8">
      <PageHeader title={title} description={subtitle} theme="dark" />

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="glass-card rounded-4xl border border-white/10 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.24)]"
      >
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-300">
              <Sparkles className="h-4 w-4 text-primary-purple" strokeWidth={1.75} />
              Premium client experience
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-400">
              {subtitle}
            </p>
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-full bg-primary-purple px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110">
            <ArrowRight strokeWidth={1.75} className="h-4 w-4" />
            Explore details
          </button>
        </div>
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.85fr]">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08, ease: 'easeInOut' }}
            className="grid gap-4 sm:grid-cols-3"
          >
            {page.stats.map((stat) => (
              <StatCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} />
            ))}
          </motion.div>

          {page.blocks.map((block) => (
            <Panel key={block.title} title={block.title} description={block.description} />
          ))}
        </div>

        <aside className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.12, ease: 'easeInOut' }}
            className="glass-card rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)]"
          >
            <div className="mb-4 flex items-center gap-3 text-slate-300">
              <Info strokeWidth={1.75} className="h-5 w-5 text-primary-purple" />
              <h3 className="text-lg font-semibold text-white">Highlights</h3>
            </div>
            <div className="space-y-4">
              {page.highlights?.map((item) => (
                <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3 text-slate-300">
                    <item.icon strokeWidth={1.75} className="h-4 w-4 text-primary-purple" />
                    <span className="text-sm font-semibold text-white">{item.label}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{item.value}</p>
                </div>
              ))}
              {!page.highlights && (
                <p className="text-sm leading-7 text-slate-400">Use this page to explore the latest updates and priority items for your premium portal journey.</p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.16, ease: 'easeInOut' }}
            className="glass-card rounded-[30px] border border-white/10 bg-gradient-to-br from-accent-cyan/10 to-primary-purple/10 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)]"
          >
            <div className="mb-3 flex items-center gap-2">
              <HeartHandshake strokeWidth={1.75} className="h-5 w-5 text-primary-purple" />
              <h3 className="text-lg font-semibold text-white">Portal best practice</h3>
            </div>
            <p className="text-sm leading-7 text-slate-300">
              Keep this page open as your primary portal anchor. Everything is organized for fast access to status, next steps, and support.
            </p>
          </motion.div>
        </aside>
      </div>
    </div>
  )
}
