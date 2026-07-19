import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const password = watch('password')

  const onSubmit = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    toast.success('Password updated successfully!')
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
        <Link to="/login" className="font-semibold text-primary-purple hover:text-secondary-purple">Back to sign in</Link>
      </p>
    </div>
  )
}
