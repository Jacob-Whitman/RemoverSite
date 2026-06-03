import { Link } from 'react-router-dom'
import { CTASection } from '../../components/marketing/CTASection'
import { ROUTES } from '../../lib/routes'

export function LawEnforcementPage() {
  return (
    <>
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">For Police Officers and Law Enforcement Professionals</h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Police officers face a unique privacy risk when home addresses, relatives, and household connections appear on public people-search sites. Our service is designed to help reduce that exposure through confidential data broker removal, recurring checks, and clear proof of work.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        <section>
          <h2 className="text-2xl font-bold text-navy-900 mb-4">Why officers face a different risk</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            For most people, data broker exposure is a nuisance — junk mail, spam calls, or unwanted contact. For law enforcement professionals, exposed home address information carries a different weight. Records that link an officer to a residential address, their family members, or their household connections can be misused by individuals with intent to harm.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Generic privacy tools are not designed around officer safety concerns. Baseline Solutions focuses specifically on the records most relevant to officers and their families.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-navy-900 mb-4">Family and household exposure</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Even if an officer's direct records are removed, people-search sites often expose household connections — a spouse's name, a parent's address, an adult child's information — that can be used to locate an officer indirectly.
          </p>
          <p className="text-slate-600 leading-relaxed">
            We collect minimum-necessary information about household members when relevant, and treat that data with the same confidentiality as officer profiles.
          </p>
          <div className="mt-4">
            <Link to={ROUTES.familyProtection} className="text-sm font-medium text-navy-700 hover:underline">
              Learn more about family protection →
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-navy-900 mb-4">What data broker records typically expose</h2>
          <ul className="grid grid-cols-2 gap-3">
            {[
              'Current and previous addresses',
              'Phone numbers',
              'Known relatives',
              'Age and date of birth',
              'Email addresses',
              'Employer records',
              'Household member names',
              'Geographic history',
            ].map(item => (
              <li key={item} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-navy-600 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-navy-900 mb-4">Our confidential process</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            We don't collect SSNs, driver's licenses, badge numbers, or sensitive law enforcement credentials. The intake form asks only for what's necessary to identify matching records — name, location, and optional identifiers.
          </p>
          <p className="text-slate-600 leading-relaxed">
            If a broker requires identity verification to complete a removal, we mark the task as <strong>User Action Required</strong> and provide instructions — we don't store your documents.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-navy-900 mb-4">Monthly proof reports</h2>
          <p className="text-slate-600 leading-relaxed">
            Each month you receive a structured report showing which brokers were checked, what was found, what was submitted for removal, what was confirmed removed, and what reappeared. You can share this with your department or keep it for your records.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-navy-900 mb-4">Continuous monitoring</h2>
          <p className="text-slate-600 leading-relaxed">
            Removal is not permanent. Records can reappear on the same site or spread to new sites. We run recurring checks and re-submit removals when records resurface.
          </p>
        </section>
      </div>

      <CTASection />
    </>
  )
}
