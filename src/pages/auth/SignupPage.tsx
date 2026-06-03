import { Link, useNavigate } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { SignupForm } from '../../components/auth/SignupForm'
import { ROUTES } from '../../lib/routes'

export function SignupPage() {
  const navigate = useNavigate()

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
          <h1 className="text-xl font-bold text-slate-900 mb-1">Create your account</h1>
          <p className="text-sm text-slate-500 mb-6">You'll complete your profile after sign up.</p>
          <SignupForm onSuccess={() => navigate(ROUTES.dashboardConsent, { replace: true })} />
          <p className="text-sm text-slate-500 mt-6 text-center">
            Already have an account?{' '}
            <Link to={ROUTES.login} className="text-navy-700 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
