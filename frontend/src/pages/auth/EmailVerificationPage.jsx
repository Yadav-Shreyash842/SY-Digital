import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, CheckCircle2, XCircle } from 'lucide-react'
import Button from '../../components/ui/Button'
import authService from '../../services/auth.service'
import toast from 'react-hot-toast'

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const email = searchParams.get('email') || ''

  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    let cancelled = false

    const run = async () => {
      setVerifying(true)
      try {
        await authService.verifyEmail(token)
        if (cancelled) return
        setVerified(true)
        toast.success('Email verified successfully')
      } catch (err) {
        if (cancelled) return
        setError(err?.response?.data?.message || 'Verification failed')
      } finally {
        if (!cancelled) setVerifying(false)
      }
    }

    run()
    return () => { cancelled = true }
  }, [token])

  const handleResend = async () => {
    setSending(true)
    try {
      await authService.sendVerification(email)
      toast.success('Verification email sent. Check your inbox.')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send verification email')
    } finally {
      setSending(false)
    }
  }

  let body
  if (verifying) {
    body = (
      <>
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
          <Mail strokeWidth={1.75} className="h-8 w-8 animate-pulse text-primary" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Verifying your email...</h1>
        <p className="mb-8 text-text-secondary">Please wait while we confirm your address.</p>
      </>
    )
  } else if (verified) {
    body = (
      <>
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-success/20">
          <CheckCircle2 strokeWidth={1.75} className="h-8 w-8 text-success" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Email verified!</h1>
        <p className="mb-8 text-text-secondary">
          Your account is now active. You can sign in to get started.
        </p>
        <Button className="w-full mb-4" onClick={() => navigate('/login')}>
          Go to Sign In
        </Button>
      </>
    )
  } else if (error) {
    body = (
      <>
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/20">
          <XCircle strokeWidth={1.75} className="h-8 w-8 text-danger" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Verification failed</h1>
        <p className="mb-8 text-text-secondary">{error}</p>
        <Button variant="secondary" className="w-full mb-4" onClick={() => navigate('/register')}>
          Create a new account
        </Button>
      </>
    )
  } else {
    body = (
      <>
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
          <Mail strokeWidth={1.75} className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Verify your email</h1>
        <p className="mb-8 text-text-secondary">
          We&apos;ve sent a verification link to your email address. Please check your inbox and click the link to verify your account.
        </p>
        <Button variant="secondary" className="w-full mb-4" loading={sending} onClick={handleResend}>
          Resend Verification Email
        </Button>
      </>
    )
  }

  return (
    <div className="text-center">
      {body}
      <Link to="/login" className="text-sm font-semibold text-primary hover:text-primary">
        Back to sign in
      </Link>
    </div>
  )
}
