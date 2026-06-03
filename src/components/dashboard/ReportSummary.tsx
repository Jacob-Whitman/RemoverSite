import { Card } from '../ui/Card'
import type { Report } from '../../types/database'

interface ReportSummaryProps {
  report: Report
}

export function ReportSummary({ report }: ReportSummaryProps) {
  const month = new Date(report.report_month + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <Card>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Report period</p>
      <h3 className="text-lg font-bold text-navy-900 mb-4">{month}</h3>
      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        {[
          { label: 'Brokers checked', value: report.brokers_checked },
          { label: 'Records found', value: report.records_found },
          { label: 'Removals submitted', value: report.removals_submitted },
          { label: 'Confirmed removed', value: report.confirmed_removed },
          { label: 'Pending', value: report.pending_count },
          { label: 'Action required', value: report.user_action_required_count },
          { label: 'Reappeared', value: report.reappeared_count },
        ].map(item => (
          <div key={item.label}>
            <dt className="text-slate-500">{item.label}</dt>
            <dd className="font-semibold text-slate-900">{item.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
