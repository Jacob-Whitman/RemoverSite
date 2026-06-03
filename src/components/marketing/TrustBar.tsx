import { Lock, Eye, FileCheck, RefreshCw } from 'lucide-react'

const items = [
  { icon: Lock, label: 'Handled confidentially' },
  { icon: Eye, label: 'No SSN or ID documents collected' },
  { icon: FileCheck, label: 'Monthly proof reports' },
  { icon: RefreshCw, label: 'Continuous monitoring' },
]

export function TrustBar() {
  return (
    <div className="bg-navy-50 border-y border-navy-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ul className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          {items.map(item => (
            <li key={item.label} className="flex items-center gap-2 text-sm text-navy-700 font-medium">
              <item.icon className="h-4 w-4 text-navy-600" />
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
