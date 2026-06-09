import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Button } from '../../components/ui/Button'

interface UserReport {
  userId: string
  name: string
  email: string | null
  joinedAt: string
  total: number
  notStarted: number
  submitted: number
  waitingUser: number
  waitingBroker: number
  removed: number
  failed: number
  progressPct: number
}

export function AdminReportsPage() {
  const [reports, setReports] = useState<UserReport[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'name' | 'removed' | 'failed' | 'joined'>('joined')

  async function load() {
    setLoading(true)

    const [profilesRes, tasksRes] = await Promise.all([
      supabase.from('profiles').select('id, email, legal_first_name, legal_last_name, created_at'),
      supabase.from('broker_tasks').select('user_id, status'),
    ])

    const tasks = (tasksRes.data ?? []) as { user_id: string; status: string }[]
    const rows: UserReport[] = (profilesRes.data ?? []).map((p: {
      id: string; email: string | null; legal_first_name: string | null
      legal_last_name: string | null; created_at: string
    }) => {
      const ut = tasks.filter(t => t.user_id === p.id)
      const submitted = ut.filter(t => ['submitted', 'waiting_broker_response'].includes(t.status)).length
      const removed = ut.filter(t => t.status === 'removed').length
      const done = submitted + removed + ut.filter(t => t.status === 'waiting_user_action').length
      return {
        userId: p.id,
        name: [p.legal_first_name, p.legal_last_name].filter(Boolean).join(' ') || 'No name',
        email: p.email,
        joinedAt: p.created_at,
        total: ut.length,
        notStarted: ut.filter(t => t.status === 'not_started').length,
        submitted,
        waitingUser: ut.filter(t => t.status === 'waiting_user_action').length,
        waitingBroker: ut.filter(t => t.status === 'waiting_broker_response').length,
        removed,
        failed: ut.filter(t => t.status === 'failed').length,
        progressPct: ut.length > 0 ? Math.round((done / ut.length) * 100) : 0,
      }
    })

    setReports(rows)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const sorted = [...reports].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'removed') return b.removed - a.removed
    if (sortBy === 'failed') return b.failed - a.failed
    return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
  })

  const totals = reports.reduce((acc, r) => ({
    total: acc.total + r.total,
    submitted: acc.submitted + r.submitted,
    removed: acc.removed + r.removed,
    failed: acc.failed + r.failed,
    waitingUser: acc.waitingUser + r.waitingUser,
  }), { total: 0, submitted: 0, removed: 0, failed: 0, waitingUser: 0 })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Reports</h1>
          <p className="text-sm text-slate-500 mt-0.5">Per-user removal progress across all brokers.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={load}>Refresh</Button>
      </div>

      {!loading && reports.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Total tasks', value: totals.total },
            { label: 'Submitted', value: totals.submitted, color: 'text-blue-600' },
            { label: 'Awaiting user', value: totals.waitingUser, color: 'text-amber-600' },
            { label: 'Removed', value: totals.removed, color: 'text-green-600' },
            { label: 'Failed', value: totals.failed, color: 'text-red-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-lg border border-slate-200 p-4">
              <p className="text-xs text-slate-500">{label}</p>
              <p className={`text-2xl font-bold mt-1 ${color ?? 'text-slate-900'}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-600 font-medium">Sort:</label>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="text-sm border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-navy-600"
        >
          <option value="joined">Newest first</option>
          <option value="removed">Most removed</option>
          <option value="failed">Most failed</option>
          <option value="name">Name</option>
        </select>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500 py-8 text-center">Loading…</div>
      ) : reports.length === 0 ? (
        <div className="text-sm text-slate-500 py-12 text-center bg-white rounded-lg border border-slate-200">
          No users yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">User</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Joined</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Tasks</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Submitted</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Awaiting user</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Removed</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Failed</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map(r => (
                <tr key={r.userId} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{r.name}</p>
                    <p className="text-xs text-slate-400">{r.email ?? '—'}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {new Date(r.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{r.total}</td>
                  <td className="px-4 py-3 text-blue-600 font-medium">{r.submitted}</td>
                  <td className="px-4 py-3 text-amber-600 font-medium">{r.waitingUser}</td>
                  <td className="px-4 py-3 text-green-600 font-medium">{r.removed}</td>
                  <td className="px-4 py-3 text-red-500 font-medium">{r.failed}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-200 rounded-full h-1.5">
                        <div
                          className="bg-navy-700 h-1.5 rounded-full"
                          style={{ width: `${r.progressPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{r.progressPct}%</span>
                    </div>
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
