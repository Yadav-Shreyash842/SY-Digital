import { useState } from 'react'
import Modal from '../../ui/Modal'
import Input from '../../ui/Input'
import Textarea from '../../ui/Textarea'
import Select from '../../ui/Select'
import Button from '../../ui/Button'
import FileDropZone from '../../ui/FileDropZone'
import uploadService from '../../../services/upload.service'

const categoryOptions = [
  { value: 'Web Development', label: 'Web Development' },
  { value: 'UI/UX Design', label: 'UI/UX Design' },
  { value: 'Digital Marketing', label: 'Digital Marketing' },
  { value: 'Strategy', label: 'Strategy' },
  { value: 'Consulting', label: 'Consulting' },
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
  category: 'Web Development',
  price: '',
  discountPrice: '',
  duration: '',
  technologies: '',
  features: '',
  image: null,
  status: 'draft',
  isFeatured: false,
}

export default function ServiceFormModal({
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
          category: initialData.category || 'Web Development',
          price: initialData.price ?? '',
          discountPrice: initialData.discountPrice ?? '',
          duration: initialData.duration || '',
          technologies: (initialData.technologies || []).join(', '),
          features: (initialData.features || []).join('\n'),
          image: initialData.image || null,
          status: initialData.status || 'draft',
          isFeatured: initialData.isFeatured || false,
        }
      : { ...emptyForm }
  )

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(initialData?.image?.url || null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!formData.title?.trim()) e.title = 'Title is required'
    if (!formData.description?.trim()) e.description = 'Description is required'
    if (!formData.price || isNaN(formData.price)) e.price = 'Valid price is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const buildPayload = () => {
    const payload = {
      title: formData.title,
      shortDescription: formData.shortDescription,
      description: formData.description,
      category: formData.category,
      price: Number(formData.price) || 0,
      discountPrice: Number(formData.discountPrice) || 0,
      duration: formData.duration,
      technologies: formData.technologies
        ? formData.technologies.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      features: formData.features
        ? formData.features.split('\n').map((f) => f.trim()).filter(Boolean)
        : [],
      status: formData.status,
      isFeatured: formData.isFeatured,
    }
    if (formData.image && typeof formData.image === 'object' && formData.image.publicId) {
      payload.image = formData.image
    }
    return payload
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      let imageData = formData.image
      if (imageFile) {
        const uploadRes = await uploadService.uploadImage(imageFile)
        imageData = uploadRes?.data
      }
      const payload = buildPayload()
      if (imageData) payload.image = imageData
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
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Service' : 'Add Service'} size="xl">
      <div className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Title" value={formData.title} onChange={set('title')} error={errors.title} />
          <Select label="Category" options={categoryOptions} value={formData.category} onChange={set('category')} />
        </div>

        <Textarea label="Short Description" value={formData.shortDescription} onChange={set('shortDescription')} rows={2} />

        <Textarea label="Description" value={formData.description} onChange={set('description')} error={errors.description} rows={4} />

        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Price (₹)" type="number" value={formData.price} onChange={set('price')} error={errors.price} />
          <Input label="Discount Price (₹)" type="number" value={formData.discountPrice} onChange={set('discountPrice')} />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Duration" value={formData.duration} onChange={set('duration')} placeholder="e.g. 2-4 weeks" />
          <Select label="Status" options={statusOptions} value={formData.status} onChange={set('status')} />
        </div>

        <Input
          label="Technologies (comma separated)"
          value={formData.technologies}
          onChange={set('technologies')}
          placeholder="React, Node.js, MongoDB"
        />

        <Textarea label="Features (one per line)" value={formData.features} onChange={set('features')} rows={4} />

        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">Image</label>
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
          <span className="text-sm font-medium text-text-secondary">Featured service</span>
        </label>

        <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            {isEdit ? 'Save Changes' : 'Create Service'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
