export default function NetworkError({ onRetry }) {
  return (
    <div className="py-8 text-center">
      <p className="mb-4 text-text-secondary">Network error. Please check your connection.</p>
      {onRetry && (
        <button className="rounded-btn bg-primary px-6 py-2 text-sm font-medium text-white transition-all hover:brightness-110" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  )
}
