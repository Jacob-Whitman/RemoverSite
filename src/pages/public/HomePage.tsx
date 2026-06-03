import { Link } from 'react-router-dom'
import { Search, Send, BarChart3, RefreshCw } from 'lucide-react'
import { Hero } from '../../components/marketing/Hero'
import { TrustBar } from '../../components/marketing/TrustBar'
import { FeatureCard } from '../../components/marketing/FeatureCard'
import { CTASection } from '../../components/marketing/CTASection'
import { ROUTES } from '../../lib/routes'

const exposedData = [
  'Home addresses', 'Phone numbers', 'Known relatives',
  'Previous addresses', 'Age and aliases', 'Household connections',
]

const solutionCards = [
  { icon: <Search className="h-5 w-5" />, title: 'We identify exposed records', description: 'We search data broker and people-search sites to find records that may expose your personal information.' },
  { icon: <Send className="h-5 w-5" />, title: 'We submit opt-out requests', description: 'We submit or guide opt-out and removal requests to each applicable broker on your behalf.' },
  { icon: <BarChart3 className="h-5 w-5" />, title: 'We track every request', description: 'Every broker request is tracked with a clear status so you always know where things stand.' },
  { icon: <RefreshCw className="h-5 w-5" />, title: 'We monitor for resurfaced listings', description: 'Removed records sometimes reappear. We run recurring checks to catch them early.' },
]

export function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />

      {/* Problem */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Data broker sites may expose more than you realize.</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              People-search and data broker websites collect and publish personal information from public records, social media, and commercial databases. For police officers, this creates a different risk profile than for ordinary consumers.
            </p>
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl">
            {exposedData.map(item => (
              <li key={item} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-navy-600 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-navy-900 mb-3">How Baseline Solutions helps.</h2>
          <p className="text-slate-600 mb-10 max-w-2xl">
            We find, track, and help remove exposed personal information where opt-out is available.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {solutionCards.map(card => (
              <FeatureCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* Law enforcement focus */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Designed around officer safety.</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Generic privacy tools are not always designed around officer safety, household exposure, or family-linked address risk. Baseline Solutions focuses on the records that most directly expose officers and their households.
            </p>
            <Link to={ROUTES.lawEnforcement} className="text-sm font-medium text-navy-700 hover:underline">
              Learn more about law enforcement coverage →
            </Link>
          </div>
        </div>
      </section>

      {/* Monthly proof */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Monthly proof reports.</h2>
            <p className="text-slate-600 leading-relaxed">
              Every month, clients receive a report showing what was checked, what was found, what was submitted, what was removed, what is pending, and what reappeared. You don't have to take our word for it — we show our work.
            </p>
          </div>
        </div>
      </section>

      {/* Confidentiality */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Handled confidentially.</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Information is collected only to perform the service. We do not collect driver's licenses, SSNs, or sensitive law enforcement credentials. If a broker requires identity verification to complete a removal, the task is marked as <em>User Action Required</em> so you can complete it directly — we don't store your documents.
            </p>
            <Link to={ROUTES.security} className="text-sm font-medium text-navy-700 hover:underline">
              Read our security approach →
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
