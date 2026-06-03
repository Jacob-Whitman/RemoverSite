import { CTASection } from '../../components/marketing/CTASection'

export function FamilyProtectionPage() {
  return (
    <>
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Family and Household Protection</h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Removing only the officer's record may not be enough. People-search sites often expose household connections that can be used to locate an officer indirectly.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">

        <section>
          <h2 className="text-2xl font-bold text-navy-900 mb-4">How household exposure works</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Data broker and people-search sites aggregate information from public records, court filings, voter rolls, utility records, and commercial databases. They don't just list individuals — they build household profiles that link names, addresses, and relatives together.
          </p>
          <p className="text-slate-600 leading-relaxed">
            This means that even if an officer's direct profile is removed, a spouse's, parent's, or sibling's record may still expose an address that links back to the officer's household.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-navy-900 mb-4">Who may be affected</h2>
          <ul className="space-y-2 text-slate-600 text-sm">
            {[
              'Spouse or domestic partner',
              'Parent or in-law at the same address',
              'Adult children at a shared address',
              'Siblings with a listed household connection',
              'Other household members',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-navy-600 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-navy-900 mb-4">Our approach to household members</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            We collect only the minimum necessary information about household members when included in a removal scope. Household member data is treated with the same confidentiality as officer profiles and is used only to search for and remove related records.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            In this initial version, household member onboarding is an optional interest field. If you indicate interest, a team member will follow up to gather the necessary information through a confidential process.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4 text-sm text-slate-600">
            We do not collect SSNs, driver's licenses, or sensitive documents for household members. The same data minimization principles apply to all records under your account.
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-navy-900 mb-4">What we check</h2>
          <p className="text-slate-600 leading-relaxed">
            Household member checks follow the same broker-by-broker process as officer profiles: identify records, submit or guide opt-outs, track status, and monitor for reappearance. Each household member is treated as a separate profile scope within your account.
          </p>
        </section>
      </div>

      <CTASection />
    </>
  )
}
