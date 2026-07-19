import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Clock, Video, Users, Sparkles } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'

const meetings = [
  { title: 'Project Review — FinFlow', date: 'Jul 20, 2026', time: '2:00 PM', type: 'Video Call', attendees: 'Sarah, Marcus' },
  { title: 'Design Walkthrough', date: 'Jul 22, 2026', time: '10:00 AM', type: 'Video Call', attendees: 'Design team' },
  { title: 'Q3 Strategy Session', date: 'Jul 25, 2026', time: '3:30 PM', type: 'In Person', attendees: 'Leadership' },
]

export default function ClientMeetingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Meetings"
        description="Plan, review, and join your client meetings with clarity and confidence."
        theme="dark"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="glass-card rounded-[32px] border border-white/10 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.24)]"
      >
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">
              <Sparkles className="h-4 w-4 text-primary-purple" strokeWidth={1.75} />
              Meeting hub
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              Access your upcoming schedule, session notes, and quick actions from a premium client workspace.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-accent-blue px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110">
            Create new meeting
            <ArrowRight strokeWidth={1.75} className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.85fr]">
        <div className="space-y-6">
          {meetings.map((meeting, index) => (
            <motion.article
              key={meeting.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.07, ease: 'easeInOut' }}
              className="glass-card rounded-[30px] border border-white/10 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">{meeting.title}</h2>
                  <p className="mt-2 text-sm text-slate-400">{meeting.attendees}</p>
                </div>
                <Badge variant="blue">{meeting.type}</Badge>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar strokeWidth={1.75} className="h-4 w-4" />
                    <span className="text-sm">{meeting.date}</span>
                  </div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock strokeWidth={1.75} className="h-4 w-4" />
                    <span className="text-sm">{meeting.time}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 text-sm text-slate-400">
                <Users strokeWidth={1.75} className="h-4 w-4" />
                <span>Meeting agenda, notes, and next steps will appear here once confirmed.</span>
              </div>
            </motion.article>
          ))}
        </div>

        <aside className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1, ease: 'easeInOut' }}
            className="glass-card rounded-[30px] border border-white/10 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)]"
          >
            <div className="flex items-center gap-3 text-slate-300">
              <Clock strokeWidth={1.75} className="h-5 w-5 text-accent-blue" />
              <h3 className="text-lg font-semibold text-white">Today’s schedule</h3>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Your next meeting starts in 1 hour. Make sure your notes and assets are ready for review.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.14, ease: 'easeInOut' }}
            className="glass-card rounded-[30px] border border-white/10 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)]"
          >
            <div className="flex items-center gap-3 text-slate-300">
              <Video strokeWidth={1.75} className="h-5 w-5 text-primary-purple" />
              <h3 className="text-lg font-semibold text-white">Remote session</h3>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Use the join meeting feature to connect directly to video calls and review session details instantly.
            </p>
          </motion.div>
        </aside>
      </div>
    </div>
  )
}
