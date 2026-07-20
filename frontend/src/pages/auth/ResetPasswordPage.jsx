import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import authService from '../../services/auth.service'

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const password = watch('password')

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Invalid or missing reset token')
      return
    }
    setLoading(true)
    try {
      await authService.resetPassword(token, data.password)
      setSuccess(true)
      toast.success('Password updated successfully!')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div>
        <Alert type="error" title="Invalid link">
          This password reset link is invalid or has expired.
        </Alert>
        <p className="mt-8 text-center text-sm text-text-secondary">
          <Link to="/forgot-password" className="font-semibold text-primary hover:text-primary">Request a new reset link</Link>
        </p>
      </div>
    )
  }

  if (success) {
    return (
      <div>
        <Alert type="success" title="Password updated">
          Your password has been updated successfully.
        </Alert>
        <p className="mt-8 text-center text-sm text-text-secondary">
          <Link to="/login" className="font-semibold text-primary hover:text-primary">Sign in with new password</Link>
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Reset password</h1>
      <p className="mb-8 text-text-secondary">Enter your new password below</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input label="New Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })} />
        <Input label="Confirm Password" type="password" placeholder="••••••••" error={errors.confirm?.message} {...register('confirm', { required: 'Please confirm', validate: (v) => v === password || 'Passwords do not match' })} />
        <Button type="submit" variant="primary" className="w-full" loading={loading}>Update Password</Button>
      </form>

      <p className="mt-8 text-center text-sm text-text-secondary">
        <Link to="/login" className="font-semibold text-primary hover:text-primary">Back to sign in</Link>
      </p>
    </div>
  )
}
