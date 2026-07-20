import { useState } from 'react'
import Modal from '../../ui/Modal'
import Input from '../../ui/Input'
import Textarea from '../../ui/Textarea'
import Select from '../../ui/Select'
import Button from '../../ui/Button'
import FileDropZone from '../../ui/FileDropZone'
import uploadService from '../../../services/upload.service'

const categoryOptions = [
  { value: 'Web App', label: 'Web App' },
  { value: 'E-Commerce', label: 'E-Commerce' },
  { value: 'Branding', label: 'Branding' },
  { value: 'SaaS Platform', label: 'SaaS Platform' },
  { value: 'Mobile App', label: 'Mobile App' },
  { value: 'Campaign', label: 'Campaign' },
]

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

const emptyForm = {
  title: '',
  shortDescription: '',
  description: '',
  category: 'Web App',
  clientName: '',
  technologies: '',
  images: [],
  video: { publicId: '', url: '' },
  githubUrl: '',
  liveUrl: '',
  completionDate: '',
  isFeatured: false,
  status: 'draft',
}

export default function ProjectFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const isEdit = !!initialData?._id

  const [formData, setFormData] = useState(
    initialData
      ? {
          title: initialData.title || '',
          shortDescription: initialData.shortDescription || '',
          description: initialData.description || '',
          category: initialData.category || 'Web App',
          clientName: initialData.clientName || '',
          technologies: (initialData.technologies || []).join(', '),
          images: initialData.images || [],
          video: initialData.video || { publicId: '', url: '' },
          githubUrl: initialData.githubUrl || '',
          liveUrl: initialData.liveUrl || '',
          completionDate: initialData.completionDate
            ? new Date(initialData.completionDate).toISOString().split('T')[0]
            : '',
          isFeatured: initialData.isFeatured || false,
          status: initialData.status || 'draft',
        }
      : { ...emptyForm }
  )

  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState(
    initialData?.images?.map((img) => img.url).filter(Boolean) || []
  )
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!formData.title?.trim()) e.title = 'Title is required'
    if (!formData.description?.trim()) e.description = 'Description is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const buildPayload = () => {
    const payload = {
      title: formData.title,
      shortDescription: formData.shortDescription,
      description: formData.description,
      category: formData.category,
      clientName: formData.clientName,
      technologies: formData.technologies
        ? formData.technologies.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      video: formData.video?.url ? formData.video : { publicId: '', url: '' },
      githubUrl: formData.githubUrl,
      liveUrl: formData.liveUrl,
      completionDate: formData.completionDate || undefined,
      isFeatured: formData.isFeatured,
      status: formData.status,
    }
    if (formData.images.length > 0) {
      payload.images = formData.images
    }
    return payload
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      let uploadedImages = formData.images
      if (imageFiles.length > 0) {
        const uploads = await Promise.all(
          imageFiles.map((file) => uploadService.uploadImage(file).then((r) => r?.data))
        )
        uploadedImages = uploads.filter(Boolean)
      }
      const payload = buildPayload()
      payload.images = uploadedImages
      await onSubmit(payload)
      onClose()
    } catch (err) {
      // error handled by parent
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (files) => {
    if (!files?.length) return
    const newFiles = Array.from(files)
    setImageFiles((prev) => [...prev, ...newFiles])
    setImagePreviews((prev) => [
      ...prev,
      ...newFiles.map((f) => URL.createObjectURL(f)),
    ])
  }

  const removeImage = (idx) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx))
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  const set = (field) => (e) => setFormData({ ...formData, [field]: e?.target?.value ?? e })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Project' : 'Add Project'} size="xl">
      <div className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Title" value={formData.title} onChange={set('title')} error={errors.title} />
          <Select label="Category" options={categoryOptions} value={formData.category} onChange={set('category')} />
        </div>

        <Input label="Client Name" value={formData.clientName} onChange={set('clientName')} placeholder="e.g. Acme Corp" />

        <Textarea label="Short Description" value={formData.shortDescription} onChange={set('shortDescription')} rows={2} />

        <Textarea label="Description" value={formData.description} onChange={set('description')} error={errors.description} rows={4} />

        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Technologies (comma separated)" value={formData.technologies} onChange={set('technologies')} placeholder="React, Node.js, MongoDB" />
          <Select label="Status" options={statusOptions} value={formData.status} onChange={set('status')} />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Input label="GitHub URL" value={formData.githubUrl} onChange={set('githubUrl')} placeholder="https://github.com/..." />
          <Input label="Live URL" value={formData.liveUrl} onChange={set('liveUrl')} placeholder="https://..." />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Completion Date" type="date" value={formData.completionDate} onChange={set('completionDate')} />
          <Input label="Video URL" value={formData.video?.url || ''} onChange={(e) => setFormData({ ...formData, video: { publicId: '', url: e.target.value } })} placeholder="https://..." />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">Project Images</label>
          <FileDropZone onDrop={handleDrop} accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }} multiple />
          {imagePreviews.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {imagePreviews.map((url, idx) => (
                <div key={idx} className="group relative">
                  <img src={url} alt="" className="h-20 w-20 rounded-xl object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={formData.isFeatured}
            onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
            className={cn(
              'relative h-6 w-10 flex-shrink-0 rounded-full transition-colors',
              formData.isFeatured ? 'bg-primary' : 'bg-white/10',
            )}
          >
            <span
              className={cn(
                'absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform',
                formData.isFeatured && 'translate-x-4',
              )}
            />
          </button>
          <span className="text-sm font-medium text-text-secondary">Featured project</span>
        </label>

        <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            {isEdit ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
