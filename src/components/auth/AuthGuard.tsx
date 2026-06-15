import { Navigate, useLocation } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { useAuth } from '../../lib/authContext'
import type { ReactNode } from 'react'

interface AuthGuardProps {
  children: ReactNode
}

// Paths where onboarding redirects must not fire — otherwise infinite loops.
const ONBOARDING_PATHS = [ROUTES.dashboardConsent, ROUTES.dashboardIntake]

// Protects routes that require authentication.
// Also enforces the onboarding funnel: consent → intake → dashboard.
// Authorization (data access) is enforced by Supabase RLS — this is UI-only.
export function AuthGuard({ children }: AuthGuardProps) {
  const { user, profile, hasConsent, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 text-sm">
        Loading...
      </div>
    )
  }

  if (!user) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />
  }

  // Don't redirect if the user is already on an onboarding page.
  if (!ONBOARDING_PATHS.includes(location.pathname)) {
    if (!hasConsent) {
      return <Navigate to={ROUTES.dashboardConsent} replace />
    }
    if (!profile?.legal_first_name) {
      return <Navigate to={ROUTES.dashboardIntake} replace />
    }
  }

  return <>{children}</>
}
