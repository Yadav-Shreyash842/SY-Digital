import { motion } from 'framer-motion'
import {
  BarChart3, Tag, User, Clock, Eye, Star, ExternalLink,
} from 'lucide-react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts'
import { cn } from '../../../utils/cn'
import Badge from '../../ui/Badge'

const RADIAN = Math.PI / 180

function renderCustomizedLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const PIE_COLORS = ['#EF4444', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6']

function CategoryChart({ data }) {
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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={78}
            paddingAngle={3}
            dataKey="value"
            label={renderCustomizedLabel}
            labelLine={false}
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'rgba(15,23,42,0.96)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '13px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        {data.map((entry, idx) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
            <span className="text-xs text-text-muted">{entry.name}</span>
          </div>
        ))}
      </div>
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

export default function BlogRightPanel({ blog, categoryDistribution }) {
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
          {blog ? blog.title : 'Blog Overview'}
        </h3>
      </motion.div>

      {blog ? (
        <motion.div
          key={blog._id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden rounded-[20px] border border-white/10 bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl"
        >
          {blog.featuredImage?.url && (
            <div className="relative h-40 w-full overflow-hidden">
              <img
                src={blog.featuredImage.url}
                alt={blog.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent" />
            </div>
          )}

          <div className={cn('space-y-4 p-5', !blog.featuredImage?.url && 'pt-5')}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-lg font-bold text-white">{blog.title}</h4>
                <p className="mt-0.5 text-xs text-text-muted">
                  {blog.category?.charAt(0).toUpperCase() + blog.category?.slice(1)}
                </p>
              </div>
              <Badge variant={blog.status === 'published' ? 'success' : blog.status === 'archived' ? 'warning' : 'gray'}>
                {blog.status}
              </Badge>
            </div>

            {blog.shortDescription && (
              <p className="text-sm leading-relaxed text-text-secondary">
                {blog.shortDescription}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
              {blog.author && (
                <div className="flex items-center gap-1.5">
                  <User strokeWidth={1.75} className="h-3.5 w-3.5" />
                  {blog.author}
                </div>
              )}
              {blog.readTime && (
                <div className="flex items-center gap-1.5">
                  <Clock strokeWidth={1.75} className="h-3.5 w-3.5" />
                  {blog.readTime} min read
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Eye strokeWidth={1.75} className="h-3.5 w-3.5" />
                {blog.views || 0} views
              </div>
              {blog.isFeatured && (
                <div className="flex items-center gap-1.5 text-warning">
                  <Star strokeWidth={1.75} className="h-3.5 w-3.5 fill-warning" />
                  Featured
                </div>
              )}
            </div>

            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {blog.tags.map((t) => (
                  <span key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs text-text-secondary">
                    {t}
                  </span>
                ))}
              </div>
            )}

            <a
              href={`/blog/${blog.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              <ExternalLink strokeWidth={1.75} className="h-4 w-4" />
              View on site
            </a>
          </div>
        </motion.div>
      ) : (
        <div className="rounded-[20px] border border-white/10 bg-white/5 p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
            <BarChart3 strokeWidth={1.75} className="h-6 w-6 text-text-muted" />
          </div>
          <p className="text-sm text-text-muted">Select a blog post from the table to preview its details.</p>
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
          <p className="text-sm font-semibold text-white">Category Distribution</p>
        </div>
        <CategoryChart data={categoryDistribution} />
      </motion.div>

      {blog && (
        <motion.div
          key={`info-${blog._id}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12, ease: 'easeInOut' }}
          className="space-y-3 rounded-[20px] border border-white/10 bg-white/5 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl"
        >
          <p className="mb-3 text-sm font-semibold text-white">Quick Info</p>
          <QuickInfoRow icon={Tag} label="Category" value={blog.category?.charAt(0).toUpperCase() + blog.category?.slice(1)} />
          <QuickInfoRow icon={User} label="Author" value={blog.author || '-'} />
          <QuickInfoRow icon={Eye} label="Views" value={(blog.views || 0).toLocaleString()} />
          <QuickInfoRow icon={Clock} label="Read Time" value={blog.readTime ? `${blog.readTime} min` : '-'} />
          <QuickInfoRow icon={Star} label="Featured" value={blog.isFeatured ? 'Yes' : 'No'} />
          <QuickInfoRow icon={Clock} label="Created" value={formatDate(blog.createdAt)} />
        </motion.div>
      )}
    </div>
  )
}
