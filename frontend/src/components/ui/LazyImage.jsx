import { useState } from 'react'
import { cn } from '../../utils/cn'

export default function LazyImage({ src, alt, gradient, aspectRatio = '4/3', className = '' }) {
  const [loaded, setLoaded] = useState(false)

  if (!src && gradient) {
    return (
      <div
        className={cn('relative overflow-hidden rounded-card', className)}
        style={{ aspectRatio }}
      >
        <div className={cn('absolute inset-0 bg-gradient-to-br', gradient)} />
        <div className="absolute inset-0 grid-pattern opacity-30" />
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden rounded-card bg-white/5', className)} style={{ aspectRatio }}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-white/10" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  )
}
