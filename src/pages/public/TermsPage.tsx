export function TermsPage() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-10">Version 1.0 — Effective upon launch.</p>

        <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Service description</h2>
            <p>Baseline Solutions provides data broker removal assistance, status tracking, and monthly proof reports. We help reduce your public exposure by submitting opt-out requests and tracking removal statuses on data broker sites.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">No guarantee of removal</h2>
            <p>No service can guarantee complete or permanent removal from every data broker website. Broker timelines vary. Some records may return. Some brokers require user action that we cannot complete on your behalf. We document our work and provide transparent status tracking.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Acceptable use</h2>
            <p>You may use this service only for lawful privacy removal purposes for yourself and authorized household members. You may not use this service to remove records on behalf of others without their consent.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Account responsibility</h2>
            <p>You are responsible for maintaining the security of your account credentials. Do not share your account with others. Contact us immediately if you believe your account has been compromised.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Limitation of liability</h2>
            <p>Baseline Solutions is not liable for data broker actions, timelines, or outcomes beyond our control. Our liability is limited to the fees paid for the applicable service period.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Changes to these terms</h2>
            <p>We may update these terms. We will notify you of material changes through your dashboard or the email address on your account. Continued use after notice constitutes acceptance.</p>
          </section>
        </div>
      </div>
    </section>
  )
}
