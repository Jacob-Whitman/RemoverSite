import { CTASection } from '../../components/marketing/CTASection'

const steps = [
  {
    num: '01',
    title: 'Confidential intake',
    body: 'You provide basic information — name, city, state — that helps us identify your records on data broker sites. No SSN or ID documents are collected. Optional fields improve match accuracy but are never required.',
  },
  {
    num: '02',
    title: 'Broker scan and record matching',
    body: 'We search a curated list of data broker and people-search sites for records that match your profile. Each potential match is reviewed before action is taken.',
  },
  {
    num: '03',
    title: 'Opt-out submission or guided removal',
    body: 'Where opt-out is available, we submit removal requests on your behalf. When a broker requires you to take action directly, we mark it as User Action Required and explain exactly what to do.',
  },
  {
    num: '04',
    title: 'Broker-by-broker tracking',
    body: 'Every broker request is tracked with a clear status. You can see which requests were submitted, which are pending broker response, which are confirmed removed, and which need follow-up.',
  },
  {
    num: '05',
    title: 'Monthly proof report',
    body: 'Each month you receive a report documenting what was checked, what was found, what was submitted, what was removed, and what reappeared.',
  },
  {
    num: '06',
    title: 'Continuous monitoring and re-checks',
    body: 'Removed records sometimes return. We run recurring checks to catch reappearances early and re-submit removals where possible.',
  },
]

export function HowItWorksPage() {
  return (
    <>
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">How It Works</h1>
          <p className="text-slate-300 text-lg">
            A straightforward, documented process — from intake to monthly proof.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            {steps.map(step => (
              <div key={step.num} className="flex gap-6">
                <div className="shrink-0 text-3xl font-bold text-navy-200 w-12">{step.num}</div>
                <div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 bg-slate-50 border border-slate-200 rounded-lg p-6 text-sm text-slate-600 leading-relaxed">
            <p className="font-semibold text-slate-700 mb-2">Disclaimer</p>
            <p>
              No service can guarantee complete or permanent removal from every website. Broker timelines vary, some records may return, and some brokers require user action. Baseline Solutions provides transparent tracking and documented removal work.
            </p>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
