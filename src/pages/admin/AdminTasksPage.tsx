import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { StatusBadge } from '../../components/dashboard/StatusBadge'
import type { BrokerTask } from '../../types/database'

interface TaskWithUser extends BrokerTask {
  profile?: { email: string | null; legal_first_name: string | null; legal_last_name: string | null }
}

interface BotResult {
  processed: number
  email_sent: number
  form_submitted: number
  waiting_user_action: number
  skipped_no_consent: number
  failed: number
  errors: Array<{ task_id: string; broker: string; error: string }>
}

export function AdminTasksPage() {
  const [tasks, setTasks] = useState<TaskWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [running, setRunning] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const [botResult, setBotResult] = useState<BotResult | null>(null)
  const [botError, setBotError] = useState('')

  const loadTasks = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('broker_tasks')
      .select('*, broker:brokers(name, priority), profile:profiles(email, legal_first_name, legal_last_name)')
      .order('updated_at', { ascending: false })
      .limit(200)

    if (statusFilter !== 'all') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      query = (query as any).eq('status', statusFilter)
    }

    const { data } = await query
    setTasks((data as TaskWithUser[]) ?? [])
    setLoading(false)
  }, [statusFilter])

  useEffect(() => { loadTasks() }, [loadTasks])

  async function runBot(retryFailed = false) {
    setBotResult(null)
    setBotError('')
    if (retryFailed) setRetrying(true)
    else setRunning(true)

    try {
      const { data, error } = await supabase.functions.invoke('process-broker-tasks', {
        body: { retry_failed: retryFailed },
      })
      if (error) throw error
      setBotResult(data as BotResult)
      await loadTasks()
    } catch (e) {
      setBotError(e instanceof Error ? e.message : 'Failed to run bot')
    } finally {
      setRunning(false)
      setRetrying(false)
    }
  }

  const counts = {
    total: tasks.length,
    not_started: tasks.filter(t => t.status === 'not_started').length,
    submitted: tasks.filter(t => t.status === 'submitted').length,
    waiting_user_action: tasks.filter(t => t.status === 'waiting_user_action').length,
    failed: tasks.filter(t => t.status === 'failed').length,
    removed: tasks.filter(t => t.status === 'removed').length,
  }

  const STATUS_OPTIONS = [
    { value: 'all', label: `All (${counts.total})` },
    { value: 'not_started', label: `Not started (${counts.not_started})` },
    { value: 'submitted', label: `Submitted (${counts.submitted})` },
    { value: 'waiting_user_action', label: `Waiting on user (${counts.waiting_user_action})` },
    { value: 'failed', label: `Failed (${counts.failed})` },
    { value: 'removed', label: `Removed (${counts.removed})` },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Task management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Run the opt-out bot and monitor task status across all users.</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            loading={retrying}
            disabled={running || counts.failed === 0}
            onClick={() => runBot(true)}
          >
            Retry failed ({counts.failed})
          </Button>
          <Button
            size="sm"
            loading={running}
            disabled={retrying}
            onClick={() => runBot(false)}
          >
            Run bot now
          </Button>
        </div>
      </div>

      {botResult && (
        <Alert variant={botResult.failed > 0 ? 'warning' : 'success'} title="Bot run complete">
          Processed {botResult.processed} tasks —{' '}
          {botResult.email_sent} emails sent,{' '}
          {botResult.form_submitted} forms submitted,{' '}
          {botResult.waiting_user_action} awaiting user confirmation,{' '}
          {botResult.skipped_no_consent} skipped (no consent),{' '}
          {botResult.failed} failed.
          {botResult.errors.length > 0 && (
            <ul className="mt-2 space-y-0.5 text-xs">
              {botResult.errors.map((e, i) => (
                <li key={i}><span className="font-medium">{e.broker}:</span> {e.error}</li>
              ))}
            </ul>
          )}
        </Alert>
      )}

      {botError && <Alert variant="danger">{botError}</Alert>}

      <div className="flex items-center gap-3">
        <label className="text-sm text-slate-600 font-medium">Filter:</label>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="text-sm border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-navy-600"
        >
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <Button variant="ghost" size="sm" onClick={loadTasks}>Refresh</Button>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500 py-8 text-center">Loading tasks…</div>
      ) : tasks.length === 0 ? (
        <div className="text-sm text-slate-500 py-12 text-center bg-white rounded-lg border border-slate-200">
          No tasks match this filter.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">User</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Broker</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Submitted</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Last checked</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Failure reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-700">
                    {task.profile?.legal_first_name
                      ? `${task.profile.legal_first_name} ${task.profile.legal_last_name ?? ''}`
                      : task.profile?.email ?? task.user_id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {task.broker?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {task.submitted_at ? new Date(task.submitted_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {task.last_checked_at ? new Date(task.last_checked_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-500 max-w-xs truncate text-xs">
                    {task.failure_reason ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
