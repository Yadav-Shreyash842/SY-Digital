import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FolderKanban,
  FileText,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Briefcase,
  ArrowUpRight,
  Loader2,
  ClipboardList,
} from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import useSocket from '../../hooks/useSocket'
import clientService from '../../services/client.service'
import toast from 'react-hot-toast'

export default function ClientDashboard() {
  const { user } = useAuth()
  const { connect } = useSocket()
  const fullName = user ? `${user.firstName} ${user.lastName}` : ''

  const [projects, setProjects] = useState([])
  const [meetings, setMeetings] = useState([])
  const [payments, setPayments] = useState([])
  const [messages, setMessages] = useState([])
  const [projectRequests, setProjectRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await clientService.dashboard()
        const data = res?.data || {}
        setProjects(data.projects || [])
        setMeetings(data.meetings || [])
        setPayments(data.payments || [])
        setMessages(data.messages || [])
        setProjectRequests(data.projectRequests || [])
      } catch {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    if (user) fetchAll()
  }, [user])

  useEffect(() => {
    const socket = connect()
    if (!socket) return

    const handleUpdate = () => {
      clientService.dashboard().then((res) => {
        const data = res?.data || {}
        setProjects(data.projects || [])
        setMeetings(data.meetings || [])
        setPayments(data.payments || [])
        setMessages(data.messages || [])
        setProjectRequests(data.projectRequests || [])
      }).catch(() => {})
    }

    socket.on('messageReplied', handleUpdate)
    socket.on('meetingStatusUpdated', handleUpdate)
    socket.on('meetingRescheduled', handleUpdate)
    socket.on('projectRequestUpdated', handleUpdate)

    return () => {
      socket.off('messageReplied', handleUpdate)
      socket.off('meetingStatusUpdated', handleUpdate)
      socket.off('meetingRescheduled', handleUpdate)
      socket.off('projectRequestUpdated', handleUpdate)
    }
  }, [connect])

  const now = new Date()
  const upcomingMeetings = useMemo(
    () => meetings.filter((m) => new Date(m.meetingDate) >= now && m.status !== 'cancelled').sort((a, b) => new Date(a.meetingDate) - new Date(b.meetingDate)),
    [meetings]
  )
  const unpaidInvoices = useMemo(() => payments.filter((p) => p.paymentStatus === 'pending'), [payments])
  const unreadMessages = useMemo(() => messages.filter((m) => m.status === 'unread'), [messages])

  const stats = [
    { icon: FolderKanban, label: 'Active projects', value: projects.length, accent: 'from-primary to-primary' },
    { icon: Briefcase, label: 'Upcoming meetings', value: upcomingMeetings.length, accent: 'from-accent-blue to-accent-cyan' },
    { icon: FileText, label: 'Pending invoices', value: unpaidInvoices.length, accent: 'from-warning to-orange-400' },
    { icon: MessageSquare, label: 'Unread messages', value: unreadMessages.length, accent: 'from-primary to-primary' },
  ]

  const highlights = projects.slice(0, 3).map((p) => ({
    title: p.title,
    status: p.status === 'published' ? 'Active' : p.status === 'archived' ? 'Completed' : 'Draft',
    category: p.category,
    due: p.completionDate ? new Date(p.completionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD',
  }))

  const recentMeetings = upcomingMeetings.slice(0, 3).map((m) => ({
    label: m.service?.title || 'Meeting',
    time: new Date(m.meetingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · ' + m.meetingTime,
    type: m.meetingType === 'online' ? 'Video Call' : 'In Person',
  }))

  const notifications = [
    ...unpaidInvoices.slice(0, 2).map((p) => ({
      title: `Payment of ${p.currency || 'INR'} ${p.amount} is pending`,
      type: 'Payment reminder',
    })),
    ...unreadMessages.slice(0, 2).map((m) => ({
      title: m.subject || 'New message',
      type: 'Message',
    })),
  ]

  const pendingRequests = projectRequests.filter((r) => r.status === 'pending' || r.status === 'reviewing')
  const recentRequests = projectRequests.slice(0, 4)

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

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
              <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.75} />
              Client Portal
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Welcome back, {user?.firstName || 'Client'}.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Monitor every engagement, view upcoming milestones, and stay aligned with the team from a premium dashboard experience.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:w-110">
            <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_48px_rgba(0,0,0,0.2)]">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Today</p>
              <p className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {upcomingMeetings.length} meeting{upcomingMeetings.length !== 1 ? 's' : ''} and {unpaidInvoices.length} pending payment{unpaidInvoices.length !== 1 ? 's' : ''}.
              </p>
            </div>
            <div className="rounded-[26px] border border-white/10 bg-linear-to-br from-primary/15 to-primary/10 p-5 shadow-[0_18px_48px_rgba(0,0,0,0.2)]">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Account</p>
              <p className="mt-3 text-2xl font-semibold text-white sm:text-3xl">{user?.role === 'admin' ? 'Admin' : 'Client'}</p>
              <p className="mt-2 text-sm text-slate-400">{fullName || user?.email}</p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05, ease: 'easeInOut' }}
        className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((item) => (
          <div
            key={item.label}
            className="glass-card rounded-[28px] border border-white/10 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.22)]"
          >
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-linear-to-br from-primary/20 to-primary/20 text-white shadow-[0_12px_24px_rgba(239,68,68,0.2)]">
              <item.icon strokeWidth={1.75} className="h-5 w-5" />
            </div>
            <p className="mt-5 text-sm uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
            <p className="mt-4 text-2xl font-semibold text-white sm:text-3xl">{item.value}</p>
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
              <h2 className="mt-3 text-xl font-semibold text-white sm:text-2xl">Active delivery scores</h2>
            </div>
            <Link
              to="/client/projects"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              <ArrowUpRight strokeWidth={1.75} className="h-4 w-4" />
              Open project board
            </Link>
          </div>

          <div className="mt-8 space-y-5">
            {highlights.length === 0 ? (
              <p className="text-sm text-slate-400">No projects yet. Your projects will appear here once assigned.</p>
            ) : (
              highlights.map((item) => (
                <div key={item.title} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-white">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-400">Due {item.due} · {item.status}</p>
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">{item.category}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="grid gap-6">
          <div className="glass-card rounded-4xl border border-white/10 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Upcoming meetings</p>
                <h3 className="mt-3 text-xl font-semibold text-white sm:text-2xl">Next sessions</h3>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">
                {upcomingMeetings.length} scheduled
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {recentMeetings.length === 0 ? (
                <p className="text-sm text-slate-400">No upcoming meetings.</p>
              ) : (
                recentMeetings.map((meeting) => (
                  <div key={meeting.label + meeting.time} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-white">{meeting.label}</p>
                      <span className="text-sm text-slate-400">{meeting.time}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{meeting.type}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass-card rounded-4xl border border-white/10 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Notifications</p>
                <h3 className="mt-3 text-xl font-semibold text-white sm:text-2xl">Action required</h3>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">Latest</span>
            </div>
            <div className="mt-6 space-y-4">
              {notifications.length === 0 ? (
                <p className="text-sm text-slate-400">All caught up! No pending actions.</p>
              ) : (
                notifications.map((note) => (
                  <div key={note.title} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                    <p className="font-semibold text-white">{note.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{note.type}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </motion.div>

      {recentRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12, ease: 'easeInOut' }}
        >
          <section className="glass-card rounded-4xl border border-white/10 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-linear-to-br from-warning/20 to-orange-400/20">
                  <ClipboardList strokeWidth={1.75} className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Project Requests</p>
                  <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                    {pendingRequests.length > 0 ? `${pendingRequests.length} pending review` : 'Your requests'}
                  </h2>
                </div>
              </div>
              <Link
                to="/client/request-project"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                <ArrowUpRight strokeWidth={1.75} className="h-4 w-4" />
                New request
              </Link>
            </div>
            <div className="mt-8 space-y-4">
              {recentRequests.map((req) => (
                <div key={req._id} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-semibold text-white">{req.title}</p>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                          req.status === 'approved' ? 'bg-success/15 text-success' :
                          req.status === 'rejected' ? 'bg-danger/15 text-danger' :
                          req.status === 'reviewing' ? 'bg-accent-blue/15 text-accent-blue' :
                          'bg-warning/15 text-warning'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-400">
                        {req.category} &middot; Submitted {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    {req.projectId && (
                      <Link
                        to="/client/projects"
                        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
                      >
                        View project
                        <ArrowRight strokeWidth={1.75} className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15, ease: 'easeInOut' }}
        className="grid gap-6 xl:grid-cols-2"
      >
        <div className="glass-card rounded-4xl border border-white/10 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Quick actions</p>
          <h3 className="mt-3 text-xl font-semibold text-white sm:text-2xl">Navigate your portal</h3>
          <div className="mt-6 space-y-3">
            {[
              { to: '/client/projects', label: 'View Projects', desc: 'Track progress across all engagements' },
              { to: '/client/request-project', label: 'Request Project', desc: 'Submit a new project idea' },
              { to: '/client/meetings', label: 'View Meetings', desc: 'Check upcoming session schedule' },
              { to: '/client/invoices', label: 'View Invoices', desc: 'Review billing and payment history' },
              { to: '/client/messages', label: 'View Messages', desc: 'Respond to team communications' },
            ].map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="flex items-center justify-between rounded-[24px] border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
              >
                <div>
                  <p className="font-semibold text-white">{action.label}</p>
                  <p className="text-sm text-slate-400">{action.desc}</p>
                </div>
                <ArrowRight strokeWidth={1.75} className="h-4 w-4 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-4xl border border-white/10 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Support</p>
          <h3 className="mt-3 text-xl font-semibold text-white sm:text-2xl">Need assistance?</h3>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Reach out to your dedicated account team or send a message for urgent requests.
          </p>
          <Link
            to="/client/messages"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Contact support
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
