import { motion } from 'framer-motion'
import {
  FolderKanban,
  FileText,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Briefcase,
  ArrowUpRight,
} from 'lucide-react'

const stats = [
  { icon: FolderKanban, label: 'Active projects', value: '7', accent: 'from-primary-purple to-accent-blue' },
  { icon: Briefcase, label: 'Upcoming deadlines', value: '4', accent: 'from-accent-blue to-accent-cyan' },
  { icon: FileText, label: 'Pending invoices', value: '2', accent: 'from-warning to-orange-400' },
  { icon: MessageSquare, label: 'Unread messages', value: '3', accent: 'from-primary-purple to-indigo-500' },
]

const highlights = [
  { title: 'Website refresh', status: 'On track', value: '78%', due: 'Aug 15' },
  { title: 'Brand system launch', status: 'Delivered', value: '100%', due: 'Jul 10' },
  { title: 'Growth sprint Q3', status: 'At risk', value: '46%', due: 'Sep 01' },
]

const meetings = [
  { label: 'Project review', time: 'Jul 20 · 2:00 PM', participants: 'Sarah, Marcus' },
  { label: 'Design walkthrough', time: 'Jul 22 · 10:00 AM', participants: 'Design team' },
  { label: 'Strategy sync', time: 'Jul 25 · 3:30 PM', participants: 'Leadership' },
]

const notifications = [
  { title: 'Invoice INV-2026-041 is due soon', type: 'Payment reminder', time: '1h ago' },
  { title: 'New feedback on wireframes', type: 'Project update', time: '3h ago' },
  { title: 'Meeting summary available', type: 'Meeting reminder', time: '5h ago' },
]

const files = [
  { name: 'Brand Guidelines v2.pdf', type: 'PDF', size: '4.2 MB' },
  { name: 'Wireframes.fig', type: 'Figma', size: '12.8 MB' },
  { name: 'Scope Document.docx', type: 'Word', size: '1.1 MB' },
]

export default function ClientDashboard() {
  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        className="glass-card overflow-hidden rounded-4xl border border-white/10 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.28)]"
      >
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-300">
              <Sparkles className="h-4 w-4 text-primary-purple" strokeWidth={1.75} />
              Client Portal
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Your studio command center.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Monitor every engagement, view upcoming milestones, and stay aligned with the team from a premium dashboard experience.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:w-110">
            <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_48px_rgba(0,0,0,0.2)]">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Today</p>
              <p className="mt-3 text-3xl font-semibold text-white">Jul 19, 2026</p>
              <p className="mt-2 text-sm text-slate-400">2 meetings and one payment review left.</p>
            </div>
            <div className="rounded-[26px] border border-white/10 bg-linear-to-br from-primary-purple/15 to-accent-blue/10 p-5 shadow-[0_18px_48px_rgba(0,0,0,0.2)]">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Account health</p>
              <p className="mt-3 text-3xl font-semibold text-white">A+</p>
              <p className="mt-2 text-sm text-slate-400">Client satisfaction and project momentum are both strong.</p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05, ease: 'easeInOut' }}
        className="grid gap-6 xl:grid-cols-4"
      >
        {stats.map((item) => (
          <div
            key={item.label}
            className="glass-card rounded-[28px] border border-white/10 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.22)]"
          >
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-linear-to-br from-primary-purple/20 to-accent-blue/20 text-white shadow-[0_12px_24px_rgba(124,58,237,0.2)]">
              <item.icon strokeWidth={1.75} className="h-5 w-5" />
            </div>
            <p className="mt-5 text-sm uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
            <div className={`mt-4 h-2 rounded-full bg-white/10 bg-linear-to-r ${item.accent}`} />
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease: 'easeInOut' }}
        className="grid gap-6 xl:grid-cols-[1.4fr_0.7fr]"
      >
        <section className="glass-card rounded-4xl border border-white/10 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Project highlights</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Active delivery scores</h2>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full bg-primary-purple px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110">
              <ArrowUpRight strokeWidth={1.75} className="h-4 w-4" />
              Open project board
            </button>
          </div>

          <div className="mt-8 space-y-5">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-400">Due {item.due} · {item.status}</p>
                  </div>
                  <div className="rounded-full bg-white/5 px-3 py-1 text-sm font-semibold text-white">{item.value}</div>
                </div>
                <div className="mt-4 h-2 rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-linear-to-r from-primary-purple to-accent-blue" style={{ width: item.value }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6">
          <div className="glass-card rounded-4xl border border-white/10 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Upcoming meetings</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Next sessions</h3>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">3 scheduled</span>
            </div>
            <div className="mt-6 space-y-4">
              {meetings.map((meeting) => (
                <div key={meeting.label} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">{meeting.label}</p>
                    <span className="text-sm text-slate-400">{meeting.time}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{meeting.participants}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-4xl border border-white/10 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Notifications</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Action required</h3>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">Latest</span>
            </div>
            <div className="mt-6 space-y-4">
              {notifications.map((note) => (
                <div key={note.title} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">{note.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{note.type} · {note.time}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15, ease: 'easeInOut' }}
        className="grid gap-6 xl:grid-cols-3"
      >
        <div className="glass-card rounded-4xl border border-white/10 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.24)] xl:col-span-2">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Recent files</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Deliverables</h3>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
              View all files
              <ArrowRight strokeWidth={1.75} className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-8 space-y-4">
            {files.map((file) => (
              <div key={file.name} className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-white">{file.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{file.type} · {file.size}</p>
                </div>
                <button className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15">
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-4xl border border-white/10 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Support</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Need assistance?</h3>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Reach out to your dedicated account team or open a support ticket for urgent requests.
          </p>
          <button className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary-purple px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110">
            Contact support
          </button>
        </div>
      </motion.div>
    </div>
  )
}
