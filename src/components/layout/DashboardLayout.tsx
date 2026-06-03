import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useAuth } from '../../lib/authContext'

export function DashboardLayout() {
  const { user } = useAuth()
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header user={user} />
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <aside className="hidden md:block w-56 shrink-0">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm sticky top-6">
            <Sidebar />
          </div>
        </aside>
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
