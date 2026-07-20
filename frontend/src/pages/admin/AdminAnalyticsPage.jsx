import { useState } from 'react'
import { BarChart3, TrendingUp, Users, Eye } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import StatsCard from '../../components/cards/StatsCard'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const chartData = [
  { month: 'Jan', visits: 12000, conversions: 840 },
  { month: 'Feb', visits: 14500, conversions: 1020 },
  { month: 'Mar', visits: 13200, conversions: 950 },
  { month: 'Apr', visits: 16800, conversions: 1280 },
  { month: 'May', visits: 19200, conversions: 1540 },
  { month: 'Jun', visits: 21500, conversions: 1820 },
]

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Track website performance and user engagement" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard icon={Eye} label="Page Views" value="215K" change="+18.2%" color="from-primary to-primary" />
        <StatsCard icon={Users} label="Unique Visitors" value="48.2K" change="+12.4%" color="from-accent-blue to-accent-cyan" index={1} />
        <StatsCard icon={TrendingUp} label="Conversion Rate" value="8.4%" change="+2.1%" color="from-primary to-primary" index={2} />
        <StatsCard icon={BarChart3} label="Bounce Rate" value="32.1%" change="-4.3%" positive={false} color="from-accent-cyan to-accent-blue" index={3} />
      </div>
      <div className="rounded-card border border-border bg-card-bg p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-bold text-white">Traffic Overview</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0' }} />
              <Area type="monotone" dataKey="visits" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="conversions" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
