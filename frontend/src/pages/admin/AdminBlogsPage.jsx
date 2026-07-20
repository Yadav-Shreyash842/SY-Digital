import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Download, Eye, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import Breadcrumb from '../../components/ui/Breadcrumb'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Badge from '../../components/ui/Badge'
import blogService from '../../services/blog.service'
import BlogStatsCards from '../../components/admin/blogs/BlogStatsCards'
import BlogFilterBar from '../../components/admin/blogs/BlogFilterBar'
import BlogDataTable from '../../components/admin/blogs/BlogDataTable'
import BlogFormModal from '../../components/admin/blogs/BlogFormModal'
import BlogRightPanel from '../../components/admin/blogs/BlogRightPanel'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminBlogsPage() {
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

  const [selectedBlog, setSelectedBlog] = useState(null)

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
      const res = await blogService.list(params)
      const payload = res?.data
      setData(payload?.blogs || [])
      setTotalPages(payload?.totalPages || 1)
      setTotal(payload?.total || 0)
    } catch {
      toast.error('Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }, [page, search, categoryFilter, statusFilter, sort])

  const fetchStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const res = await blogService.stats()
      const raw = res?.data
      if (raw) {
        setStats({
          totalBlogs: raw.total,
          publishedBlogs: raw.published,
          draftBlogs: raw.draft,
          archivedBlogs: raw.archived,
          featuredBlogs: raw.featured,
          totalViews: raw.totalViews,
        })
      }
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
    data.forEach((b) => {
      const cat = b.category || 'Other'
      map[cat] = (map[cat] || 0) + 1
    })
    return Object.entries(map).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))
  }, [data])

  const handleCreate = async (payload) => {
    setFormLoading(true)
    try {
      await blogService.create(payload)
      toast.success('Blog created successfully')
      setShowCreate(false)
      fetchData()
      fetchStats()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create blog')
      throw err
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = async (payload) => {
    setFormLoading(true)
    try {
      await blogService.update(editData._id, payload)
      toast.success('Blog updated successfully')
      setShowEdit(false)
      setEditData(null)
      fetchData()
      fetchStats()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update blog')
      throw err
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setFormLoading(true)
    try {
      await blogService.remove(deleteTarget._id)
      toast.success('Blog deleted')
      setShowDelete(false)
      setDeleteTarget(null)
      if (selectedBlog?._id === deleteTarget._id) setSelectedBlog(null)
      fetchData()
      fetchStats()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete blog')
    } finally {
      setFormLoading(false)
    }
  }

  const handleToggleFeatured = async (blog) => {
    try {
      await blogService.featured(blog._id)
      toast.success(`Blog ${blog.isFeatured ? 'unfeatured' : 'featured'} successfully`)
      fetchData()
      fetchStats()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update featured status')
    }
  }

  const handleExport = () => {
    try {
      const XLSX = window.XLSX
      if (!XLSX) {
        toast.error('Export library not available')
        return
      }
      const rows = data.map((b) => ({
        Title: b.title,
        Category: b.category,
        Author: b.author,
        Status: b.status,
        Views: b.views || 0,
        'Read Time': b.readTime ? `${b.readTime} min` : '-',
        Featured: b.isFeatured ? 'Yes' : 'No',
        Created: formatDate(b.createdAt),
      }))
      const ws = XLSX.utils.json_to_sheet(rows)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Blogs')
      XLSX.writeFile(wb, `blogs-export-${Date.now()}.xlsx`)
      toast.success('Exported successfully')
    } catch {
      toast.error('Failed to export')
    }
  }

  const categoryBadgeVariant = {
    technology: 'blue',
    business: 'purple',
    design: 'pink',
    marketing: 'green',
    general: 'gray',
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
            { label: 'Blogs', href: '/admin/blogs' },
            { label: 'Manage Blogs' },
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
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Blogs</h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage your blog posts, articles, and editorial content.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="!h-11 !px-5 !text-sm" onClick={handleExport}>
            <Download strokeWidth={1.75} className="h-4 w-4" />
            Export
          </Button>
          <Button variant="light" className="!h-11 !px-5 !text-sm" onClick={() => { setEditData(null); setShowCreate(true) }}>
            <Plus strokeWidth={1.75} className="h-4 w-4" />
            Add Blog
          </Button>
        </div>
      </motion.div>

      <BlogStatsCards stats={stats} loading={statsLoading} />

      <BlogFilterBar
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
          <BlogDataTable
            data={data}
            loading={loading}
            selectedId={selectedBlog?._id}
            onSelect={setSelectedBlog}
            onView={(b) => { setViewTarget(b); setShowView(true) }}
            onEdit={(b) => { setEditData(b); setShowEdit(true) }}
            onToggleFeatured={handleToggleFeatured}
            onDelete={(b) => { setDeleteTarget(b); setShowDelete(true) }}
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
            <BlogRightPanel
              blog={selectedBlog}
              categoryDistribution={categoryDistribution}
            />
          </div>
        </div>
      </div>

      <BlogFormModal
        isOpen={showCreate}
        onClose={() => { setShowCreate(false); setEditData(null) }}
        onSubmit={handleCreate}
        initialData={editData}
      />

      <BlogFormModal
        isOpen={showEdit}
        onClose={() => { setShowEdit(false); setEditData(null) }}
        onSubmit={handleEdit}
        initialData={editData}
      />

      <Modal isOpen={showView} onClose={() => { setShowView(false); setViewTarget(null) }} title="Blog Details" size="lg">
        {viewTarget && (
          <div className="space-y-5">
            {viewTarget.featuredImage?.url && (
              <div className="relative h-44 w-full overflow-hidden rounded-xl">
                <img src={viewTarget.featuredImage.url} alt={viewTarget.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent" />
              </div>
            )}
            <h3 className="text-xl font-bold text-white">{viewTarget.title}</h3>
            {viewTarget.shortDescription && (
              <p className="text-sm text-text-secondary">{viewTarget.shortDescription}</p>
            )}
            {viewTarget.content && (
              <p className="text-sm leading-relaxed text-text-secondary whitespace-pre-wrap">{viewTarget.content}</p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white/[0.03] px-4 py-3">
                <p className="text-xs text-text-muted">Author</p>
                <p className="mt-0.5 text-sm font-medium text-white">{viewTarget.author || '-'}</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] px-4 py-3">
                <p className="text-xs text-text-muted">Category</p>
                <p className="mt-0.5 text-sm font-medium text-white">
                  {viewTarget.category?.charAt(0).toUpperCase() + viewTarget.category?.slice(1)}
                </p>
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
                <p className="text-xs text-text-muted">Views</p>
                <p className="mt-0.5 text-sm font-medium text-white">{(viewTarget.views || 0).toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] px-4 py-3">
                <p className="text-xs text-text-muted">Read Time</p>
                <p className="mt-0.5 text-sm font-medium text-white">{viewTarget.readTime ? `${viewTarget.readTime} min` : '-'}</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] px-4 py-3">
                <p className="text-xs text-text-muted">Created</p>
                <p className="mt-0.5 text-sm font-medium text-white">{formatDate(viewTarget.createdAt)}</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] px-4 py-3">
                <p className="text-xs text-text-muted">Updated</p>
                <p className="mt-0.5 text-sm font-medium text-white">{formatDate(viewTarget.updatedAt)}</p>
              </div>
            </div>
            {viewTarget.tags?.length > 0 && (
              <div>
                <p className="mb-2 text-xs text-text-muted">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {viewTarget.tags.map((t, i) => (
                    <span key={i} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs text-text-secondary">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {(viewTarget.seoTitle || viewTarget.seoDescription) && (
              <div className="rounded-xl bg-white/[0.03] p-4 text-sm space-y-2">
                {viewTarget.seoTitle && (
                  <div>
                    <p className="text-xs text-text-muted">SEO Title</p>
                    <p className="mt-0.5 font-medium text-white">{viewTarget.seoTitle}</p>
                  </div>
                )}
                {viewTarget.seoDescription && (
                  <div>
                    <p className="text-xs text-text-muted">SEO Description</p>
                    <p className="mt-0.5 text-text-secondary">{viewTarget.seoDescription}</p>
                  </div>
                )}
              </div>
            )}
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
        title="Delete Blog"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        loading={formLoading}
        confirmVariant="danger"
      />
    </div>
  )
}
