import { Home } from 'lucide-react'
import Button from '../../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-bg px-4">
      <div className="text-center">
        <p className="mb-4 text-8xl font-extrabold bg-gradient-to-r from-primary to-accent-cyan bg-clip-text text-transparent">404</p>
        <h1 className="mb-4 text-2xl font-bold sm:text-3xl">Page Not Found</h1>
        <p className="mb-8 max-w-md text-text-secondary">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button variant="primary" as="a" href="/">
          <Home strokeWidth={1.75} className="h-5 w-5" />
          Back to Home
        </Button>
      </div>
    </div>
  )
}
