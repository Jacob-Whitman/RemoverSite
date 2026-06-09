import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardSummaryCards } from '../../components/dashboard/DashboardSummaryCards'
import { BrokerStatusTable } from '../../components/dashboard/BrokerStatusTable'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../lib/authContext'
import { supabase } from '../../lib/supabaseClient'
import { ROUTES } from '../../lib/routes'
import type { BrokerTask } from '../../types/database'

// Placeholder summary for new accounts with no tasks yet
const EMPTY_SUMMARY = {
  brokersInScope: 0, brokersChecked: 0, recordsFound: 0,
  removalSubmitted: 0, confirmedRemoved: 0, pendingBrokerResponse: 0,
  userActionRequired: 0, reappeared: 0, nextMonitoringDate: null,
}

export function DashboardPage() {
  const { user, profile } = useAuth()
  const [tasks, setTasks] = useState<BrokerTask[]>([])
  const [loading, setLoading] = useState(true)

  const [consentGiven, setConsentGiven] = useState(true)
  const profileComplete = !!(profile?.legal_first_name && profile?.legal_last_name && profile?.current_state)

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase
        .from('broker_tasks')
        .select('*, broker:brokers(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true }),
      supabase
        .from('consent_records')
        .select('id')
        .eq('user_id', user.id)
        .eq('consent_type', 'submit_opt_out_requests')
        .eq('consent_given', true)
        .is('revoked_at', null)
        .maybeSingle(),
    ]).then(([taskRes, consentRes]) => {
      setTasks((taskRes.data as BrokerTask[]) ?? [])
      setConsentGiven(!!consentRes.data)
      setLoading(false)
    })
  }, [user])

  const summary = {
    brokersInScope: tasks.length,
    brokersChecked: tasks.filter(t => t.status !== 'not_started').length,
    recordsFound: tasks.filter(t => ['record_found','submitted','waiting_broker_response','removed','reappeared','waiting_user_action'].includes(t.status)).length,
    removalSubmitted: tasks.filter(t => ['submitted','waiting_broker_response'].includes(t.status)).length,
    confirmedRemoved: tasks.filter(t => t.status === 'removed').length,
    pendingBrokerResponse: tasks.filter(t => t.status === 'waiting_broker_response').length,
    userActionRequired: tasks.filter(t => t.status === 'waiting_user_action').length,
    reappeared: tasks.filter(t => t.status === 'reappeared').length,
    nextMonitoringDate: null,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Welcome back{profile?.legal_first_name ? `, ${profile.legal_first_name}` : ''}.
          </p>
        </div>
      </div>

      {!consentGiven && (
        <Alert variant="warning" title="Consent required">
          Please complete the consent form before your profile is processed.{' '}
          <Link to={ROUTES.dashboardConsent} className="font-medium underline">Complete consent →</Link>
        </Alert>
      )}

      {!profileComplete && (
        <Alert variant="info" title="Profile incomplete">
          Complete your intake form so we can begin identifying your records.{' '}
          <Link to={ROUTES.dashboardIntake} className="font-medium underline">Complete intake →</Link>
        </Alert>
      )}

      <DashboardSummaryCards data={tasks.length > 0 ? summary : EMPTY_SUMMARY} />

      <div className="flex items-center justify-between mt-6">
        <h2 className="text-lg font-semibold text-navy-900">Broker status</h2>
        {tasks.length === 0 && profileComplete && (
          <Button variant="outline" size="sm" disabled>
            Scan scheduled
          </Button>
        )}
      </div>

      <BrokerStatusTable tasks={tasks} loading={loading} />
    </div>
  )
}
