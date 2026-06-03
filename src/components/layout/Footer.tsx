import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { ROUTES } from '../../lib/routes'

export function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-400 border-t border-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white mb-3">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="font-semibold">Baseline Solutions</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Confidential data broker removal and continuous monitoring for law enforcement professionals and their families.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Service</p>
            <ul className="space-y-2 text-sm">
              <li><Link to={ROUTES.howItWorks} className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to={ROUTES.lawEnforcement} className="hover:text-white transition-colors">Law Enforcement</Link></li>
              <li><Link to={ROUTES.familyProtection} className="hover:text-white transition-colors">Family Protection</Link></li>
              <li><Link to={ROUTES.pricing} className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to={ROUTES.faq} className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Legal</p>
            <ul className="space-y-2 text-sm">
              <li><Link to={ROUTES.privacy} className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to={ROUTES.terms} className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to={ROUTES.security} className="hover:text-white transition-colors">Security</Link></li>
              <li><Link to={ROUTES.contact} className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-900 mt-10 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} Baseline Solutions. All rights reserved.</p>
          <p className="text-slate-500">
            No service can guarantee complete or permanent removal. Results vary by broker.
          </p>
        </div>
      </div>
    </footer>
  )
}
