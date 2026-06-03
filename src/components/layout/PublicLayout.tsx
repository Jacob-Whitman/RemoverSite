import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { useAuth } from '../../lib/authContext'

export function PublicLayout() {
  const { user } = useAuth()
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header user={user} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
