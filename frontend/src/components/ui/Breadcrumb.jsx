import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function Breadcrumb({ items = [], theme = 'dark', className = '' }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-2 text-sm', className)}>
      <Link
        to="/"
        className={cn('flex items-center gap-1 transition-colors hover:text-primary-purple', theme === 'dark' ? 'text-text-muted' : 'text-gray-500')}
      >
        <Home strokeWidth={1.75} className="h-4 w-4" />
      </Link>
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-2">
          <ChevronRight strokeWidth={1.75} className={cn('h-4 w-4', theme === 'dark' ? 'text-text-muted' : 'text-gray-400')} />
          {item.href ? (
            <Link
              to={item.href}
              className={cn('transition-colors hover:text-primary-purple', theme === 'dark' ? 'text-text-secondary' : 'text-gray-600')}
            >
              {item.label}
            </Link>
          ) : (
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900 font-medium'}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
