import { useState, useEffect } from 'react'
import Modal from '../../ui/Modal'
import Input from '../../ui/Input'
import Textarea from '../../ui/Textarea'
import Select from '../../ui/Select'
import Button from '../../ui/Button'
import FileDropZone from '../../ui/FileDropZone'
import uploadService from '../../../services/upload.service'
import serviceService from '../../../services/service.service'
import { cn } from '../../../utils/cn'

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

const emptyForm = {
  clientName: '',
  clientEmail: '',
  company: '',
  service: '',
  rating: 5,
  review: '',
  status: 'pending',
  isFeatured: false,
  profileImage: null,
}

function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="cursor-pointer transition-colors"
        >
          <Star
            strokeWidth={1.75}
            className={cn(
              'h-6 w-6',
              star <= (hover || value) ? 'fill-warning text-warning' : 'text-text-muted',
            )}
          />
        </button>
      ))}
    </div>
  )
}

export default function ReviewFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const isEdit = !!initialData?._id

  const [formData, setFormData] = useState(
    initialData
      ? {
          clientName: initialData.clientName || '',
          clientEmail: initialData.clientEmail || '',
          company: initialData.company || '',
          service: initialData.service?._id || initialData.service || '',
          rating: initialData.rating || 5,
          review: initialData.review || '',
          status: initialData.status || 'pending',
          isFeatured: initialData.featured || false,
          profileImage: initialData.profileImage || null,
        }
      : { ...emptyForm }
  )

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(initialData?.profileImage?.url || null)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      serviceService.list({ limit: 100 }).then((res) => {
        setServices(res?.data?.services || [])
      }).catch(() => {})
    }
  }, [isOpen])

  const validate = () => {
    const e = {}
    if (!formData.clientName?.trim()) e.clientName = 'Client name is required'
    if (!formData.clientEmail?.trim()) e.clientEmail = 'Client email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) e.clientEmail = 'Valid email is required'
    if (!formData.service) e.service = 'Service is required'
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) e.rating = 'Rating must be between 1 and 5'
    if (!formData.review?.trim()) e.review = 'Review is required'
    else if (formData.review.trim().length < 10) e.review = 'Review must be at least 10 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const buildPayload = () => {
    return {
      clientName: formData.clientName.trim(),
      clientEmail: formData.clientEmail.trim(),
      company: formData.company.trim(),
      service: formData.service,
      rating: Number(formData.rating),
      review: formData.review.trim(),
      status: formData.status,
      featured: formData.isFeatured,
    }
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      let imageData = formData.profileImage
      if (imageFile) {
        const uploadRes = await uploadService.uploadImage(imageFile)
        imageData = uploadRes?.data
      }
      const payload = buildPayload()
      if (imageData) payload.profileImage = imageData
      await onSubmit(payload)
      onClose()
    } catch (err) {
      // error is handled by parent via toast
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

  const serviceOptions = [
    { value: '', label: 'Select a service' },
    ...services.map((s) => ({ value: s._id, label: s.title })),
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Review' : 'Add Review'} size="xl">
      <div className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Client Name" value={formData.clientName} onChange={set('clientName')} error={errors.clientName} placeholder="John Doe" />
          <Input label="Client Email" type="email" value={formData.clientEmail} onChange={set('clientEmail')} error={errors.clientEmail} placeholder="john@example.com" />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Company" value={formData.company} onChange={set('company')} placeholder="Company Name (optional)" />
          <Select label="Service" options={serviceOptions} value={formData.service} onChange={set('service')} error={errors.service} />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-secondary">Rating</label>
          <StarInput value={formData.rating} onChange={(val) => setFormData({ ...formData, rating: val })} />
          {errors.rating && <p className="text-sm text-danger">{errors.rating}</p>}
        </div>

        <Textarea label="Review" value={formData.review} onChange={set('review')} error={errors.review} rows={4} placeholder="Write the review text..." />

        <div className="grid gap-5 md:grid-cols-2">
          <Select label="Status" options={statusOptions} value={formData.status} onChange={set('status')} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">Profile Image</label>
          <FileDropZone onDrop={handleDrop} accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }} />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-3 h-16 w-16 rounded-full object-cover" />
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
          <span className="text-sm font-medium text-text-secondary">Featured review</span>
        </label>

        <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            {isEdit ? 'Save Changes' : 'Create Review'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
