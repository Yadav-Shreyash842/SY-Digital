import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  Loader2,
  ArrowUpRight,
  Calendar,
  Activity,
  FolderKanban,
  Check,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Badge from '../../components/ui/Badge'
import dashboardService from '../../services/dashboard.service'
import projectRequestService from '../../services/projectRequest.service'
import useSocket from '../../hooks/useSocket'

const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded-[28px] border border-white/10 bg-white/5 ${className}`} />
)

const statSkeletons = Array.from({ length: 4 }).map((_, i) => (
  <Skeleton key={i} className="p-6">
    <div className="flex items-center justify-between gap-3">
      <div className="h-12 w-12 rounded-3xl bg-white/10" />
      <div className="h-5 w-16 rounded-full bg-white/10" />
    </div>
    <div className="mt-6 h-4 w-24 rounded bg-white/10" />
    <div className="mt-3 h-8 w-28 rounded bg-white/10" />
  </Skeleton>
))

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(timeStr) {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':')
  const hour = Number(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  return `${((hour + 11) % 12) + 1}:${m} ${ampm}`
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.max(0, now - then)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function getStatusBadgeVariant(status) {
  const map = {
    pending: 'warning',
    approved: 'purple',
    completed: 'success',
    cancelled: 'danger',
    rejected: 'danger',
  }
  return map[status] || 'default'
}

export default function AdminDashboard() {
  const { connect } = useSocket()
  const [stats, setStats] = useState(null)
  const [monthlyAnalytics, setMonthlyAnalytics] = useState([])
  const [meetingStatusData, setMeetingStatusData] = useState([])
  const [recentMeetings, setRecentMeetings] = useState([])
  const [upcomingMeetings, setUpcomingMeetings] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [projectRequests, setProjectRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [approvingId, setApprovingId] = useState(null)

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    try {
      const [statsRes, recentRes, upcomingRes, activitiesRes, monthlyRes, statusRes] =
        await Promise.all([
          dashboardService.stats(),
          dashboardService.recentMeetings(),
          dashboardService.upcomingMeetings(),
          dashboardService.recentActivities(),
          dashboardService.monthlyAnalytics(),
          dashboardService.meetingStatusAnalytics(),
        ])

      if (statsRes?.success) setStats(statsRes.data)
      if (recentRes?.success) setRecentMeetings(recentRes.data)
      if (upcomingRes?.success) setUpcomingMeetings(upcomingRes.data)
      if (activitiesRes?.success) setRecentActivities(activitiesRes.data)
      if (monthlyRes?.success) setMonthlyAnalytics(monthlyRes.data)
      if (statusRes?.success) setMeetingStatusData(statusRes.data)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchProjectRequests = useCallback(async () => {
    try {
      const res = await projectRequestService.list({ limit: 10, status: 'pending' })
      const payload = res?.data
      setProjectRequests(payload?.requests || [])
    } catch {
      // silent
    }
  }, [])

  const fetchAll = useCallback(async () => {
    await Promise.all([fetchDashboard(), fetchProjectRequests()])
  }, [fetchDashboard, fetchProjectRequests])

  useEffect(() => { fetchAll() }, [fetchAll])

  useEffect(() => {
    const socket = connect()
    if (!socket) return
    const refresh = () => { fetchProjectRequests() }
    socket.on('newProjectRequest', refresh)
    socket.on('projectRequestUpdated', refresh)
    return () => {
      socket.off('newProjectRequest', refresh)
      socket.off('projectRequestUpdated', refresh)
    }
  }, [connect, fetchProjectRequests])

  const handleQuickApprove = async (req) => {
    setApprovingId(req._id)
    try {
      await projectRequestService.updateStatus(req._id, {
        status: 'approved',
        adminNotes: 'Approved from dashboard.',
      })
      toast.success(`Approved: ${req.title}`)
      fetchProjectRequests()
    } catch {
      toast.error('Failed to approve')
    } finally {
      setApprovingId(null)
    }
  }

  const statCards = useMemo(
    () => [
      {
        icon: CalendarCheck,
        label: 'Total Meetings',
        value: stats?.totalMeetings ?? 0,
        delta: '',
        tint: 'from-primary to-primary',
      },
      {
        icon: Clock,
        label: 'Pending',
        value: stats?.pendingMeetings ?? 0,
        delta: '',
        tint: 'from-accent-blue to-accent-cyan',
      },
      {
        icon: CheckCircle2,
        label: 'Approved',
        value: stats?.approvedMeetings ?? 0,
        delta: '',
        tint: 'from-primary to-primary',
      },
      {
        icon: CheckCircle2,
        label: 'Completed',
        value: stats?.completedMeetings ?? 0,
        delta: '',
        tint: 'from-accent-cyan to-accent-blue',
      },
    ],
    [stats]
  )

  const chartData = useMemo(() => {
    if (!monthlyAnalytics?.length) return []
    return monthlyAnalytics
      .filter((d) => d.month && d.year)
      .map((d) => ({
        month: `${MONTH_NAMES[d.month - 1]} ${d.year}`,
        meetings: d.totalMeetings,
      }))
  }, [monthlyAnalytics])

  const pieData = useMemo(() => {
    if (!meetingStatusData?.length) return []
    const colors = { pending: '#F59E0B', approved: '#EF4444', completed: '#10B981', cancelled: '#EF4444', rejected: '#EF4444' }
    return meetingStatusData.map((d) => ({
      name: d.status.charAt(0).toUpperCase() + d.status.slice(1),
      value: d.total,
      color: colors[d.status] || '#94a3b8',
    }))
  }, [meetingStatusData])

  if (loading) {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="h-4 w-48 rounded bg-white/10" />
              <div className="mt-3 h-9 w-80 rounded bg-white/10" />
              <div className="mt-3 h-5 w-96 rounded bg-white/10" />
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="h-11 w-32 rounded-full bg-white/10" />
              <div className="h-11 w-36 rounded-full bg-white/10" />
            </div>
          </div>
        </motion.div>
        <div className="grid gap-6 xl:grid-cols-4">{statSkeletons}</div>
        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
          <Skeleton className="p-6" style={{ minHeight: 400 }} />
          <Skeleton className="p-6" style={{ minHeight: 400 }} />
        </div>
      {projectRequests.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.22, ease: 'easeInOut' }}
          className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl"
        >
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-gradient-to-br from-warning to-orange-400">
                <FolderKanban strokeWidth={1.75} className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Action Required</p>
                <h2 className="text-2xl font-semibold text-white">Pending project requests</h2>
              </div>
            </div>
            <Link
              to="/admin/project-requests"
              className="inline-flex items-center gap-2 rounded-btn bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              View all
              <ArrowUpRight strokeWidth={1.75} className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {projectRequests.slice(0, 5).map((req) => (
              <div key={req._id} className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <p className="truncate font-semibold text-white">{req.title}</p>
                    <Badge variant="warning">{req.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    {req.clientName} &middot; {req.category} &middot; {formatDate(req.createdAt)}
                  </p>
                  {req.budget > 0 && (
                    <p className="mt-1 text-xs text-slate-500">Budget: INR {req.budget.toLocaleString()}</p>
                  )}
                </div>
                <button
                  onClick={() => handleQuickApprove(req)}
                  disabled={approvingId === req._id}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-success/15 px-5 py-2.5 text-sm font-semibold text-success transition hover:bg-success/25 disabled:opacity-50"
                >
                  {approvingId === req._id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check strokeWidth={2} className="h-4 w-4" />
                  )}
                  Approve
                </button>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
          <Skeleton className="p-6" style={{ minHeight: 320 }} />
          <Skeleton className="p-6" style={{ minHeight: 320 }} />
          <Skeleton className="p-6" style={{ minHeight: 320 }} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-accent-blue">Admin Dashboard</p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">Dashboard overview</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Real-time metrics for meetings, approvals, and team activity.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchAll}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
            >
              <Loader2 className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeInOut' }}
            className="rounded-[28px] border border-white/10 bg-white/5 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br ${stat.tint}`}>
                <stat.icon strokeWidth={1.75} className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="mt-6 text-sm uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{stat.value.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: 'easeInOut' }}
          className="rounded-[28px] border border-white/10 bg-white/5 p-4 sm:p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl"
        >
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Analytics</p>
              <h2 className="mt-2 text-xl font-semibold sm:text-2xl text-white">Monthly meetings</h2>
            </div>
          </div>
          <div className="h-[320px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="meetingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.14)" />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.96)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '14px',
                      color: '#fff',
                    }}
                    formatter={(value) => [value, 'Meetings']}
                  />
                  <Area type="monotone" dataKey="meetings" stroke="#EF4444" strokeWidth={2.5} fill="url(#meetingGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">No data available</div>
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: 'easeInOut' }}
          className="rounded-[28px] border border-white/10 bg-white/5 p-4 sm:p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl"
        >
          <div className="mb-4">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Status</p>
            <h2 className="text-xl font-semibold sm:text-2xl text-white">Meeting status</h2>
          </div>
          <div className="h-52">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">No data</div>
            )}
          </div>
          <div className="mt-4 grid gap-3">
            {pieData.map((segment) => (
              <div key={segment.name} className="flex items-center gap-3 rounded-[20px] bg-white/5 px-4 py-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: segment.color }} />
                <div>
                  <p className="text-sm font-semibold text-white">{segment.name}</p>
                  <p className="text-xs text-slate-400">{segment.value} meeting{segment.value !== 1 ? 's' : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25, ease: 'easeInOut' }}
          className="rounded-[28px] border border-white/10 bg-white/5 p-4 sm:p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Calendar</p>
              <h2 className="text-xl font-semibold sm:text-2xl text-white">Upcoming meetings</h2>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
              {upcomingMeetings.length} event{upcomingMeetings.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="space-y-4">
            {upcomingMeetings.length > 0 ? (
              upcomingMeetings.map((meeting) => (
                <div key={meeting._id} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-white">{meeting.name}</p>
                    <Badge variant={getStatusBadgeVariant(meeting.status)}>
                      {meeting.status}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(meeting.meetingDate)}
                    <Clock className="ml-1 h-3.5 w-3.5" />
                    {formatTime(meeting.meetingTime)}
                  </div>
                  <div className="mt-2 text-sm text-slate-300">
                    {meeting.service?.title && <span>{meeting.service.title} &middot; </span>}
                    {meeting.email}
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-slate-500">No upcoming meetings</p>
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28, ease: 'easeInOut' }}
          className="rounded-[28px] border border-white/10 bg-white/5 p-4 sm:p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Activity</p>
              <h2 className="text-xl font-semibold sm:text-2xl text-white">Recent activity</h2>
            </div>
            <span className="rounded-full bg-accent-blue/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-accent-blue">Live</span>
          </div>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, idx) => (
                <div key={`${activity.meetingId}-${idx}`} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Activity className="h-3.5 w-3.5 text-accent-blue" />
                      <p className="font-semibold text-white">{activity.clientName}</p>
                    </div>
                    <span className="text-xs text-slate-400">{timeAgo(activity.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">
                    {activity.description || activity.action}
                  </p>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-slate-500">No recent activity</p>
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: 'easeInOut' }}
          className="rounded-[28px] border border-white/10 bg-white/5 p-4 sm:p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Meetings</p>
              <h2 className="text-xl font-semibold sm:text-2xl text-white">Recent requests</h2>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
              {recentMeetings.length}
            </span>
          </div>
          <div className="space-y-4">
            {recentMeetings.length > 0 ? (
              recentMeetings.map((meeting) => (
                <div key={meeting._id} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-white">{meeting.name}</p>
                    <Badge variant={getStatusBadgeVariant(meeting.status)}>
                      {meeting.status}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    {formatDate(meeting.createdAt)}
                  </p>
                  <div className="mt-2 text-sm text-slate-300">
                    {meeting.service?.title && <span>{meeting.service.title} &middot; </span>}
                    {meeting.email}
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-slate-500">No recent meetings</p>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
