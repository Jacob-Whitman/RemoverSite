import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { ROUTES } from '../../lib/routes'

const tiers = [
  {
    name: 'Initial Exposure Review',
    type: 'One-time',
    description: 'Understand your current data broker exposure with a documented scan and summary report.',
    features: [
      'One-time broker scan',
      'Record matching report',
      'Exposure summary',
      'Opt-out guidance',
    ],
    cta: 'Request Early Access',
  },
  {
    name: 'Managed Removal',
    type: 'Service',
    description: 'We submit opt-out and removal requests on your behalf and track every broker status.',
    features: [
      'Broker-by-broker removal',
      'Status tracking dashboard',
      'Guided user actions',
      'Removal confirmation',
    ],
    cta: 'Request Early Access',
    highlight: true,
  },
  {
    name: 'Ongoing Monitoring',
    type: 'Monthly',
    description: 'Recurring checks, reappearance tracking, and monthly proof reports.',
    features: [
      'Monthly re-checks',
      'Reappeared record tracking',
      'Monthly proof report',
      'Continuous monitoring',
    ],
    cta: 'Request Early Access',
  },
  {
    name: 'Department / Group',
    type: 'Custom',
    description: 'Coverage for multiple officers or a department group. Contact us for pricing.',
    features: [
      'Multiple officer profiles',
      'Group management',
      'Department reporting',
      'Dedicated support',
    ],
    cta: 'Contact for Pricing',
  },
]

export function PricingPage() {
  return (
    <>
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Pricing</h1>
          <p className="text-slate-300 text-lg">Early access pricing is available by request. Contact us to discuss your situation.</p>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map(tier => (
              <div
                key={tier.name}
                className={`bg-white rounded-lg border shadow-sm p-6 flex flex-col ${tier.highlight ? 'border-navy-600 ring-1 ring-navy-600' : 'border-slate-200'}`}
              >
                <div className="mb-4">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{tier.type}</span>
                  <h3 className="text-lg font-bold text-navy-900 mt-1">{tier.name}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{tier.description}</p>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={ROUTES.contact}
                  className={`block text-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    tier.highlight
                      ? 'bg-navy-700 text-white hover:bg-navy-800'
                      : 'border border-navy-600 text-navy-700 hover:bg-navy-50'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 mt-10">
            Pricing details will be shared during onboarding. No payment processing in the current early access period.
          </p>
        </div>
      </section>
    </>
  )
}
