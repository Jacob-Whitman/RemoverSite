import { useNavigate } from 'react-router-dom'
import { IntakeForm } from '../../components/forms/IntakeForm'
import { useAuth } from '../../lib/authContext'
import { ROUTES } from '../../lib/routes'

export function IntakePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-navy-900 mb-2">Profile intake</h1>
      <p className="text-slate-600 mb-8 text-sm leading-relaxed">
        This information helps us identify records that may match your profile on data broker sites. All fields are stored securely and used only for removal purposes.
      </p>
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <IntakeForm
          user={user}
          defaultEmail={user.email ?? ''}
          onSuccess={() => navigate(ROUTES.dashboard)}
        />
      </div>
    </div>
  )
}
