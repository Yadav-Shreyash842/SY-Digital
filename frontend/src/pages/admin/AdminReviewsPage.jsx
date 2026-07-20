import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Download, Star } from 'lucide-react'
import { cn } from '../../utils/cn'
import toast from 'react-hot-toast'
import Breadcrumb from '../../components/ui/Breadcrumb'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Badge from '../../components/ui/Badge'
import reviewService from '../../services/review.service'
import ReviewStatsCards from '../../components/admin/reviews/ReviewStatsCards'
import ReviewFilterBar from '../../components/admin/reviews/ReviewFilterBar'
import ReviewDataTable from '../../components/admin/reviews/ReviewDataTable'
import ReviewFormModal from '../../components/admin/reviews/ReviewFormModal'
import ReviewRightPanel from '../../components/admin/reviews/ReviewRightPanel'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminReviewsPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [featuredFilter, setFeaturedFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const [selectedReview, setSelectedReview] = useState(null)

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
      const params = { page, limit: 10 }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter
      if (ratingFilter) params.rating = ratingFilter
      if (featuredFilter) params.featured = featuredFilter
      const res = await reviewService.list(params)
      const payload = res?.data
      setData(payload?.reviews || [])
      setTotalPages(payload?.pagination?.totalPages || 1)
      setTotal(payload?.pagination?.total || 0)
    } catch {
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter, ratingFilter, featuredFilter])

  const fetchStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const res = await reviewService.stats()
      setStats(res?.data || null)
    } catch {
      // silent
    } finally {
      setStatsLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { fetchStats() }, [fetchStats])
  useEffect(() => { setPage(1) }, [search, statusFilter, ratingFilter, featuredFilter])

  const ratingDistribution = useMemo(() => {
    const map = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    data.forEach((r) => {
      const rating = r.rating
      if (rating >= 1 && rating <= 5) map[rating]++
    })
    return Object.entries(map)
      .map(([name, value]) => ({ name: `${name} Star`, value }))
      .filter((d) => d.value > 0)
      .sort((a, b) => parseInt(b.name) - parseInt(a.name))
  }, [data])

  const handleCreate = async (payload) => {
    setFormLoading(true)
    try {
      await reviewService.create(payload)
      toast.success('Review created successfully')
      setShowCreate(false)
      fetchData()
      fetchStats()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create review')
      throw err
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = async (payload) => {
    setFormLoading(true)
    try {
      await reviewService.update(editData._id, payload)
      toast.success('Review updated successfully')
      setShowEdit(false)
      setEditData(null)
      fetchData()
      fetchStats()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update review')
      throw err
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setFormLoading(true)
    try {
      await reviewService.remove(deleteTarget._id)
      toast.success('Review deleted')
      setShowDelete(false)
      setDeleteTarget(null)
      if (selectedReview?._id === deleteTarget._id) setSelectedReview(null)
      fetchData()
      fetchStats()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete review')
    } finally {
      setFormLoading(false)
    }
  }

  const handleApprove = async (review) => {
    try {
      await reviewService.update(review._id, { status: 'approved' })
      toast.success('Review approved')
      fetchData()
      fetchStats()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to approve review')
    }
  }

  const handleReject = async (review) => {
    try {
      await reviewService.update(review._id, { status: 'rejected' })
      toast.success('Review rejected')
      fetchData()
      fetchStats()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to reject review')
    }
  }

  const handleToggleFeatured = async (review) => {
    try {
      await reviewService.update(review._id, { featured: !review.featured })
      toast.success(`Review ${review.featured ? 'unfeatured' : 'featured'} successfully`)
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
      const rows = data.map((r) => ({
        'Client Name': r.clientName,
        Email: r.clientEmail,
        Company: r.company || '-',
        Service: r.service?.title || 'N/A',
        Rating: r.rating,
        Review: r.review,
        Status: r.status,
        Featured: r.featured ? 'Yes' : 'No',
        Created: formatDate(r.createdAt),
      }))
      const ws = XLSX.utils.json_to_sheet(rows)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Reviews')
      XLSX.writeFile(wb, `reviews-export-${Date.now()}.xlsx`)
      toast.success('Exported successfully')
    } catch {
      toast.error('Failed to export')
    }
  }

  const statusBadgeVariant = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
  }

  const StarRating = ({ value = 0 }) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            strokeWidth={1.75}
            className={cn(
              'h-4 w-4',
              star <= value ? 'fill-warning text-warning' : 'text-text-muted',
            )}
          />
        ))}
      </div>
    )
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
            { label: 'Reviews', href: '/admin/reviews' },
            { label: 'Manage Reviews' },
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
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Reviews</h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage client testimonials, ratings, and social proof content.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="!h-11 !px-5 !text-sm" onClick={handleExport}>
            <Download strokeWidth={1.75} className="h-4 w-4" />
            Export
          </Button>
          <Button variant="light" className="!h-11 !px-5 !text-sm" onClick={() => { setEditData(null); setShowCreate(true) }}>
            <Plus strokeWidth={1.75} className="h-4 w-4" />
            Add Review
          </Button>
        </div>
      </motion.div>

      <ReviewStatsCards stats={stats} loading={statsLoading} />

      <ReviewFilterBar
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        rating={ratingFilter}
        onRatingChange={setRatingFilter}
        featured={featuredFilter}
        onFeaturedChange={setFeaturedFilter}
      />

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="min-w-0">
          <ReviewDataTable
            data={data}
            loading={loading}
            selectedId={selectedReview?._id}
            onSelect={setSelectedReview}
            onView={(r) => { setViewTarget(r); setShowView(true) }}
            onEdit={(r) => { setEditData(r); setShowEdit(true) }}
            onApprove={handleApprove}
            onReject={handleReject}
            onToggleFeatured={handleToggleFeatured}
            onDelete={(r) => { setDeleteTarget(r); setShowDelete(true) }}
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
            <ReviewRightPanel
              review={selectedReview}
              ratingDistribution={ratingDistribution}
            />
          </div>
        </div>
      </div>

      <ReviewFormModal
        isOpen={showCreate}
        onClose={() => { setShowCreate(false); setEditData(null) }}
        onSubmit={handleCreate}
        initialData={editData}
      />

      <ReviewFormModal
        isOpen={showEdit}
        onClose={() => { setShowEdit(false); setEditData(null) }}
        onSubmit={handleEdit}
        initialData={editData}
      />

      <Modal isOpen={showView} onClose={() => { setShowView(false); setViewTarget(null) }} title="Review Details" size="lg">
        {viewTarget && (
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              {viewTarget.profileImage?.url ? (
                <img src={viewTarget.profileImage.url} alt={viewTarget.clientName} className="h-14 w-14 flex-shrink-0 rounded-full object-cover" />
              ) : (
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/20 text-xl font-bold text-primary">
                  {viewTarget.clientName?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-white">{viewTarget.clientName}</h3>
                <p className="text-sm text-text-muted">{viewTarget.clientEmail}</p>
                {viewTarget.company && <p className="text-sm text-text-muted">{viewTarget.company}</p>}
              </div>
            </div>

            <StarRating value={viewTarget.rating} />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white/[0.03] px-4 py-3">
                <p className="text-xs text-text-muted">Service</p>
                <p className="mt-0.5 text-sm font-medium text-white">
                  <Badge variant="blue">{viewTarget.service?.title || 'N/A'}</Badge>
                </p>
              </div>
              <div className="rounded-xl bg-white/[0.03] px-4 py-3">
                <p className="text-xs text-text-muted">Status</p>
                <div className="mt-0.5">
                  <Badge variant={statusBadgeVariant[viewTarget.status] || 'gray'}>
                    {viewTarget.status?.charAt(0)?.toUpperCase() + viewTarget.status?.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="rounded-xl bg-white/[0.03] px-4 py-3">
                <p className="text-xs text-text-muted">Featured</p>
                <p className="mt-0.5 text-sm font-medium text-white">{viewTarget.featured ? 'Yes' : 'No'}</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] px-4 py-3">
                <p className="text-xs text-text-muted">Created</p>
                <p className="mt-0.5 text-sm font-medium text-white">{formatDate(viewTarget.createdAt)}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs text-text-muted">Review</p>
              <p className="whitespace-pre-wrap rounded-xl bg-white/[0.03] p-4 text-sm leading-relaxed text-text-secondary">
                {viewTarget.review}
              </p>
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
        title="Delete Review"
        message={`Are you sure you want to delete the review by "${deleteTarget?.clientName}"? This action cannot be undone.`}
        loading={formLoading}
        confirmVariant="danger"
      />
    </div>
  )
}
