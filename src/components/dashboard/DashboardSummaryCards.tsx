import { Card } from '../ui/Card'

interface SummaryData {
  brokersInScope: number
  brokersChecked: number
  recordsFound: number
  removalSubmitted: number
  confirmedRemoved: number
  pendingBrokerResponse: number
  userActionRequired: number
  reappeared: number
  nextMonitoringDate: string | null
}

interface DashboardSummaryCardsProps {
  data: SummaryData
}

function StatCard({ label, value, color }: { label: string; value: number | string; color?: string }) {
  return (
    <Card padding="md" className="flex flex-col gap-1">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold ${color ?? 'text-slate-900'}`}>{value}</p>
    </Card>
  )
}

export function DashboardSummaryCards({ data }: DashboardSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <StatCard label="Brokers in scope" value={data.brokersInScope} />
      <StatCard label="Brokers checked" value={data.brokersChecked} />
      <StatCard label="Records found" value={data.recordsFound} color={data.recordsFound > 0 ? 'text-orange-600' : 'text-slate-900'} />
      <StatCard label="Removal submitted" value={data.removalSubmitted} color="text-blue-700" />
      <StatCard label="Confirmed removed" value={data.confirmedRemoved} color="text-green-700" />
      <StatCard label="Pending response" value={data.pendingBrokerResponse} />
      <StatCard label="Action required" value={data.userActionRequired} color={data.userActionRequired > 0 ? 'text-amber-700' : 'text-slate-900'} />
      <StatCard label="Reappeared" value={data.reappeared} color={data.reappeared > 0 ? 'text-red-700' : 'text-slate-900'} />
      <StatCard label="Next check" value={data.nextMonitoringDate ?? 'Scheduled'} />
    </div>
  )
}
