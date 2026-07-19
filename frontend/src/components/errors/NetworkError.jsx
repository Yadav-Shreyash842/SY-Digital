import React from 'react'

export default function NetworkError({ onRetry }) {
  return (
    <div className="text-center py-8">
      <p className="mb-4">Network error. Please check your connection.</p>
      {onRetry && (
        <button className="btn" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  )
}
