import React from 'react'

export default function EmptyState({ title = 'No results', subtitle }) {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-semibold">{title}</h3>
      {subtitle && <p className="mt-2 text-text-secondary">{subtitle}</p>}
    </div>
  )
}
