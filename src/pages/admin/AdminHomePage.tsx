import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { supabase } from '../../lib/supabaseClient'
import { ROUTES } from '../../lib/routes'

interface Stats {
  totalUsers: number
  totalTasks: number
  notStarted: number
  submitted: number
  waitingUserAction: number
  waitingBrokerResponse: number
  removed: number
  failed: number
}

const EMPTY: Stats = {
  totalUsers: 0, totalTasks: 0, notStarted: 0, submitted: 0,
  waitingUserAction: 0, waitingBrokerResponse: 0, removed: 0, failed: 0,
}

export function AdminHomePage() {
  const [stats, setStats] = useState<Stats>(EMPTY)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [usersRes, tasksRes] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('broker_tasks').select('status'),
      ])

      const tasks = (tasksRes.data ?? []) as { status: string }[]
      setStats({
        totalUsers: usersRes.count ?? 0,
        totalTasks: tasks.length,
        notStarted: tasks.filter(t => t.status === 'not_started').length,
        submitted: tasks.filter(t => t.status === 'submitted').length,
        waitingUserAction: tasks.filter(t => t.status === 'waiting_user_action').length,
        waitingBrokerResponse: tasks.filter(t => t.status === 'waiting_broker_response').length,
        removed: tasks.filter(t => t.status === 'removed').length,
        failed: tasks.filter(t => t.status === 'failed').length,
      })
      setLoading(false)
    }
    load()
  }, [])

  const statCards = [
    { label: 'Total users', value: stats.totalUsers, to: ROUTES.adminUsers },
    { label: 'Total tasks', value: stats.totalTasks, to: ROUTES.adminTasks },
    { label: 'Removed', value: stats.removed, to: null },
    { label: 'Failed', value: stats.failed, to: ROUTES.adminTasks },
  ]

  const breakdown = [
    { label: 'Not started', value: stats.notStarted },
    { label: 'Submitted', value: stats.submitted },
    { label: 'Waiting on user', value: stats.waitingUserAction },
    { label: 'Waiting on broker', value: stats.waitingBrokerResponse },
    { label: 'Removed', value: stats.removed },
    { label: 'Failed', value: stats.failed },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Admin overview</h1>
        <p className="text-sm text-slate-500 mt-0.5">Live stats across all users and broker tasks.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(({ label, value, to }) => (
          <Card key={label} padding="md">
            <p className="text-xs text-slate-500">{label}</p>
            {loading
              ? <p className="text-2xl font-bold text-slate-300 mt-1">—</p>
              : to
                ? <Link to={to}><p className="text-2xl font-bold text-navy-900 mt-1 hover:underline">{value}</p></Link>
                : <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
            }
          </Card>
        ))}
      </div>

      <Card padding="md">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Task status breakdown</h2>
        {loading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {breakdown.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between bg-slate-50 rounded-md px-3 py-2">
                <span className="text-xs text-slate-600">{label}</span>
                <span className="text-sm font-semibold text-slate-900">{value}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Manage users', desc: 'View profiles, consent status, trigger bot', to: ROUTES.adminUsers },
          { label: 'Manage tasks', desc: 'Run bot, retry failed, filter by status', to: ROUTES.adminTasks },
          { label: 'Manage brokers', desc: 'View and toggle broker active status', to: ROUTES.adminBrokers },
        ].map(({ label, desc, to }) => (
          <Link key={label} to={to}>
            <Card padding="md" className="hover:border-navy-300 transition-colors cursor-pointer h-full">
              <p className="text-sm font-semibold text-navy-900">{label}</p>
              <p className="text-xs text-slate-500 mt-1">{desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
