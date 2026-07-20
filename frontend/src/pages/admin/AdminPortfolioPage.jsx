import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import Breadcrumb from '../../components/ui/Breadcrumb'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Badge from '../../components/ui/Badge'
import projectService from '../../services/project.service'
import ProjectStatsCards from '../../components/admin/portfolio/ProjectStatsCards'
import ProjectFilterBar from '../../components/admin/portfolio/ProjectFilterBar'
import ProjectDataTable from '../../components/admin/portfolio/ProjectDataTable'
import ProjectFormModal from '../../components/admin/portfolio/ProjectFormModal'
import ProjectRightPanel from '../../components/admin/portfolio/ProjectRightPanel'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminPortfolioPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const [selectedProject, setSelectedProject] = useState(null)

  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showView, setShowView] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [editData, setEditData] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [viewTarget, setViewTarget] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 10, sort }
      if (search) params.search = search
      if (categoryFilter) params.category = categoryFilter
      if (statusFilter) params.status = statusFilter
      const res = await projectService.list(params)
      const payload = res?.data
      setData(payload?.projects || [])
      setTotalPages(payload?.totalPages || 1)
      setTotal(payload?.total || 0)
    } catch {
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [page, search, categoryFilter, statusFilter, sort])

  const fetchStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const res = await projectService.stats()
      setStats(res?.data || null)
    } catch {
      // silent
    } finally {
      setStatsLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { fetchStats() }, [fetchStats])
  useEffect(() => { setPage(1) }, [search, categoryFilter, statusFilter, sort])

  const categoryDistribution = useMemo(() => {
    const map = {}
    data.forEach((p) => {
      const cat = p.category || 'Other'
      map[cat] = (map[cat] || 0) + 1
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [data])

  const handleCreate = async (payload) => {
    setFormLoading(true)
    try {
      await projectService.create(payload)
      toast.success('Project created successfully')
      setShowCreate(false)
      fetchData()
      fetchStats()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create project')
      throw err
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = async (payload) => {
    setFormLoading(true)
    try {
      await projectService.update(editData._id, payload)
      toast.success('Project updated successfully')
      setShowEdit(false)
      setEditData(null)
      fetchData()
      fetchStats()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update project')
      throw err
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setFormLoading(true)
    try {
      await projectService.remove(deleteTarget._id)
      toast.success('Project deleted')
      setShowDelete(false)
      setDeleteTarget(null)
      if (selectedProject?._id === deleteTarget._id) setSelectedProject(null)
      fetchData()
      fetchStats()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete project')
    } finally {
      setFormLoading(false)
    }
  }

  const handleToggleStatus = async (project) => {
    const newStatus = project.status === 'published' ? 'draft' : 'published'
    try {
      await projectService.update(project._id, { status: newStatus })
      toast.success(`Project ${newStatus === 'published' ? 'published' : 'unpublished'}`)
      fetchData()
      fetchStats()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status')
    }
  }

  const handleDuplicate = (project) => {
    setEditData({
      ...project,
      _id: undefined,
      slug: undefined,
      title: `${project.title} (Copy)`,
      status: 'draft',
      createdAt: undefined,
      updatedAt: undefined,
    })
    setShowCreate(true)
  }

  const handleExport = () => {
    try {
      const XLSX = window.XLSX
      if (!XLSX) {
        toast.error('Export library not available')
        return
      }
      const rows = data.map((p) => ({
        Title: p.title,
        Category: p.category,
        Client: p.clientName || '-',
        Status: p.status,
        Featured: p.isFeatured ? 'Yes' : 'No',
        Revenue: p.revenue || 0,
        Completed: p.completionDate ? formatDate(p.completionDate) : '-',
        Created: formatDate(p.createdAt),
      }))
      const ws = XLSX.utils.json_to_sheet(rows)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Projects')
      XLSX.writeFile(wb, `projects-export-${Date.now()}.xlsx`)
      toast.success('Exported successfully')
    } catch {
      toast.error('Failed to export')
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        <Breadcrumb
          items={[
            { label: 'Portfolio', href: '/admin/portfolio' },
            { label: 'Manage Projects' },
          ]}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.04, ease: 'easeInOut' }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Portfolio</h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage your project showcase, case studies, and portfolio items.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="!h-11 !px-5 !text-sm" onClick={handleExport}>
            <Download strokeWidth={1.75} className="h-4 w-4" />
            Export
          </Button>
          <Button variant="light" className="!h-11 !px-5 !text-sm" onClick={() => { setEditData(null); setShowCreate(true) }}>
            <Plus strokeWidth={1.75} className="h-4 w-4" />
            Add Project
          </Button>
        </div>
      </motion.div>

      <ProjectStatsCards stats={stats} loading={statsLoading} />

      <ProjectFilterBar
        search={search}
        onSearchChange={setSearch}
        category={categoryFilter}
        onCategoryChange={setCategoryFilter}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        sort={sort}
        onSortChange={setSort}
      />

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="min-w-0">
          <ProjectDataTable
            data={data}
            loading={loading}
            selectedId={selectedProject?._id}
            onSelect={setSelectedProject}
            onView={(p) => { setViewTarget(p); setShowView(true) }}
            onEdit={(p) => { setEditData(p); setShowEdit(true) }}
            onDuplicate={handleDuplicate}
            onToggleStatus={handleToggleStatus}
            onDelete={(p) => { setDeleteTarget(p); setShowDelete(true) }}
            pagination={{
              page,
              totalPages,
              total,
              onPageChange: setPage,
            }}
          />
        </div>

        <div className="hidden xl:block">
          <div className="sticky top-24">
            <ProjectRightPanel
              project={selectedProject}
              categoryDistribution={categoryDistribution}
            />
          </div>
        </div>
      </div>

      <ProjectFormModal
        isOpen={showCreate}
        onClose={() => { setShowCreate(false); setEditData(null) }}
        onSubmit={handleCreate}
        initialData={editData}
      />

      <ProjectFormModal
        isOpen={showEdit}
        onClose={() => { setShowEdit(false); setEditData(null) }}
        onSubmit={handleEdit}
        initialData={editData}
      />

      <Modal isOpen={showView} onClose={() => { setShowView(false); setViewTarget(null) }} title="Project Details" size="lg">
        {viewTarget && (
          <div className="space-y-5">
            {viewTarget.images?.[0]?.url && (
              <div className="relative h-44 w-full overflow-hidden rounded-xl">
                <img src={viewTarget.images[0].url} alt={viewTarget.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent" />
              </div>
            )}
            <h3 className="text-xl font-bold text-white">{viewTarget.title}</h3>
            {viewTarget.shortDescription && (
              <p className="text-sm text-text-secondary">{viewTarget.shortDescription}</p>
            )}
            <p className="text-sm leading-relaxed text-text-secondary">{viewTarget.description}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white/[0.03] px-4 py-3">
                <p className="text-xs text-text-muted">Category</p>
                <p className="mt-0.5 text-sm font-medium text-white">{viewTarget.category}</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] px-4 py-3">
                <p className="text-xs text-text-muted">Client</p>
                <p className="mt-0.5 text-sm font-medium text-white">{viewTarget.clientName || '-'}</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] px-4 py-3">
                <p className="text-xs text-text-muted">Status</p>
                <div className="mt-0.5">
                  <Badge variant={viewTarget.status === 'published' ? 'success' : viewTarget.status === 'archived' ? 'warning' : 'gray'}>
                    {viewTarget.status}
                  </Badge>
                </div>
              </div>
              <div className="rounded-xl bg-white/[0.03] px-4 py-3">
                <p className="text-xs text-text-muted">Featured</p>
                <p className="mt-0.5 text-sm font-medium text-white">{viewTarget.isFeatured ? 'Yes' : 'No'}</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] px-4 py-3">
                <p className="text-xs text-text-muted">Completion Date</p>
                <p className="mt-0.5 text-sm font-medium text-white">
                  {viewTarget.completionDate ? formatDate(viewTarget.completionDate) : 'In progress'}
                </p>
              </div>
              <div className="rounded-xl bg-white/[0.03] px-4 py-3">
                <p className="text-xs text-text-muted">Revenue</p>
                <p className="mt-0.5 text-sm font-medium text-white">₹{(viewTarget.revenue || 0).toLocaleString()}</p>
              </div>
            </div>
            {viewTarget.technologies?.length > 0 && (
              <div>
                <p className="mb-2 text-xs text-text-muted">Technologies</p>
                <div className="flex flex-wrap gap-1.5">
                  {viewTarget.technologies.map((t) => (
                    <span key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs text-text-secondary">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {viewTarget.liveUrl && (
                <a href={viewTarget.liveUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10">
                  Visit Live Site
                </a>
              )}
              {viewTarget.githubUrl && (
                <a href={viewTarget.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10">
                  View Source Code
                </a>
              )}
            </div>
            <div className="flex justify-end border-t border-white/10 pt-4">
              <Button variant="outline" onClick={() => { setShowView(false); setViewTarget(null) }}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => { setShowDelete(false); setDeleteTarget(null) }}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        loading={formLoading}
        confirmVariant="danger"
      />
    </div>
  )
}
