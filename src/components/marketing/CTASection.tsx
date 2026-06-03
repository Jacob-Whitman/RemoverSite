import { Link } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'

export function CTASection() {
  return (
    <section className="bg-navy-900 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Start reducing your public exposure.</h2>
        <p className="text-slate-300 mb-8 text-lg">
          Handled confidentially. Built for law enforcement. Monthly proof reports.
        </p>
        <Link
          to={ROUTES.contact}
          className="inline-flex items-center justify-center px-8 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Start Confidential Privacy Review
        </Link>
      </div>
    </section>
  )
}
