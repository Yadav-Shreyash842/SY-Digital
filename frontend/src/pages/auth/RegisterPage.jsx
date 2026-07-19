import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Checkbox from '../../components/ui/Checkbox'
import { register as registerUser } from '../../services/auth'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const password = watch('password')
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const [firstName, ...lastNameParts] = (data.name || '').trim().split(/\s+/)
      const lastName = lastNameParts.join(' ') || 'User'

      await registerUser({
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
        <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })} />
        <Input label="Confirm Password" type="password" placeholder="••••••••" error={errors.confirm?.message} {...register('confirm', { required: 'Please confirm password', validate: (v) => v === password || 'Passwords do not match' })} />
        <Checkbox label="I agree to the Terms & Conditions" {...register('terms', { required: true })} />
        <Button type="submit" variant="primary" className="w-full" loading={loading} disabled={!!errors.terms}>
          Create Account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary-purple hover:text-secondary-purple">Sign in</Link>
      </p>
    </div>
  )
}
