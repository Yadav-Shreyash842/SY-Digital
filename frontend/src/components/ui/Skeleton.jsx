import { cn } from '../../utils/cn'

export default function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-white/10', className)}
      aria-hidden="true"
      {...props}
    />
  )
}

export function SkeletonCard({ theme = 'dark' }) {
  return (
    <div className={cn('rounded-card border p-6', theme === 'dark' ? 'border-border bg-card-bg' : 'border-gray-200 bg-white')}>
      <Skeleton className="mb-4 h-10 w-10" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-2/3" />
    </div>
  )
}

export function SkeletonTable({ rows = 5, theme = 'light' }) {
  return (
    <div className={cn('rounded-card border overflow-hidden', theme === 'dark' ? 'border-border' : 'border-gray-200 bg-white')}>
      <Skeleton className="h-12 w-full rounded-none" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="mx-4 my-3 h-10 w-[calc(100%-2rem)]" />
      ))}
    </div>
  )
}
