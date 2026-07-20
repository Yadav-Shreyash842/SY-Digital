import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Video, Sparkles, Loader2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import useAuth from '../../hooks/useAuth'
import useSocket from '../../hooks/useSocket'
import clientService from '../../services/client.service'
import toast from 'react-hot-toast'

export default function ClientMeetingsPage() {
  const { user } = useAuth()
  const { connect } = useSocket()
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMeetings = async () => {
    try {
      const res = await clientService.meetings()
      setMeetings(res?.data || [])
    } catch {
      toast.error('Failed to load meetings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchMeetings()
  }, [user])

  useEffect(() => {
    const socket = connect()
    if (!socket) return

    const handleUpdate = () => { fetchMeetings() }

    socket.on('meetingStatusUpdated', handleUpdate)
    socket.on('meetingRescheduled', handleUpdate)
    socket.on('meetingCancelled', handleUpdate)

    return () => {
      socket.off('meetingStatusUpdated', handleUpdate)
      socket.off('meetingRescheduled', handleUpdate)
      socket.off('meetingCancelled', handleUpdate)
    }
  }, [connect])

  const now = new Date()

  const upcoming = useMemo(
    () =>
      meetings
        .filter((m) => new Date(m.meetingDate) >= now && m.status !== 'cancelled' && m.status !== 'rejected')
        .sort((a, b) => new Date(a.meetingDate) - new Date(b.meetingDate)),
    [meetings]
  )

  const past = useMemo(
    () =>
      meetings
        .filter((m) => new Date(m.meetingDate) < now || m.status === 'completed' || m.status === 'cancelled' || m.status === 'rejected')
        .sort((a, b) => new Date(b.meetingDate) - new Date(a.meetingDate)),
    [meetings]
  )

  const statusVariant = {
    pending: 'warning',
    approved: 'blue',
    completed: 'success',
    cancelled: 'danger',
    rejected: 'danger',
  }

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

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
              <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.75} />
              Meeting hub
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              Access your upcoming schedule, session notes, and quick actions from a premium client workspace.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full bg-white/5 px-4 py-3 text-sm text-slate-300">
            {meetings.length} total meeting{meetings.length !== 1 ? 's' : ''}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.85fr]">
        <div className="space-y-6">
          {upcoming.length > 0 && (
            <>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Upcoming</p>
              {upcoming.map((meeting, index) => (
                <motion.article
                  key={meeting._id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.07, ease: 'easeInOut' }}
                  className="glass-card rounded-[30px] border border-white/10 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {meeting.service?.title || 'Meeting'}
                      </h2>
                      <p className="mt-2 text-sm text-slate-400">{meeting.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusVariant[meeting.status] || 'default'}>{meeting.status}</Badge>
                      <Badge variant="blue">{meeting.meetingType === 'online' ? 'Video Call' : 'In Person'}</Badge>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar strokeWidth={1.75} className="h-4 w-4" />
                        <span className="text-sm">{formatDate(meeting.meetingDate)}</span>
                      </div>
                    </div>
                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Clock strokeWidth={1.75} className="h-4 w-4" />
                        <span className="text-sm">{meeting.meetingTime}</span>
                      </div>
                    </div>
                  </div>

                  {meeting.adminNotes && (
                    <div className="mt-4 rounded-[24px] border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Notes</p>
                      <p className="mt-1 text-sm text-slate-300">{meeting.adminNotes}</p>
                    </div>
                  )}

                  {meeting.meetingLink && (
                    <div className="mt-4 flex items-center gap-3 text-sm text-slate-400">
                      <Video strokeWidth={1.75} className="h-4 w-4" />
                      <a href={meeting.meetingLink} target="_blank" rel="noreferrer" className="text-accent-blue hover:underline">
                        Join meeting link
                      </a>
                    </div>
                  )}
                </motion.article>
              ))}
            </>
          )}

          {past.length > 0 && (
            <>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400 mt-4">Past</p>
              {past.map((meeting, index) => (
                <motion.article
                  key={meeting._id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeInOut' }}
                  className="glass-card rounded-[30px] border border-white/10 p-6 opacity-70"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {meeting.service?.title || 'Meeting'}
                      </h2>
                      <p className="mt-2 text-sm text-slate-400">{meeting.name}</p>
                    </div>
                    <Badge variant={statusVariant[meeting.status] || 'default'}>{meeting.status}</Badge>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar strokeWidth={1.75} className="h-4 w-4" />
                        <span className="text-sm">{formatDate(meeting.meetingDate)}</span>
                      </div>
                    </div>
                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Clock strokeWidth={1.75} className="h-4 w-4" />
                        <span className="text-sm">{meeting.meetingTime}</span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </>
          )}

          {upcoming.length === 0 && past.length === 0 && (
            <div className="rounded-[30px] border border-white/10 bg-white/5 p-12 text-center">
              <p className="text-slate-400">No meetings found.</p>
            </div>
          )}
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
              <h3 className="text-lg font-semibold text-white">Schedule summary</h3>
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Upcoming</p>
                <p className="mt-1 text-xl font-semibold text-white">{upcoming.length}</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Completed</p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {meetings.filter((m) => m.status === 'completed').length}
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Cancelled</p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {meetings.filter((m) => m.status === 'cancelled').length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.14, ease: 'easeInOut' }}
            className="glass-card rounded-[30px] border border-white/10 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)]"
          >
            <div className="flex items-center gap-3 text-slate-300">
              <Video strokeWidth={1.75} className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-white">Remote sessions</h3>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              {upcoming.filter((m) => m.meetingType === 'online').length} online meeting{upcoming.filter((m) => m.meetingType === 'online').length !== 1 ? 's' : ''} upcoming. Use the join link to connect directly to video calls.
            </p>
          </motion.div>
        </aside>
      </div>
    </div>
  )
}
