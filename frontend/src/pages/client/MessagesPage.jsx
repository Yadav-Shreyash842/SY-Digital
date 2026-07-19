import { motion } from 'framer-motion'
import {
  MessageSquare,
  Sparkles,
  Send,
  Search,
  ArrowRight,
} from 'lucide-react'

const conversations = [
  {
    from: 'Sarah Johnson',
    role: 'Project Manager',
    latest: 'Please find the updated design attached.',
    time: '2m ago',
    unread: true,
  },
  {
    from: 'Michael Smith',
    role: 'Development',
    latest: 'When can we schedule the next review call?',
    time: '1h ago',
    unread: false,
  },
  {
    from: 'Emily Davis',
    role: 'Creative Lead',
    latest: 'We have reviewed the latest concept.',
    time: '3h ago',
    unread: false,
  },
  {
    from: 'David Wilson',
    role: 'QA Analyst',
    latest: 'Please share the latest update file.',
    time: '5h ago',
    unread: false,
  },
]

const messages = [
  { sender: 'Sarah Johnson', text: 'Thanks! Let me check and get back to you.', time: '10:24 AM', fromMe: false },
  { sender: 'John Doe', text: 'The review looks great. Please share the final assets.', time: '10:26 AM', fromMe: true },
  { sender: 'Sarah Johnson', text: 'Sharing the updated file now.', time: '10:28 AM', fromMe: false },
]

export default function MessagesPage() {
  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="glass-card rounded-4xl border border-white/10 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.24)]"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-300">
              <Sparkles className="h-4 w-4 text-primary-purple" strokeWidth={1.75} />
              Messages hub
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Keep your conversations flowing.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-400">
              Review the latest threads, reply instantly, and keep every project conversation aligned from one premium workspace.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-purple px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <Send strokeWidth={1.75} className="h-4 w-4" />
            Compose message
          </button>
        </div>
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.3fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08, ease: 'easeInOut' }}
          className="glass-card rounded-4xl border border-white/10 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)]"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-slate-300">
              <MessageSquare strokeWidth={1.75} className="h-5 w-5 text-primary-purple" />
              <h2 className="text-lg font-semibold text-white">Inbox</h2>
            </div>
            <div className="relative w-full sm:w-65">
              <Search strokeWidth={1.75} className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search messages..."
                className="h-12 w-full rounded-full border border-white/10 bg-slate-950/70 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20"
              />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {conversations.map((item) => (
              <button
                key={item.from}
                type="button"
                className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${
                  item.unread ? 'border-primary-purple/30 bg-primary-purple/10' : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{item.from}</p>
                    <p className="text-sm text-slate-400">{item.role}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.time}</span>
                </div>
                <p className="mt-3 text-sm text-slate-300">{item.latest}</p>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12, ease: 'easeInOut' }}
          className="glass-card rounded-4xl border border-white/10 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)]"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Live conversation</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Sarah Johnson</h3>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full bg-primary-purple px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110">
              <ArrowRight strokeWidth={1.75} className="h-4 w-4" />
              Reply
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-[24px] p-5 ${message.fromMe ? 'ml-auto bg-primary-purple/15 text-slate-100' : 'bg-white/5 text-slate-300'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{message.sender}</p>
                  <span className="text-xs text-slate-400">{message.time}</span>
                </div>
                <p className="mt-3 text-sm leading-7">{message.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/70 px-4 py-3">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-purple text-white transition hover:brightness-110">
              <Send strokeWidth={1.75} className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
