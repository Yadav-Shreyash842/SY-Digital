import { useState, useRef, useEffect } from 'react'
import { MoreVertical, Eye, Pencil, Trash2 } from 'lucide-react'
import { cn } from '../../../utils/cn'

const menuItems = [
  { key: 'view', label: 'View', icon: Eye },
  { key: 'edit', label: 'Edit', icon: Pencil },
  { key: 'delete', label: 'Delete', icon: Trash2, danger: true },
]

export default function UserActionsDropdown({ user, onView, onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const handleAction = (key) => {
    setOpen(false)
    if (key === 'view') onView?.(user)
    else if (key === 'edit') onEdit?.(user)
    else if (key === 'delete') onDelete?.(user)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/10 hover:text-white"
      >
        <MoreVertical strokeWidth={1.75} className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-40 overflow-hidden rounded-xl border border-white/10 bg-[#1a1a2e] shadow-2xl">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleAction(item.key)}
              className={cn(
                'flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors',
                item.danger
                  ? 'text-danger hover:bg-danger/10'
                  : 'text-text-secondary hover:bg-white/[0.06] hover:text-white',
              )}
            >
              <item.icon strokeWidth={1.75} className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
