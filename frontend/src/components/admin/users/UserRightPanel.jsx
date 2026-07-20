import { motion } from 'framer-motion'
import { BarChart3, Mail, Phone, Shield, Calendar, User } from 'lucide-react'
import Badge from '../../ui/Badge'
import Avatar from '../../ui/Avatar'

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

export default function UserRightPanel({ user, roleDistribution }) {
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
          {user ? `${user.firstName} ${user.lastName}` : 'User Overview'}
        </h3>
      </motion.div>

      {user ? (
        <motion.div
          key={user._id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden rounded-[20px] border border-white/10 bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl"
        >
          <div className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar name={`${user.firstName} ${user.lastName}`} size="lg" />
                <div>
                  <h4 className="text-lg font-bold text-white">{user.firstName} {user.lastName}</h4>
                  <p className="mt-0.5 text-xs text-text-muted">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant={user.role === 'admin' ? 'primary' : 'blue'}>
                {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
              </Badge>
              <Badge variant={user.isVerified ? 'success' : 'warning'}>
                {user.isVerified ? 'Verified' : 'Unverified'}
              </Badge>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="rounded-[20px] border border-white/10 bg-white/5 p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
            <BarChart3 strokeWidth={1.75} className="h-6 w-6 text-text-muted" />
          </div>
          <p className="text-sm text-text-muted">Select a user from the list to preview their details.</p>
        </div>
      )}

      {user && (
        <motion.div
          key={`info-${user._id}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08, ease: 'easeInOut' }}
          className="space-y-3 rounded-[20px] border border-white/10 bg-white/5 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl"
        >
          <p className="mb-3 text-sm font-semibold text-white">Quick Info</p>
          <QuickInfoRow icon={User} label="Full Name" value={`${user.firstName} ${user.lastName}`} />
          <QuickInfoRow icon={Mail} label="Email" value={user.email} />
          <QuickInfoRow icon={Phone} label="Phone" value={user.phone || '—'} />
          <QuickInfoRow icon={Shield} label="Role" value={user.role?.charAt(0).toUpperCase() + user.role?.slice(1)} />
          <QuickInfoRow icon={Calendar} label="Joined" value={formatDate(user.createdAt)} />
        </motion.div>
      )}

      {roleDistribution && roleDistribution.length > 0 && (
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
            <p className="text-sm font-semibold text-white">Role Distribution</p>
          </div>
          <div className="space-y-2">
            {roleDistribution.map((item) => (
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
