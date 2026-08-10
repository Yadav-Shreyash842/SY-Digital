import { useState, useEffect, useCallback, useMemo } from 'react'
import { BarChart3, TrendingUp, Users, Eye } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import StatsCard from '../../components/cards/StatsCard'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import analyticsService from '../../services/analytics.service'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const bucketByMonth = (traffic = []) => {
  const map = new Map()
  for (const item of traffic) {
    const date = new Date(item.date)
    if (Number.isNaN(date.getTime())) continue
    const key = `${date.getFullYear()}-${date.getMonth()}`
    const entry = map.get(key) || { visits: 0, conversions: 0, label: MONTHS[date.getMonth()] }
    entry.visits += item.views || 0
    entry.conversions += item.conversions || 0
    map.set(key, entry)
  }
  return [...map.values()]
    .sort((a, b) => MONTHS.indexOf(a.label) - MONTHS.indexOf(b.label))
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [pageViews, setPageViews] = useState(null)
  const [uniqueVisitors, setUniqueVisitors] = useState(null)
  const [conversionRate, setConversionRate] = useState(null)
  const [bounceRate, setBounceRate] = useState(null)
  const [chartData, setChartData] = useState([])

  const fetchStats = useCallback(async () => {
    try {
      const [statsRes, trafficRes] = await Promise.all([
        analyticsService.visitorStats('12m'),
        analyticsService.traffic('12m'),
      ])
      if (statsRes?.success) {
        setPageViews(statsRes.data.pageViews)
        setUniqueVisitors(statsRes.data.uniqueVisitors)
        setConversionRate(statsRes.data.conversionRate)
        setBounceRate(statsRes.data.bounceRate)
      }
      const traffic = trafficRes?.data || []
      setChartData(bucketByMonth(traffic))
    } catch {
      setPageViews(null)
      setUniqueVisitors(null)
      setConversionRate(null)
      setBounceRate(null)
      setChartData([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchStats() }, [fetchStats])

  const formatCount = (val) => {
    if (val === null || val === undefined) return '—'
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K'
    return val.toLocaleString()
  }

  const stats = useMemo(
    () => [
      { icon: Eye, label: 'Page Views', value: loading ? '...' : formatCount(pageViews), color: 'from-primary to-primary' },
      { icon: Users, label: 'Unique Visitors', value: loading ? '...' : formatCount(uniqueVisitors), color: 'from-accent-blue to-accent-cyan', index: 1 },
      { icon: TrendingUp, label: 'Conversion Rate', value: loading ? '...' : `${conversionRate ?? '—'}%`, color: 'from-primary to-primary', index: 2 },
      { icon: BarChart3, label: 'Bounce Rate', value: loading ? '...' : `${bounceRate ?? '—'}%`, color: 'from-accent-cyan to-accent-blue', index: 3 },
    ],
    [loading, pageViews, uniqueVisitors, conversionRate, bounceRate]
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Track website performance and user engagement" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, idx) => (
          <StatsCard
            key={item.label}
            icon={item.icon}
            label={item.label}
            value={item.value}
            color={item.color}
            index={idx}
          />
        ))}
      </div>
      <div className="rounded-card border border-border bg-card-bg p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-bold text-white">Traffic Overview</h2>
        <div className="h-72">
          {chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-text-secondary">
                {loading ? 'Loading traffic data...' : 'No traffic data available yet'}
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="label" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0' }} />
                <Area type="monotone" dataKey="visits" name="Visits" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} strokeWidth={2} />
                <Area type="monotone" dataKey="conversions" name="Conversions" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
