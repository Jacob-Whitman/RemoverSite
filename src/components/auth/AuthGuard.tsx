import { Navigate, useLocation } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { useAuth } from '../../lib/authContext'
import type { ReactNode } from 'react'

interface AuthGuardProps {
  children: ReactNode
}

// Protects routes that require authentication.
// Authorization (data access) is enforced by Supabase RLS — this is UI-only.
export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()
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

  return <>{children}</>
}
