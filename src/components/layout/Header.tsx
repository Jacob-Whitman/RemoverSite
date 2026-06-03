import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Shield, Menu, X } from 'lucide-react'
import { ROUTES } from '../../lib/routes'
import { signOut } from '../../lib/auth'
import type { User } from '@supabase/supabase-js'

interface HeaderProps {
  user?: User | null
}

const navLinks = [
  { to: ROUTES.howItWorks, label: 'How It Works' },
  { to: ROUTES.lawEnforcement, label: 'Law Enforcement' },
  { to: ROUTES.pricing, label: 'Pricing' },
  { to: ROUTES.faq, label: 'FAQ' },
]

export function Header({ user }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate(ROUTES.home)
  }

  return (
    <header className="bg-navy-900 border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.home} className="flex items-center gap-2 text-white hover:text-slate-200 transition-colors">
            <Shield className="h-6 w-6 text-blue-400" />
            <span className="font-semibold text-sm sm:text-base">Baseline Solutions</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm transition-colors ${isActive ? 'text-white' : 'text-slate-300 hover:text-white'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Auth actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to={ROUTES.dashboard} className="text-sm text-slate-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 text-sm font-medium rounded-md border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to={ROUTES.login} className="text-sm text-slate-300 hover:text-white transition-colors">
                  Sign in
                </Link>
                <Link
                  to={ROUTES.contact}
                  className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md bg-navy-700 text-white hover:bg-navy-800 transition-colors"
                >
                  Start Privacy Review
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-navy-900 border-t border-navy-800 px-4 pb-4 pt-2 flex flex-col gap-3">
          {navLinks.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-slate-300 hover:text-white"
            >
              {l.label}
            </NavLink>
          ))}
          <div className="border-t border-navy-800 pt-3 flex flex-col gap-2">
            {user ? (
              <>
                <Link to={ROUTES.dashboard} onClick={() => setMenuOpen(false)} className="text-sm text-slate-300">Dashboard</Link>
                <button onClick={handleSignOut} className="text-sm text-slate-400 text-left">Sign out</button>
              </>
            ) : (
              <>
                <Link to={ROUTES.login} onClick={() => setMenuOpen(false)} className="text-sm text-slate-300">Sign in</Link>
                <Link to={ROUTES.contact} onClick={() => setMenuOpen(false)} className="text-sm text-blue-400 font-medium">Start Privacy Review</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
