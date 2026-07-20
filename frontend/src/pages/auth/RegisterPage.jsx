import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Checkbox from '../../components/ui/Checkbox'
import authService from '../../services/auth.service'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const password = watch('password') || ''
  const navigate = useNavigate()

  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const [firstName, ...lastNameParts] = (data.name || '').trim().split(/\s+/)
      const lastName = lastNameParts.join(' ') || 'User'

      await authService.register({
        firstName,
        lastName,
        email: data.email,
        password: data.password,
      })
      toast.success('Account created successfully!')
      navigate('/login')
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Create account</h1>
      <p className="mb-8 text-text-secondary">Start your journey with SY Digital</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input label="Full Name" placeholder="John Doe" error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
        <Input label="Email" type="email" placeholder="you@company.com" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
        <div>
          <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })} />
          {password && (
            <div className="mt-2 space-y-1 text-xs">
              <div className={hasMinLength ? 'text-green-500' : 'text-red-400'}>
                {hasMinLength ? '✓' : '○'} At least 8 characters
              </div>
              <div className={hasUppercase ? 'text-green-500' : 'text-red-400'}>
                {hasUppercase ? '✓' : '○'} One uppercase letter
              </div>
              <div className={hasLowercase ? 'text-green-500' : 'text-red-400'}>
                {hasLowercase ? '✓' : '○'} One lowercase letter
              </div>
              <div className={hasNumber ? 'text-green-500' : 'text-red-400'}>
                {hasNumber ? '✓' : '○'} One number
              </div>
            </div>
          )}
        </div>
        <Input label="Confirm Password" type="password" placeholder="••••••••" error={errors.confirm?.message} {...register('confirm', { required: 'Please confirm password', validate: (v) => v === password || 'Passwords do not match' })} />
        <Checkbox label="I agree to the Terms & Conditions" {...register('terms', { required: true })} />
        <Button type="submit" variant="primary" className="w-full" loading={loading} disabled={!!errors.terms}>
          Create Account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary hover:text-primary">Sign in</Link>
      </p>
    </div>
  )
}
