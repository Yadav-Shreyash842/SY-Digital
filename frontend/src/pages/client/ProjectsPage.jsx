import { motion } from 'framer-motion'
import {
  FolderKanban,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Sparkles,
  Clock3,
  Users,
} from 'lucide-react'

const projects = [
  {
    name: 'FinFlow Dashboard',
    category: 'Product Design',
    progress: 82,
    status: 'In Progress',
    deadline: 'Aug 15, 2026',
    summary: 'UI refinements, analytics views, and handoff preparation are underway.',
    team: 'Design + Engineering',
  },
  {
    name: 'Brand Identity Refresh',
    category: 'Brand System',
    progress: 100,
    status: 'Completed',
    deadline: 'Jul 10, 2026',
    summary: 'The refreshed visual system and asset package were delivered successfully.',
    team: 'Creative Team',
  },
  {
    name: 'Marketing Campaign Q3',
    category: 'Growth',
    progress: 46,
    status: 'In Progress',
    deadline: 'Sep 01, 2026',
    summary: 'Asset rollout and launch messaging are being finalized for the next phase.',
    team: 'Marketing Ops',
  },
]

const milestones = [
  { title: 'Design review', date: 'Jul 22', time: '10:00 AM' },
  { title: 'Client feedback sync', date: 'Jul 25', time: '2:30 PM' },
  { title: 'Delivery handoff', date: 'Aug 01', time: '4:00 PM' },
]

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-purple/10 px-3 py-1 text-sm font-medium text-primary-purple">
              <Sparkles strokeWidth={1.75} className="h-4 w-4" />
              Client Projects
            </div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Your project workspace</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-500 sm:text-base">
              Track progress, review milestones, and keep an eye on what is moving forward.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-xl font-bold text-gray-900">3</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-xl font-bold text-gray-900">1</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-sm text-gray-500">Next Milestone</p>
              <p className="text-xl font-bold text-gray-900">Jul 22</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08, ease: 'easeInOut' }}
              className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">{project.name}</h2>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                      {project.category}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{project.summary}</p>
                </div>
                <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${project.status === 'Completed' ? 'bg-success/10 text-success' : 'bg-accent-blue/10 text-accent-blue'}`}>
                  {project.status}
                </span>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-semibold text-gray-900">{project.progress}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                    className={`h-full rounded-full ${project.progress === 100 ? 'bg-success' : 'bg-gradient-to-r from-primary-purple to-accent-blue'}`}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-4 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Calendar strokeWidth={1.75} className="h-4 w-4 text-gray-400" />
                  <span>Due {project.deadline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users strokeWidth={1.75} className="h-4 w-4 text-gray-400" />
                  <span>{project.team}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15, ease: 'easeInOut' }}
            className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-2">
              <Clock3 strokeWidth={1.75} className="h-5 w-5 text-accent-blue" />
              <h3 className="text-lg font-semibold text-gray-900">Upcoming milestones</h3>
            </div>
            <div className="space-y-3">
              {milestones.map((milestone) => (
                <div key={milestone.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{milestone.title}</p>
                    <CheckCircle2 strokeWidth={1.75} className="h-4 w-4 text-success" />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{milestone.date} · {milestone.time}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2, ease: 'easeInOut' }}
            className="rounded-[24px] border border-gray-200 bg-gradient-to-br from-primary-purple/10 to-accent-blue/10 p-6 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <FolderKanban strokeWidth={1.75} className="h-5 w-5 text-primary-purple" />
              <h3 className="text-lg font-semibold text-gray-900">Need a quick view?</h3>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Keep your project timeline, progress, and delivery dates in one polished place.
            </p>
            <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm">
              Open project board <ArrowRight strokeWidth={1.75} className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
