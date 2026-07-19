import { motion } from 'framer-motion'
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  MessageCircle,
  ArrowUpRight,
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

const quickStats = [
  { icon: DollarSign, label: 'Revenue', value: '$842.5K', delta: '+12.5%', tint: 'from-primary-purple to-secondary-purple' },
  { icon: Users, label: 'Clients', value: '1,429', delta: '+8.2%', tint: 'from-accent-blue to-accent-cyan' },
  { icon: ShoppingCart, label: 'Orders', value: '384', delta: '+15.3%', tint: 'from-secondary-purple to-primary-purple' },
  { icon: TrendingUp, label: 'Growth', value: '23.8%', delta: '+4.1%', tint: 'from-accent-cyan to-accent-blue' },
]

const revenueData = [
  { month: 'Jan', revenue: 42000 },
  { month: 'Feb', revenue: 48000 },
  { month: 'Mar', revenue: 45000 },
  { month: 'Apr', revenue: 52000 },
  { month: 'May', revenue: 58000 },
  { month: 'Jun', revenue: 62000 },
  { month: 'Jul', revenue: 68000 },
  { month: 'Aug', revenue: 72000 },
]

const segmentData = [
  { name: 'Web Dev', value: 35, color: '#7C3AED' },
  { name: 'Design', value: 28, color: '#3B82F6' },
  { name: 'Marketing', value: 22, color: '#22D3EE' },
  { name: 'Growth', value: 15, color: '#8B5CF6' },
]

const meetings = [
  { title: 'Project Sync', time: 'Today • 11:00 AM', platform: 'Google Meet', attendees: 4 },
  { title: 'Design Review', time: 'May 22 • 2:00 PM', platform: 'Zoom', attendees: 5 },
  { title: 'Client Check-in', time: 'May 24 • 4:00 PM', platform: 'Teams', attendees: 3 },
]

const messages = [
  { sender: 'Alicia Green', text: 'The latest KPI deck is ready for review.', time: '2m ago' },
  { sender: 'Mason Lee', text: 'Please confirm the budget for the new sprint.', time: '1h ago' },
  { sender: 'Diana Ross', text: 'Client approval came through for the website.', time: '3h ago' },
]

export default function AdminDashboard() {
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
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Welcome back, John!</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              A premium command center for revenue, workflow analytics, team activity, and live project insights.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-purple to-accent-blue px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-purple/25 transition hover:brightness-110">
              <ArrowUpRight className="h-4 w-4" />
              Add Project
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              <MessageCircle className="h-4 w-4 text-accent-blue" />
              New Message
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-4">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeInOut' }}
            className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br ${stat.tint}`}>
                <stat.icon strokeWidth={1.75} className="h-5 w-5 text-white" />
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">{stat.delta}</span>
            </div>
            <p className="mt-6 text-sm uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: 'easeInOut' }}
          className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl"
        >
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Revenue</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Revenue overview</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10">This week</button>
              <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10">This month</button>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.14)" />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.96)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '14px',
                    color: '#fff',
                  }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={2.5} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: 'easeInOut' }}
          className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl"
        >
          <div className="mb-4">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Services</p>
            <h2 className="text-2xl font-semibold text-white">Service distribution</h2>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={segmentData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {segmentData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid gap-3">
            {segmentData.map((segment) => (
              <div key={segment.name} className="flex items-center gap-3 rounded-[20px] bg-white/5 px-4 py-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: segment.color }} />
                <div>
                  <p className="text-sm font-semibold text-white">{segment.name}</p>
                  <p className="text-xs text-slate-400">{segment.value}% of revenue</p>
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
          className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Calendar</p>
              <h2 className="text-2xl font-semibold text-white">Upcoming meetings</h2>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">3 events</span>
          </div>
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div key={meeting.title} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">{meeting.title}</p>
                <p className="mt-2 text-sm text-slate-400">{meeting.time}</p>
                <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
                  <span>{meeting.platform}</span>
                  <span>{meeting.attendees} people</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28, ease: 'easeInOut' }}
          className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Activity</p>
              <h2 className="text-2xl font-semibold text-white">Recent messages</h2>
            </div>
            <span className="rounded-full bg-accent-blue/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-accent-blue">Live</span>
          </div>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.sender} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{message.sender}</p>
                  <span className="text-xs text-slate-400">{message.time}</span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{message.text}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: 'easeInOut' }}
          className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Portfolio</p>
              <h2 className="text-2xl font-semibold text-white">Service mix</h2>
            </div>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={segmentData} innerRadius={52} outerRadius={80} paddingAngle={4} dataKey="value">
                  {segmentData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid gap-3">
            {segmentData.map((segment) => (
              <div key={segment.name} className="flex items-center gap-3 rounded-[20px] bg-white/5 px-4 py-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: segment.color }} />
                <div>
                  <p className="text-sm font-semibold text-white">{segment.name}</p>
                  <p className="text-xs text-slate-400">{segment.value}% of revenue</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
