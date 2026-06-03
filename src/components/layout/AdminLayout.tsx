import { Outlet, NavLink } from 'react-router-dom'
import { Header } from './Header'
import { ROUTES } from '../../lib/routes'
import { useAuth } from '../../lib/authContext'
import { twMerge } from 'tailwind-merge'

const adminNav = [
  { to: ROUTES.admin, label: 'Overview', end: true },
  { to: ROUTES.adminBrokers, label: 'Brokers' },
  { to: ROUTES.adminTasks, label: 'Tasks' },
  { to: ROUTES.adminUsers, label: 'Users' },
  { to: ROUTES.adminReports, label: 'Reports' },
]

export function AdminLayout() {
  const { user } = useAuth()
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header user={user} />
      <div className="bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 py-2">
            {adminNav.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  twMerge(
                    'px-3 py-1.5 rounded text-sm transition-colors',
                    isActive ? 'bg-navy-700 text-white' : 'text-slate-300 hover:text-white hover:bg-navy-800'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  )
}
