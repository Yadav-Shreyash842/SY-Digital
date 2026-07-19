import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight, Sparkles, Briefcase } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'

const projects = [
  {
    name: 'Website Redesign',
    category: 'UI/UX',
    progress: 75,
    status: 'In Progress',
    deadline: 'Jul 25, 2026',
    manager: 'Sarah Chen',
  },
  {
    name: 'Mobile App Development',
    category: 'Engineering',
    progress: 45,
    status: 'In Progress',
    deadline: 'Oct 10, 2026',
    manager: 'Marcus W.',
  },
  {
    name: 'SEO Optimization',
    category: 'Growth',
    progress: 100,
    status: 'Completed',
    deadline: 'Jun 20, 2026',
    manager: 'Design Team',
  },
]

const milestones = [
  { label: 'Kickoff review', date: 'Jul 22' },
  { label: 'Design approval', date: 'Aug 01' },
  { label: 'Launch prep', date: 'Aug 18' },
]

const statusVariant = {
  'In Progress': 'blue',
  Completed: 'success',
  'On Hold': 'warning',
}

const tabs = ['All', 'In Progress', 'Completed', 'On Hold']

export default function ClientProjectsPage() {
  const [activeTab, setActiveTab] = useState('All')
  const filteredProjects = projects.filter((project) => activeTab === 'All' || project.status === activeTab)

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Projects"
        description="Track progress, milestones, and delivery status across your active engagements."
        theme="dark"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="glass-card rounded-4xl border border-white/10 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.24)]"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">
              <Sparkles className="h-4 w-4 text-primary-purple" strokeWidth={1.75} />
              Project overview
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              View a consolidated status snapshot for every project, with delivery timelines and milestone sequencing.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-primary-purple px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110">
            <ArrowRight strokeWidth={1.75} className="h-4 w-4" />
            View project timeline
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05, ease: 'easeInOut' }}
        className="glass-card rounded-4xl border border-white/10 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.24)]"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Projects dashboard</h2>
            <p className="mt-2 text-sm text-slate-400">Filter active workstreams and see delivery status at a glance.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab
                    ? 'bg-primary-purple text-white'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {filteredProjects.map((project) => (
            <div key={project.name} className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">{project.category}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-400">Managed by {project.manager}. Due {project.deadline}.</p>
                </div>
                <Badge variant={statusVariant[project.status]}>{project.status}</Badge>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
                  <span>Progress</span>
                  <span className="font-semibold text-white">{project.progress}%</span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-linear-to-r from-primary-purple to-accent-blue" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: 'easeInOut' }}
          className="glass-card rounded-4xl border border-white/10 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.24)]"
        >
          <div className="flex items-center gap-3 text-slate-300">
            <Calendar strokeWidth={1.75} className="h-5 w-5 text-accent-blue" />
            <h3 className="text-lg font-semibold text-white">Milestone schedule</h3>
          </div>
          <div className="mt-6 space-y-4">
            {milestones.map((item) => (
              <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">{item.label}</p>
                <p className="mt-1 text-sm text-slate-400">{item.date}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.14, ease: 'easeInOut' }}
          className="glass-card rounded-4xl border border-white/10 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.24)]"
        >
          <div className="flex items-center gap-3 text-slate-300">
            <Briefcase strokeWidth={1.75} className="h-5 w-5 text-primary-purple" />
            <h3 className="text-lg font-semibold text-white">Project notes</h3>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Access real-time collaboration notes, review requests, and status updates in a single premium workspace.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
