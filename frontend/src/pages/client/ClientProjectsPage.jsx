import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Sparkles, Loader2, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import useAuth from '../../hooks/useAuth'
import clientService from '../../services/client.service'
import toast from 'react-hot-toast'

const statusVariant = {
  'In Progress': 'blue',
  Active: 'blue',
  Completed: 'success',
  Draft: 'warning',
  'On Hold': 'warning',
}

const tabs = ['All', 'Active', 'Completed', 'In Progress', 'Draft']

export default function ClientProjectsPage() {
  const { user } = useAuth()

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await clientService.projects()
        setProjects(res?.data || [])
      } catch {
        toast.error('Failed to load projects')
      } finally {
        setLoading(false)
      }
    }

    if (user) fetchProjects()
  }, [user])

  const normalizedProjects = useMemo(
    () =>
      projects.map((p) => ({
        ...p,
        displayStatus:
          p.status === 'published'
            ? 'Active'
            : p.status === 'archived'
              ? 'Completed'
              : 'Draft',
      })),
    [projects]
  )

  const filteredProjects = useMemo(
    () => normalizedProjects.filter((p) => activeTab === 'All' || p.displayStatus === activeTab),
    [normalizedProjects, activeTab]
  )

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
        title="My Projects"
        description="Track progress, milestones, and delivery status across your active engagements."
        theme="dark"
        action={
          <Link
            to="/client/request-project"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <Plus strokeWidth={1.75} className="h-4 w-4" />
            Request Project
          </Link>
        }
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
              <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.75} />
              Project overview
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              View a consolidated status snapshot for every project, with delivery timelines and milestone sequencing.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full bg-white/5 px-4 py-3 text-sm text-slate-300">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </div>
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
            <h2 className="text-xl font-semibold text-white sm:text-2xl">Projects dashboard</h2>
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
                    ? 'bg-primary text-white'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {filteredProjects.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-12 text-center">
              <p className="text-slate-400">No projects found for this filter.</p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div key={project._id} className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">{project.category}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-400 max-w-2xl">{project.shortDescription || project.description}</p>
                    {project.completionDate && (
                      <p className="mt-1 text-xs text-slate-500">
                        Due {new Date(project.completionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                  <Badge variant={statusVariant[project.displayStatus]}>{project.displayStatus}</Badge>
                </div>

                {project.technologies?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1, ease: 'easeInOut' }}
        className="glass-card rounded-4xl border border-white/10 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.24)]"
      >
        <div className="flex items-center gap-3 text-slate-300">
          <Calendar strokeWidth={1.75} className="h-5 w-5 text-accent-blue" />
          <h3 className="text-lg font-semibold text-white">Project summary</h3>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Total projects</p>
            <p className="mt-2 text-2xl font-semibold text-white">{projects.length}</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Active</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {normalizedProjects.filter((p) => p.displayStatus === 'Active').length}
            </p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Completed</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {normalizedProjects.filter((p) => p.displayStatus === 'Completed').length}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
