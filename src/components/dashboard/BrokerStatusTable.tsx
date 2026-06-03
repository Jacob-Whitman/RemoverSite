import { Link } from 'react-router-dom'
import { StatusBadge } from './StatusBadge'
import { Badge } from '../ui/Badge'
import { ROUTES } from '../../lib/routes'
import type { BrokerTask } from '../../types/database'

interface BrokerStatusTableProps {
  tasks: BrokerTask[]
  loading?: boolean
}

function priorityVariant(p: string) {
  if (p === 'high') return 'danger'
  if (p === 'medium') return 'amber'
  return 'neutral'
}

export function BrokerStatusTable({ tasks, loading }: BrokerStatusTableProps) {
  if (loading) {
    return <div className="text-sm text-slate-500 py-8 text-center">Loading broker statuses…</div>
  }

  if (tasks.length === 0) {
    return (
      <div className="text-sm text-slate-500 py-12 text-center bg-white rounded-lg border border-slate-200">
        No broker tasks yet. Your broker scan will appear here once your profile is complete.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Broker</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Priority</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Match confidence</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Last checked</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Action needed</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.map(task => (
            <tr key={task.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 font-medium text-slate-800">
                {task.broker?.name ?? 'Unknown broker'}
              </td>
              <td className="px-4 py-3">
                <Badge variant={priorityVariant(task.broker?.priority ?? 'medium')}>
                  {task.broker?.priority ?? '—'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={task.status} />
              </td>
              <td className="px-4 py-3 text-slate-600 capitalize">
                {task.match_confidence.replace('_', ' ')}
              </td>
              <td className="px-4 py-3 text-slate-500">
                {task.last_checked_at
                  ? new Date(task.last_checked_at).toLocaleDateString()
                  : '—'}
              </td>
              <td className="px-4 py-3">
                {task.requires_user_action ? (
                  <Badge variant="amber">Action needed</Badge>
                ) : '—'}
              </td>
              <td className="px-4 py-3">
                <Link
                  to={ROUTES.dashboardBrokerDetail(task.id)}
                  className="text-xs text-navy-700 hover:underline font-medium"
                >
                  Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
