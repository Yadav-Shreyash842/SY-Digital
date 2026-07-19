import React from 'react'

export default function ButtonLoader({ className = '' }) {
  return <span className={`inline-block h-4 w-12 bg-slate-700 rounded animate-pulse ${className}`} />
}
