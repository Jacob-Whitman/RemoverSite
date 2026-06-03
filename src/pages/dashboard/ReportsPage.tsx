import { useEffect, useState } from 'react'
import { ReportSummary } from '../../components/dashboard/ReportSummary'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { useAuth } from '../../lib/authContext'
import { supabase } from '../../lib/supabaseClient'
import type { Report } from '../../types/database'

export function ReportsPage() {
  const { user } = useAuth()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('reports')
      .select('*')
      .eq('user_id', user.id)
      .order('report_month', { ascending: false })
      .then(({ data }) => {
        setReports((data as Report[]) ?? [])
        setLoading(false)
      })
  }, [user])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">Monthly reports</h1>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-sm text-slate-600 leading-relaxed">
        <p className="font-medium text-slate-800 mb-1">What monthly proof reports include</p>
        <p>Your monthly proof report will show which brokers were checked, where exposed records were found, which opt-outs were submitted, which removals were confirmed, which requests are pending, and whether any records reappeared.</p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" disabled title="Coming soon">
          Download PDF — coming soon
        </Button>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading reports…</p>}

      {!loading && reports.length === 0 && (
        <Alert variant="info">
          No reports yet. Your first monthly report will be generated after your initial broker scan is complete.
        </Alert>
      )}

      {reports.map(report => (
        <ReportSummary key={report.id} report={report} />
      ))}
    </div>
  )
}
