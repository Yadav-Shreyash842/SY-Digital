import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import Button from '../../components/ui/Button'

export default function EmailVerificationPage() {
  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-purple/20">
        <Mail strokeWidth={1.75} className="h-8 w-8 text-primary-purple" />
      </div>
      <h1 className="mb-2 text-2xl font-bold">Verify your email</h1>
      <p className="mb-8 text-text-secondary">
        We&apos;ve sent a verification link to your email address. Please check your inbox and click the link to verify your account.
      </p>
      <Button variant="secondary" className="w-full mb-4">Resend Verification Email</Button>
      <Link to="/login" className="text-sm font-semibold text-primary-purple hover:text-secondary-purple">
        Back to sign in
      </Link>
    </div>
  )
}
