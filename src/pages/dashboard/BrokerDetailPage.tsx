import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { StatusBadge } from '../../components/dashboard/StatusBadge'
import { Card } from '../../components/ui/Card'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../lib/authContext'
import { supabase } from '../../lib/supabaseClient'
import { ROUTES } from '../../lib/routes'
import type { BrokerTask } from '../../types/database'

export function BrokerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [task, setTask] = useState<BrokerTask | null>(null)
  const [loading, setLoading] = useState(true)
  const [acknowledging, setAcknowledging] = useState(false)
  const [ackError, setAckError] = useState('')

  useEffect(() => {
    if (!user || !id) return
    supabase
      .from('broker_tasks')
      .select('*, broker:brokers(*)')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setTask(data as unknown as BrokerTask)
        setLoading(false)
      })
  }, [user, id])

  async function acknowledgeAction() {
    if (!task) return
    setAcknowledging(true)
    setAckError('')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('broker_tasks')
      .update({
        status: 'waiting_broker_response',
        requires_user_action: false,
        last_checked_at: new Date().toISOString(),
      })
      .eq('id', task.id)

    if (error) {
      setAckError('Could not update status. Please try again.')
      setAcknowledging(false)
      return
    }

    setTask(prev => prev ? {
      ...prev,
      status: 'waiting_broker_response',
      requires_user_action: false,
    } : null)
    setAcknowledging(false)
  }

  if (loading) return <div className="text-sm text-slate-500">Loading…</div>
  if (!task) return (
    <div>
      <Alert variant="danger">Task not found or access denied.</Alert>
      <Link to={ROUTES.dashboardBrokers} className="text-sm text-navy-700 hover:underline mt-4 inline-block">
        ← Back to brokers
      </Link>
    </div>
  )

  return (
    <div className="space-y-4 max-w-xl">
      <div>
        <Link to={ROUTES.dashboardBrokers} className="text-sm text-navy-700 hover:underline">
          ← Back to brokers
        </Link>
        <h1 className="text-2xl font-bold text-navy-900 mt-2">{task.broker?.name}</h1>
      </div>

      <Card>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-slate-500">Status</dt><dd className="mt-1"><StatusBadge status={task.status} /></dd></div>
          <div><dt className="text-slate-500">Match confidence</dt><dd className="mt-1 capitalize text-slate-800">{task.match_confidence.replace('_', ' ')}</dd></div>
          <div><dt className="text-slate-500">Last checked</dt><dd className="mt-1 text-slate-800">{task.last_checked_at ? new Date(task.last_checked_at).toLocaleDateString() : '—'}</dd></div>
          <div><dt className="text-slate-500">Submitted</dt><dd className="mt-1 text-slate-800">{task.submitted_at ? new Date(task.submitted_at).toLocaleDateString() : '—'}</dd></div>
          <div><dt className="text-slate-500">Removed</dt><dd className="mt-1 text-slate-800">{task.removed_at ? new Date(task.removed_at).toLocaleDateString() : '—'}</dd></div>
          <div><dt className="text-slate-500">Reappeared</dt><dd className="mt-1 text-slate-800">{task.reappeared_at ? new Date(task.reappeared_at).toLocaleDateString() : '—'}</dd></div>
        </dl>

        {task.requires_user_action && task.user_action_type && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
            <Alert variant="warning" title="Action needed — check your email">
              {task.user_action_type}
            </Alert>
            {ackError && <Alert variant="danger">{ackError}</Alert>}
            <Button
              size="sm"
              variant="outline"
              loading={acknowledging}
              onClick={acknowledgeAction}
            >
              I've clicked the confirmation link
            </Button>
          </div>
        )}

        {task.notes && (
          <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-600">
            <p className="font-medium text-slate-700 mb-1">Notes</p>
            <p>{task.notes}</p>
          </div>
        )}

        {task.broker?.manual_instructions && (
          <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-600">
            <p className="font-medium text-slate-700 mb-1">Removal instructions</p>
            <p>{task.broker.manual_instructions}</p>
          </div>
        )}
      </Card>
    </div>
  )
}
