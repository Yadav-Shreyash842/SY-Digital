import Spinner from '../ui/Spinner'

export default function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading page">
      <Spinner size="lg" />
    </div>
  )
}
