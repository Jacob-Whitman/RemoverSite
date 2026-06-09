import { useNavigate } from 'react-router-dom'
import { IntakeForm } from '../../components/forms/IntakeForm'
import { useAuth } from '../../lib/authContext'
import { ROUTES } from '../../lib/routes'
import { supabase } from '../../lib/supabaseClient'

export function IntakePage() {
  const { user, refreshProfile } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  async function handleSuccess() {
    await refreshProfile()
    try {
      // Create broker task rows first (must complete before processing)
      await supabase.functions.invoke('create-broker-tasks')
      // Fire the bot for this user without awaiting — it runs in the background
      // while the user is redirected to the dashboard. Processes all tasks at once.
      supabase.functions.invoke('process-broker-tasks', {
        body: { user_id: user!.id },
      })
    } catch {
      // Non-fatal — nightly cron will pick up any unprocessed tasks
    }
    navigate(ROUTES.dashboard)
  }

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
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  )
}
