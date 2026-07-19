import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setSent(true)
    toast.success('Reset link sent!')
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Forgot password?</h1>
      <p className="mb-8 text-text-secondary">Enter your email and we&apos;ll send a reset link</p>

      {sent ? (
        <Alert type="success" title="Check your inbox">
          We&apos;ve sent a password reset link to your email address.
        </Alert>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input label="Email" type="email" placeholder="you@company.com" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
          <Button type="submit" variant="primary" className="w-full" loading={loading}>Send Reset Link</Button>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-text-secondary">
        <Link to="/login" className="font-semibold text-primary-purple hover:text-secondary-purple">Back to sign in</Link>
      </p>
    </div>
  )
}
