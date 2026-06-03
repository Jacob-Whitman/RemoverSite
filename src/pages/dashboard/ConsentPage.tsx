import { useNavigate } from 'react-router-dom'
import { ConsentForm } from '../../components/forms/ConsentForm'
import { useAuth } from '../../lib/authContext'
import { ROUTES } from '../../lib/routes'

export function ConsentPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-navy-900 mb-2">Consent and authorization</h1>
      <p className="text-slate-600 mb-8 leading-relaxed text-sm">
        Before we begin, please review and confirm the following. These consents authorize us to search for, track, and request removal of your records from data broker sites.
      </p>
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <ConsentForm userId={user.id} onSuccess={() => navigate(ROUTES.dashboardIntake)} />
      </div>
    </div>
  )
}
