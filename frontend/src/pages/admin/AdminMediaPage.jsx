import { useEffect, useState } from 'react'
import { Image, FileText, Film, Trash2, Copy, Check } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import FileDropZone from '../../components/ui/FileDropZone'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import LazyImage from '../../components/ui/LazyImage'
import uploadService from '../../services/upload.service'
import mediaService from '../../services/media.service'
import toast from 'react-hot-toast'

const typeIcons = { image: Image, document: FileText, video: Film }

const formatBytes = (bytes) => {
  const value = Number(bytes) || 0
  if (value < 1024) return value + ' B'
  if (value < 1048576) return (value / 1024).toFixed(1) + ' KB'
  return (value / 1048576).toFixed(1) + ' MB'
}

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState([])
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showUpload, setShowUpload] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchMedia = async () => {
    try {
      const res = await mediaService.getAll()
      setMediaItems(res?.media || [])
    } catch {
      toast.error('Failed to load media')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  const filtered = mediaItems.filter((m) =>
    (m.originalName || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleFile = async (file) => {
    setUploading(true)
    setUploadProgress(0)
    try {
      const res = await uploadService.uploadImage(file, setUploadProgress)
      const data = res?.data || res || {}
      const newItem = {
        _id: data.mediaId || data._id || Date.now(),
        originalName: file.name,
        type: 'image',
        bytes: data.bytes || file.size,
        url: data.url || '',
      }
      setMediaItems((prev) => [newItem, ...prev])
      toast.success('File uploaded')
      setShowUpload(false)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await mediaService.remove(deleteTarget._id)
      setMediaItems((prev) => prev.filter((item) => item._id !== deleteTarget._id))
      toast.success('File removed')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete media')
    } finally {
      setDeleteTarget(null)
      setDeleting(false)
    }
  }

  const copyToClipboard = async (item) => {
    if (!item.url) {
      toast.error('No URL available for this file')
      return
    }
    try {
      await navigator.clipboard.writeText(item.url)
      setCopiedId(item._id)
      toast.success('URL copied')
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Manager"
        description="Upload and manage media assets"
        action={
          <Button
            className="!h-11 !px-5 !text-sm"
            onClick={() => setShowUpload(!showUpload)}
          >
            {showUpload ? 'Close' : 'Upload Media'}
          </Button>
        }
      />

      {showUpload && (
        <div className="rounded-card border border-border bg-card-bg p-6 shadow-sm">
          <FileDropZone
            accept="image/*"
            label="Upload Image"
            uploading={uploading}
            uploadProgress={uploadProgress}
            onFile={handleFile}
          />
        </div>
      )}

      <input
        type="search"
        placeholder="Search media..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-12 w-full max-w-sm rounded-input border border-border bg-card-bg px-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />

      {loading ? (
        <div className="rounded-card border border-border bg-card-bg p-12 text-center shadow-sm">
          <p className="text-sm font-medium text-text-secondary">Loading media...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-card border border-border bg-card-bg p-12 text-center shadow-sm">
          <Image strokeWidth={1.75} className="mx-auto h-12 w-12 text-text-muted" />
          <p className="mt-3 text-sm font-medium text-text-secondary">
            {search ? 'No media matches your search' : 'No media uploaded yet'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((item) => {
            const Icon = typeIcons[item.type] || Image
            return (
              <div
                key={item._id}
                className="group overflow-hidden rounded-card border border-border bg-card-bg shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                {item.url ? (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.originalName || 'media'}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <LazyImage
                    gradient="from-primary/80 to-primary/60"
                    alt={item.originalName || 'media'}
                    aspectRatio="16/10"
                    className="rounded-none border-0"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <Icon strokeWidth={1.75} className="h-4 w-4 text-text-muted" />
                    <p className="truncate text-sm font-medium text-white">{item.originalName || 'Unnamed media'}</p>
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">
                    {formatBytes(item.bytes)}
                    {item.format ? ` · ${item.format.toUpperCase()}` : ''}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => copyToClipboard(item)}
                      className="flex h-8 items-center gap-1.5 rounded-btn border border-border px-2.5 text-xs font-medium text-text-secondary transition-colors hover:bg-white/5"
                      title="Copy URL"
                    >
                      {copiedId === item._id ? (
                        <Check strokeWidth={2} className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <Copy strokeWidth={2} className="h-3.5 w-3.5" />
                      )}
                      {copiedId === item._id ? 'Copied' : 'Copy URL'}
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="flex h-8 items-center gap-1.5 rounded-btn border border-border px-2.5 text-xs font-medium text-text-secondary transition-colors hover:border-danger hover:text-danger"
                      title="Delete"
                    >
                      <Trash2 strokeWidth={2} className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Media"
        message={`Are you sure you want to delete "${deleteTarget?.originalName}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  )
}
