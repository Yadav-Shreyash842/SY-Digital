import { motion } from 'framer-motion'
import {
  BarChart3, User, Mail, Phone, Calendar, Clock, MapPin, Video, IndianRupee,
} from 'lucide-react'
import { cn } from '../../../utils/cn'
import Badge from '../../ui/Badge'

const statusVariant = {
  pending: 'warning',
  approved: 'success',
  completed: 'blue',
  cancelled: 'danger',
  rejected: 'gray',
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function QuickInfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
        <Icon strokeWidth={1.75} className="h-4 w-4 text-text-muted" />
      </div>
      <div>
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  )
}

export default function MeetingRightPanel({ meeting, statusDistribution }) {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
          Preview
        </p>
        <h3 className="text-lg font-bold text-white">
          {meeting ? meeting.name : 'Meeting Overview'}
        </h3>
      </motion.div>

      {meeting ? (
        <motion.div
          key={meeting._id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden rounded-[20px] border border-white/10 bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl"
        >
          <div className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-lg font-bold text-white">{meeting.name}</h4>
                <p className="mt-0.5 text-xs text-text-muted">{meeting.email}</p>
              </div>
              <Badge variant={statusVariant[meeting.status] || 'gray'}>
                {meeting.status?.charAt(0).toUpperCase() + meeting.status?.slice(1)}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">{meeting.service?.title || 'Service'}</Badge>
              <Badge variant={meeting.meetingType === 'online' ? 'blue' : 'primary'}>
                {meeting.meetingType === 'online' ? 'Online' : 'Offline'}
              </Badge>
            </div>

            {meeting.projectRequirements && (
              <p className="text-sm leading-relaxed text-text-secondary">
                {meeting.projectRequirements}
              </p>
            )}

            {meeting.meetingType === 'online' && meeting.meetingLink && (
              <a
                href={meeting.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                <Video strokeWidth={1.75} className="h-4 w-4" />
                Join Meeting
              </a>
            )}

            {meeting.meetingType === 'offline' && meeting.officeAddress && (
              <div className="flex items-start gap-2 text-sm text-text-secondary">
                <MapPin strokeWidth={1.75} className="mt-0.5 h-4 w-4 flex-shrink-0 text-text-muted" />
                {meeting.officeAddress}
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="rounded-[20px] border border-white/10 bg-white/5 p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
            <BarChart3 strokeWidth={1.75} className="h-6 w-6 text-text-muted" />
          </div>
          <p className="text-sm text-text-muted">Select a meeting from the list to preview its details.</p>
        </div>
      )}

      {meeting && (
        <motion.div
          key={`info-${meeting._id}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08, ease: 'easeInOut' }}
          className="space-y-3 rounded-[20px] border border-white/10 bg-white/5 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl"
        >
          <p className="mb-3 text-sm font-semibold text-white">Quick Info</p>
          <QuickInfoRow icon={User} label="Client" value={meeting.name} />
          <QuickInfoRow icon={Mail} label="Email" value={meeting.email} />
          <QuickInfoRow icon={Phone} label="Phone" value={meeting.phone || '—'} />
          <QuickInfoRow icon={Calendar} label="Date" value={formatDate(meeting.meetingDate)} />
          <QuickInfoRow icon={Clock} label="Time" value={meeting.meetingTime || '—'} />
          <QuickInfoRow icon={IndianRupee} label="Budget" value={`₹${(meeting.budget || 0).toLocaleString()}`} />
        </motion.div>
      )}

      {statusDistribution && statusDistribution.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12, ease: 'easeInOut' }}
          className="rounded-[20px] border border-white/10 bg-white/5 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/20">
              <BarChart3 strokeWidth={1.75} className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm font-semibold text-white">Status Distribution</p>
          </div>
          <div className="space-y-2">
            {statusDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-2.5">
                <span className="text-sm text-text-secondary capitalize">{item.name}</span>
                <span className="text-sm font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
