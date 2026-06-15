import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Shield } from 'lucide-react'
import { resetPasswordSchema, type ResetPasswordFormData } from '../../lib/validation'
import { updatePassword, signOut } from '../../lib/auth'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { ROUTES } from '../../lib/routes'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  async function onSubmit(data: ResetPasswordFormData) {
    setError('')
    try {
      await updatePassword(data.password)
      setDone(true)
      // Sign out so the recovery session is cleared, then send to login.
      await signOut()
      setTimeout(() => navigate(ROUTES.login, { replace: true }), 2000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update password. Please try again.')
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
          <h1 className="text-xl font-bold text-slate-900 mb-1">Set a new password</h1>

          {done ? (
            <div className="mt-4">
              <Alert variant="success">
                Password updated. Redirecting you to sign in…
              </Alert>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-6">
                Choose a strong password for your account.
              </p>
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <Input
                  label="New password"
                  type="password"
                  required
                  autoComplete="new-password"
                  hint="Minimum 8 characters"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <Input
                  label="Confirm new password"
                  type="password"
                  required
                  autoComplete="new-password"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
                {error && <Alert variant="danger">{error}</Alert>}
                <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
                  Update password
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
