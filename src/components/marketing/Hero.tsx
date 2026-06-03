import { Link } from 'react-router-dom'
import { Shield, CheckCircle } from 'lucide-react'
import { ROUTES } from '../../lib/routes'

const trustBullets = [
  'Handled confidentially',
  'Built for law enforcement',
  'Monthly proof reports',
  'Continuous monitoring',
]

export function Hero() {
  return (
    <section className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            <span>Confidential · Law Enforcement Focused</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            Protect your family's address from public data broker sites.
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
            Baseline Solutions provides confidential, law-enforcement-focused data broker removal
            and continuous monitoring for police officers and their families.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <Link
              to={ROUTES.contact}
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              Start Confidential Privacy Review
            </Link>
            <Link
              to={ROUTES.howItWorks}
              className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-slate-600 text-slate-200 font-medium hover:border-slate-400 hover:text-white transition-colors text-sm"
            >
              See How It Works
            </Link>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {trustBullets.map(b => (
              <li key={b} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
