import { useState } from 'react'
import Modal from '../../ui/Modal'
import Input from '../../ui/Input'
import Textarea from '../../ui/Textarea'
import Select from '../../ui/Select'
import Button from '../../ui/Button'
import FileDropZone from '../../ui/FileDropZone'
import uploadService from '../../../services/upload.service'
import { cn } from '../../../utils/cn'

const categoryOptions = [
  { value: 'technology', label: 'Technology' },
  { value: 'business', label: 'Business' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'general', label: 'General' },
]

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

const emptyForm = {
  title: '',
  shortDescription: '',
  content: '',
  category: 'general',
  tags: '',
  author: '',
  readTime: '',
  seoTitle: '',
  seoDescription: '',
  status: 'draft',
  isFeatured: false,
  featuredImage: null,
}

export default function BlogFormModal({
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
          content: initialData.content || '',
          category: initialData.category || 'general',
          tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags || '',
          author: initialData.author || '',
          readTime: initialData.readTime ?? '',
          seoTitle: initialData.seoTitle || '',
          seoDescription: initialData.seoDescription || '',
          status: initialData.status || 'draft',
          isFeatured: initialData.isFeatured || false,
          featuredImage: initialData.featuredImage || null,
        }
      : { ...emptyForm }
  )

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(initialData?.featuredImage?.url || null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!formData.title?.trim()) e.title = 'Title is required'
    if (!formData.shortDescription?.trim()) e.shortDescription = 'Short description is required'
    if (!formData.content?.trim()) e.content = 'Content is required'
    if (!formData.author?.trim()) e.author = 'Author is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const buildPayload = () => {
    const payload = {
      title: formData.title,
      shortDescription: formData.shortDescription,
      content: formData.content,
      category: formData.category,
      tags: formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      author: formData.author,
      readTime: formData.readTime ? Number(formData.readTime) : undefined,
      seoTitle: formData.seoTitle,
      seoDescription: formData.seoDescription,
      status: formData.status,
      isFeatured: formData.isFeatured,
    }
    if (formData.featuredImage && typeof formData.featuredImage === 'object' && formData.featuredImage.publicId) {
      payload.featuredImage = formData.featuredImage
    }
    return payload
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      let imageData = formData.featuredImage
      if (imageFile) {
        const uploadRes = await uploadService.uploadImage(imageFile)
        imageData = uploadRes?.data
      }
      const payload = buildPayload()
      if (imageData) payload.featuredImage = imageData
      await onSubmit(payload)
      onClose()
    } catch (err) {
      // error is handled by the parent via toast
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (files) => {
    if (files?.[0]) {
      setImageFile(files[0])
      setImagePreview(URL.createObjectURL(files[0]))
    }
  }

  const set = (field) => (e) => setFormData({ ...formData, [field]: e?.target?.value ?? e })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Blog Post' : 'New Blog Post'} size="xl">
      <div className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Title" value={formData.title} onChange={set('title')} error={errors.title} />
          <Select label="Category" options={categoryOptions} value={formData.category} onChange={set('category')} />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Author" value={formData.author} onChange={set('author')} error={errors.author} />
          <Input label="Read Time (minutes)" type="number" value={formData.readTime} onChange={set('readTime')} placeholder="e.g. 5" />
        </div>

        <Textarea label="Short Description" value={formData.shortDescription} onChange={set('shortDescription')} error={errors.shortDescription} rows={2} />

        <Textarea label="Content" value={formData.content} onChange={set('content')} error={errors.content} rows={8} />

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Tags (comma separated)"
            value={formData.tags}
            onChange={set('tags')}
            placeholder="react, javascript, web"
          />
          <Select label="Status" options={statusOptions} value={formData.status} onChange={set('status')} />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Input label="SEO Title" value={formData.seoTitle} onChange={set('seoTitle')} />
          <Textarea label="SEO Description" value={formData.seoDescription} onChange={set('seoDescription')} rows={2} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">Featured Image</label>
          <FileDropZone onDrop={handleDrop} accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }} />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-3 h-24 w-24 rounded-xl object-cover" />
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
          <span className="text-sm font-medium text-text-secondary">Featured blog post</span>
        </label>

        <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            {isEdit ? 'Save Changes' : 'Create Post'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
