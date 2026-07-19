import React from 'react'

export default function Skeleton({ className = 'h-6 w-full bg-slate-700 rounded animate-pulse' }) {
  return <div className={className} />
}
