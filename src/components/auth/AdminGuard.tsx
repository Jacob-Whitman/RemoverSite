import { Navigate } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { useAuth } from '../../lib/authContext'
import type { ReactNode } from 'react'

interface AdminGuardProps {
  children: ReactNode
}

// Protects admin routes. Checks profile.role === 'admin'.
// This is a UI guard only. Backend RLS and Edge Function checks are the
// authoritative access boundary.
export function AdminGuard({ children }: AdminGuardProps) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 text-sm">
        Loading...
      </div>
    )
  }

  if (!user) {
    return <Navigate to={ROUTES.login} replace />
  }

  if (profile?.role !== 'admin') {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return <>{children}</>
}
