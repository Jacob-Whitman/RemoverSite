import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, type SignupFormData } from '../../lib/validation'
import { signUp } from '../../lib/auth'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Alert } from '../ui/Alert'

interface SignupFormProps {
  onSuccess: () => void
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  async function onSubmit(data: SignupFormData) {
    setError('')
    try {
      await signUp(data.email, data.password)
      onSuccess()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign up failed. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Input label="Email address" type="email" required autoComplete="email" error={errors.email?.message} {...register('email')} />
      <Input label="Password" type="password" required autoComplete="new-password" hint="Minimum 8 characters" error={errors.password?.message} {...register('password')} />
      <Input label="Confirm password" type="password" required autoComplete="new-password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
      {error && <Alert variant="danger">{error}</Alert>}
      <Button type="submit" loading={isSubmitting} className="w-full" size="lg">Create account</Button>
    </form>
  )
}
