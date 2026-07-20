import { useState } from 'react'
import { Image, FileText, Film, Trash2, Copy, Check } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import FileDropZone from '../../components/ui/FileDropZone'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import LazyImage from '../../components/ui/LazyImage'
import uploadService from '../../services/upload.service'
import toast from 'react-hot-toast'

const typeIcons = { image: Image, document: FileText, video: Film }

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState([])
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showUpload, setShowUpload] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [copiedId, setCopiedId] = useState(null)

  const filtered = mediaItems.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  )

  const getMediaType = (file) => {
    if (file.type?.startsWith('image/')) return 'image'
    if (file.type?.startsWith('video/')) return 'video'
    return 'document'
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }

  const handleFile = async (file) => {
    setUploading(true)
    setUploadProgress(0)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await uploadService.uploadImage(formData, setUploadProgress)
      const url = res?.data?.url || res?.data?.path || ''
      const newItem = {
        id: Date.now(),
        name: file.name,
        type: getMediaType(file),
        size: formatSize(file.size),
        url,
        gradient: 'from-primary/80 to-primary/60',
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

  const handleDelete = () => {
    if (!deleteTarget) return
    setDeleting(true)
    setTimeout(() => {
      setMediaItems((prev) => prev.filter((item) => item.id !== deleteTarget.id))
      setDeleteTarget(null)
      setDeleting(false)
      toast.success('File removed')
    }, 400)
  }

  const copyToClipboard = async (item) => {
    if (!item.url) {
      toast.error('No URL available for this file')
      return
    }
    try {
      await navigator.clipboard.writeText(item.url)
      setCopiedId(item.id)
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

      {filtered.length === 0 && (
        <div className="rounded-card border border-border bg-card-bg p-12 text-center shadow-sm">
          <Image strokeWidth={1.75} className="mx-auto h-12 w-12 text-text-muted" />
          <p className="mt-3 text-sm font-medium text-text-secondary">
            {search ? 'No media matches your search' : 'No media uploaded yet'}
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((item) => {
          const Icon = typeIcons[item.type] || Image
          return (
            <div
              key={item.id}
              className="group overflow-hidden rounded-card border border-border bg-card-bg shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              {item.url ? (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <LazyImage
                  gradient={item.gradient}
                  alt={item.name}
                  aspectRatio="16/10"
                  className="rounded-none border-0"
                />
              )}
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <Icon strokeWidth={1.75} className="h-4 w-4 text-text-muted" />
                  <p className="truncate text-sm font-medium text-white">{item.name}</p>
                </div>
                <p className="mt-1 text-xs text-text-secondary">{item.size}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => copyToClipboard(item)}
                    className="flex h-8 items-center gap-1.5 rounded-btn border border-border px-2.5 text-xs font-medium text-text-secondary transition-colors hover:bg-white/5"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? (
                      <Check strokeWidth={2} className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <Copy strokeWidth={2} className="h-3.5 w-3.5" />
                    )}
                    {copiedId === item.id ? 'Copied' : 'Copy URL'}
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

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Media"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  )
}