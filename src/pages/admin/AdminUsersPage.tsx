import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { Badge } from '../../components/ui/Badge'

interface UserRow {
  id: string
  email: string | null
  legal_first_name: string | null
  legal_last_name: string | null
  role: string
  created_at: string
  taskCounts: { total: number; submitted: number; removed: number; failed: number; notStarted: number }
  hasConsent: boolean
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [runningFor, setRunningFor] = useState<string | null>(null)
  const [botResults, setBotResults] = useState<Record<string, string>>({})

  const loadUsers = useCallback(async () => {
    setLoading(true)

    const [profilesRes, tasksRes, consentRes] = await Promise.all([
      supabase.from('profiles').select('id, email, legal_first_name, legal_last_name, role, created_at').order('created_at', { ascending: false }),
      supabase.from('broker_tasks').select('user_id, status'),
      supabase.from('consent_records')
        .select('user_id')
        .eq('consent_type', 'submit_opt_out_requests')
        .eq('consent_given', true)
        .is('revoked_at', null),
    ])

    const tasks = (tasksRes.data ?? []) as { user_id: string; status: string }[]
    const consentUserIds = new Set((consentRes.data ?? []).map((c: { user_id: string }) => c.user_id))

    const rows: UserRow[] = (profilesRes.data ?? []).map((p: {
      id: string; email: string | null; legal_first_name: string | null
      legal_last_name: string | null; role: string; created_at: string
    }) => {
      const userTasks = tasks.filter(t => t.user_id === p.id)
      return {
        ...p,
        hasConsent: consentUserIds.has(p.id),
        taskCounts: {
          total: userTasks.length,
          submitted: userTasks.filter(t => ['submitted', 'waiting_broker_response', 'waiting_user_action'].includes(t.status)).length,
          removed: userTasks.filter(t => t.status === 'removed').length,
          failed: userTasks.filter(t => t.status === 'failed').length,
          notStarted: userTasks.filter(t => t.status === 'not_started').length,
        },
      }
    })

    setUsers(rows)
    setLoading(false)
  }, [])

  useEffect(() => { loadUsers() }, [loadUsers])

  async function runBotForUser(userId: string) {
    setRunningFor(userId)
    setBotResults(prev => ({ ...prev, [userId]: '' }))
    try {
      const { data, error } = await supabase.functions.invoke('process-broker-tasks', {
        body: { user_id: userId },
      })
      if (error) throw error
      const d = data as { processed: number; email_sent: number; form_submitted: number; waiting_user_action: number; failed: number }
      setBotResults(prev => ({
        ...prev,
        [userId]: `Done — ${d.processed} processed, ${d.email_sent + d.form_submitted} sent, ${d.waiting_user_action} awaiting confirmation, ${d.failed} failed`,
      }))
      await loadUsers()
    } catch (e) {
      setBotResults(prev => ({ ...prev, [userId]: `Error: ${e instanceof Error ? e.message : 'Unknown error'}` }))
    } finally {
      setRunningFor(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">User management</h1>
          <p className="text-sm text-slate-500 mt-0.5">{users.length} user{users.length !== 1 ? 's' : ''} registered.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={loadUsers}>Refresh</Button>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500 py-8 text-center">Loading users…</div>
      ) : users.length === 0 ? (
        <div className="text-sm text-slate-500 py-12 text-center bg-white rounded-lg border border-slate-200">
          No users yet.
        </div>
      ) : (
        <div className="space-y-3">
          {users.map(user => (
            <div key={user.id} className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-900 text-sm">
                      {user.legal_first_name || user.legal_last_name
                        ? `${user.legal_first_name ?? ''} ${user.legal_last_name ?? ''}`.trim()
                        : 'No name on file'}
                    </p>
                    {user.role === 'admin' && <Badge variant="info">Admin</Badge>}
                    {!user.hasConsent && <Badge variant="amber">No consent</Badge>}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{user.email ?? '—'}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  loading={runningFor === user.id}
                  disabled={runningFor !== null || !user.hasConsent || user.taskCounts.notStarted === 0}
                  onClick={() => runBotForUser(user.id)}
                >
                  Run bot
                </Button>
              </div>

              <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
                <span><span className="font-medium">{user.taskCounts.total}</span> tasks</span>
                <span><span className="font-medium text-blue-600">{user.taskCounts.submitted}</span> submitted</span>
                <span><span className="font-medium text-green-600">{user.taskCounts.removed}</span> removed</span>
                <span><span className="font-medium text-red-500">{user.taskCounts.failed}</span> failed</span>
                <span><span className="font-medium text-slate-400">{user.taskCounts.notStarted}</span> not started</span>
              </div>

              {botResults[user.id] && (
                <div className="mt-2">
                  <Alert variant={botResults[user.id].startsWith('Error') ? 'danger' : 'success'}>
                    {botResults[user.id]}
                  </Alert>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
