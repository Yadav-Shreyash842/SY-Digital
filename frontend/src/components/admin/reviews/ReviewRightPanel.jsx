import { motion } from 'framer-motion'
import {
  BarChart3, Tag, User, Mail, Building2, Star, Clock, ExternalLink,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell,
} from 'recharts'
import { cn } from '../../../utils/cn'
import Badge from '../../ui/Badge'

const BAR_COLORS = ['#EF4444', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444']

function RatingChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[180px] items-center justify-center text-sm text-text-muted">
        No data
      </div>
    )
  }

  return (
    <div className="h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#94A3B8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#94A3B8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,23,42,0.96)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '13px',
            }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40}>
            {data.map((_, idx) => (
              <Cell key={idx} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
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

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function StarRating({ value }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          strokeWidth={1.75}
          className={cn(
            'h-3.5 w-3.5',
            star <= value ? 'fill-warning text-warning' : 'text-text-muted',
          )}
        />
      ))}
    </div>
  )
}

export default function ReviewRightPanel({ review, ratingDistribution }) {
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
          {review ? review.clientName : 'Review Overview'}
        </h3>
      </motion.div>

      {review ? (
        <motion.div
          key={review._id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden rounded-[20px] border border-white/10 bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl"
        >
          <div className={cn('space-y-4 p-5')}>
            <div className="flex items-start gap-4">
              {review.profileImage?.url ? (
                <img
                  src={review.profileImage.url}
                  alt={review.clientName}
                  className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/20 text-lg font-bold text-primary">
                  {review.clientName?.charAt(0)?.toUpperCase() || 'R'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-bold text-white">{review.clientName}</h4>
                    <p className="text-xs text-text-muted">{review.clientEmail}</p>
                  </div>
                  <Badge variant={review.status === 'approved' ? 'success' : review.status === 'rejected' ? 'danger' : 'warning'}>
                    {review.status}
                  </Badge>
                </div>
              </div>
            </div>

            <StarRating value={review.rating} />

            {review.review && (
              <p className="text-sm leading-relaxed text-text-secondary line-clamp-4">
                {review.review}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
              {review.service?.title && (
                <Badge variant="blue">{review.service.title}</Badge>
              )}
              {review.featured && (
                <div className="flex items-center gap-1 text-warning">
                  <Star strokeWidth={1.75} className="h-3.5 w-3.5 fill-warning" />
                  Featured
                </div>
              )}
            </div>

            <a
              href="#"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              <ExternalLink strokeWidth={1.75} className="h-4 w-4" />
              View full review
            </a>
          </div>
        </motion.div>
      ) : (
        <div className="rounded-[20px] border border-white/10 bg-white/5 p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
            <BarChart3 strokeWidth={1.75} className="h-6 w-6 text-text-muted" />
          </div>
          <p className="text-sm text-text-muted">Select a review from the table to preview its details.</p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08, ease: 'easeInOut' }}
        className="rounded-[20px] border border-white/10 bg-white/5 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl"
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/20">
            <BarChart3 strokeWidth={1.75} className="h-4 w-4 text-primary" />
          </div>
          <p className="text-sm font-semibold text-white">Rating Distribution</p>
        </div>
        <RatingChart data={ratingDistribution} />
      </motion.div>

      {review && (
        <motion.div
          key={`info-${review._id}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12, ease: 'easeInOut' }}
          className="space-y-3 rounded-[20px] border border-white/10 bg-white/5 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl"
        >
          <p className="mb-3 text-sm font-semibold text-white">Quick Info</p>
          <QuickInfoRow icon={User} label="Client" value={review.clientName} />
          <QuickInfoRow icon={Mail} label="Email" value={review.clientEmail} />
          {review.company && <QuickInfoRow icon={Building2} label="Company" value={review.company} />}
          <QuickInfoRow icon={Tag} label="Service" value={review.service?.title || 'N/A'} />
          <QuickInfoRow icon={Star} label="Rating" value={`${review.rating} / 5`} />
          <QuickInfoRow icon={Clock} label="Created" value={formatDate(review.createdAt)} />
        </motion.div>
      )}
    </div>
  )
}
