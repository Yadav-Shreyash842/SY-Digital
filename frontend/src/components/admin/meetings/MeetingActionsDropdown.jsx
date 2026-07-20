import { useState } from 'react'
import { MoreHorizontal, Eye, CheckCircle, XCircle, CalendarClock, Ban } from 'lucide-react'
import Dropdown from '../../ui/Dropdown'

export default function MeetingActionsDropdown({ meeting, onView, onApprove, onReject, onComplete, onReschedule, onCancel }) {
  const [open, setOpen] = useState(false)

  const items = [
    { icon: Eye, label: 'View', onClick: () => onView?.(meeting) },
  ]

  if (meeting.status === 'pending') {
    items.push({ icon: CheckCircle, label: 'Approve', onClick: () => onApprove?.(meeting) })
    items.push({ icon: XCircle, label: 'Reject', onClick: () => onReject?.(meeting), variant: 'danger' })
  }

  if (meeting.status === 'approved') {
    items.push({ icon: CheckCircle, label: 'Complete', onClick: () => onComplete?.(meeting) })
    items.push({ icon: CalendarClock, label: 'Reschedule', onClick: () => onReschedule?.(meeting) })
    items.push({ icon: Ban, label: 'Cancel', onClick: () => onCancel?.(meeting), variant: 'danger' })
  }

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
        onClick: () => item.onClick(),
      }))}
    />
  )
}
