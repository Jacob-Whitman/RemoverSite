import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Shield } from 'lucide-react'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../../lib/validation'
import { requestPasswordReset } from '../../lib/auth'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { ROUTES } from '../../lib/routes'

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  async function onSubmit(data: ForgotPasswordFormData) {
    setError('')
    try {
      await requestPasswordReset(data.email)
      setSent(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 text-navy-800">
            <Shield className="h-7 w-7 text-navy-700" />
            <span className="font-semibold text-lg">Baseline Solutions</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
          <h1 className="text-xl font-bold text-slate-900 mb-1">Reset your password</h1>

          {sent ? (
            <div className="mt-4 space-y-4">
              <Alert variant="success">
                Check your email — we sent a reset link to your address. It may take a minute to arrive.
              </Alert>
              <p className="text-sm text-slate-500 text-center">
                <Link to={ROUTES.login} className="text-navy-700 font-medium hover:underline">
                  Back to sign in
                </Link>
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-6">
                Enter your account email and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  required
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register('email')}
                />
                {error && <Alert variant="danger">{error}</Alert>}
                <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
                  Send reset link
                </Button>
              </form>
              <p className="text-sm text-slate-500 mt-6 text-center">
                <Link to={ROUTES.login} className="text-navy-700 font-medium hover:underline">
                  Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
