import { useState } from 'react'
import { MoreHorizontal, Eye, Pencil, CheckCircle, XCircle, Star, StarOff, Trash2 } from 'lucide-react'
import Dropdown from '../../ui/Dropdown'

export default function ReviewActionsDropdown({ review, onView, onEdit, onApprove, onReject, onToggleFeatured, onDelete }) {
  const [open, setOpen] = useState(false)

  const items = [
    { icon: Eye, label: 'View', onClick: () => onView?.(review) },
    { icon: Pencil, label: 'Edit', onClick: () => onEdit?.(review) },
  ]

  if (review.status === 'pending') {
    items.push(
      { icon: CheckCircle, label: 'Approve', onClick: () => onApprove?.(review) },
      { icon: XCircle, label: 'Reject', onClick: () => onReject?.(review) },
    )
  }

  items.push({
    icon: review.featured ? StarOff : Star,
    label: review.featured ? 'Unfeature' : 'Feature',
    onClick: () => onToggleFeatured?.(review),
  })

  items.push({ icon: Trash2, label: 'Delete', onClick: () => onDelete?.(review), variant: 'danger' })

  return (
    <Dropdown
      isOpen={open}
      onClose={() => setOpen(false)}
      align="right"
      trigger={
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
          className="flex h-8 w-8 items-center justify-center rounded-btn border border-border text-text-muted transition-all hover:border-white/20 hover:bg-white/5 hover:text-white"
        >
          <MoreHorizontal strokeWidth={1.75} className="h-4 w-4" />
        </button>
      }
      items={items.map((item) => ({
        ...item,
        icon: item.icon,
        onClick: () => item.onClick(),
      }))}
    />
  )
}
