import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { LoginForm } from '../../components/auth/LoginForm'
import { ROUTES } from '../../lib/routes'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? ROUTES.dashboard

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
          <h1 className="text-xl font-bold text-slate-900 mb-6">Sign in to your account</h1>
          <LoginForm onSuccess={() => navigate(from, { replace: true })} />
          <p className="text-sm text-slate-500 mt-6 text-center">
            Don't have an account?{' '}
            <Link to={ROUTES.signup} className="text-navy-700 font-medium hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
