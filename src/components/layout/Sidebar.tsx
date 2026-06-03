import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, BarChart3, Settings, Trash2 } from 'lucide-react'
import { ROUTES } from '../../lib/routes'
import { twMerge } from 'tailwind-merge'

const navItems = [
  { to: ROUTES.dashboard, label: 'Overview', icon: LayoutDashboard, end: true },
  { to: ROUTES.dashboardBrokers, label: 'Brokers', icon: ClipboardList },
  { to: ROUTES.dashboardReports, label: 'Reports', icon: BarChart3 },
  { to: ROUTES.dashboardSettings, label: 'Settings', icon: Settings },
]

const dangerItems = [
  { to: ROUTES.dashboardDeleteRequest, label: 'Delete Account', icon: Trash2 },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <nav className={twMerge('flex flex-col gap-1 p-4', className)}>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
        Dashboard
      </p>
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            twMerge(
              'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors',
              isActive
                ? 'bg-navy-100 text-navy-800 font-medium'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )
          }
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {item.label}
        </NavLink>
      ))}
      <div className="mt-4 border-t border-slate-200 pt-4">
        {dangerItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              twMerge(
                'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-red-50 text-red-700 font-medium'
                  : 'text-slate-500 hover:bg-red-50 hover:text-red-700'
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
