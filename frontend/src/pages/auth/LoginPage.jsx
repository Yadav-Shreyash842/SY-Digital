import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Checkbox from '../../components/ui/Checkbox'
import useAuth from '../../hooks/useAuth'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const navigate = useNavigate()
  const { login } = useAuth()

  const onSubmit = async (data) => {
    try {
      setLoading(true)

      const payload = await login(data.email, data.password)

      toast.success('Welcome back!')

      if (payload?.user?.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/client', { replace: true })
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'Login failed'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">
        Welcome back
      </h1>

      <p className="mb-8 text-text-secondary">
        Sign in to your SY Digital account
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <Input
          label="Email"
          type="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
          })}
        />

        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            {...register('remember')}
          />

          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:text-primary"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={loading}
        >
          Sign In
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-text-secondary">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-semibold text-primary hover:text-primary"
        >
          Create account
        </Link>
      </p>
    </div>
  )
}