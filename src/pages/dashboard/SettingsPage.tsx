import { useAuth } from '../../lib/authContext'
import { Card } from '../../components/ui/Card'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'

export function SettingsPage() {
  const { user, profile } = useAuth()

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold text-navy-900">Account settings</h1>

      <Card>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Account</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Email</dt>
            <dd className="text-slate-800">{user?.email ?? '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Role</dt>
            <dd className="text-slate-800 capitalize">{profile?.role ?? 'user'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Member since</dt>
            <dd className="text-slate-800">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</dd>
          </div>
        </dl>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Profile</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Name</dt>
            <dd className="text-slate-800">
              {[profile?.legal_first_name, profile?.legal_last_name].filter(Boolean).join(' ') || '—'}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Location</dt>
            <dd className="text-slate-800">
              {[profile?.current_city, profile?.current_state].filter(Boolean).join(', ') || '—'}
            </dd>
          </div>
        </dl>
        <div className="mt-4">
          <Link to={ROUTES.dashboardIntake} className="text-sm text-navy-700 font-medium hover:underline">
            Update profile →
          </Link>
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-slate-700 mb-2">Data and privacy</h2>
        <p className="text-sm text-slate-600 mb-4">
          You may request deletion of your account and all associated data at any time.
        </p>
        <Link to={ROUTES.dashboardDeleteRequest} className="text-sm text-red-600 font-medium hover:underline">
          Request account deletion →
        </Link>
      </Card>
    </div>
  )
}
