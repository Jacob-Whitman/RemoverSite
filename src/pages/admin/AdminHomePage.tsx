import { Card } from '../../components/ui/Card'

export function AdminHomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-navy-900">Admin overview</h1>
      <p className="text-sm text-slate-500">Admin dashboard — skeleton. Full admin workflows will be built in subsequent milestones.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Total users', 'Active tasks', 'Pending review', 'Reports generated'].map(label => (
          <Card key={label} padding="md">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">—</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
