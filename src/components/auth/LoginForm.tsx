import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '../../lib/validation'
import { signIn } from '../../lib/auth'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Alert } from '../ui/Alert'
import { ROUTES } from '../../lib/routes'

interface LoginFormProps {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  async function onSubmit(data: LoginFormData) {
    setError('')
    try {
      await signIn(data.email, data.password)
      onSuccess()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign in failed. Check your credentials.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Input label="Email address" type="email" required autoComplete="email" error={errors.email?.message} {...register('email')} />
      <div className="space-y-1">
        <Input label="Password" type="password" required autoComplete="current-password" error={errors.password?.message} {...register('password')} />
        <div className="flex justify-end">
          <Link to={ROUTES.forgotPassword} className="text-xs text-navy-700 hover:underline">
            Forgot password?
          </Link>
        </div>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button type="submit" loading={isSubmitting} className="w-full" size="lg">Sign in</Button>
    </form>
  )
}
