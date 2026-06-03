export function PrivacyPage() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-10">Version 1.0 — Effective upon launch.</p>

        <div className="prose prose-slate max-w-none space-y-8 text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">What information we collect</h2>
            <p>We collect information you provide directly: your name, email address, city, state, and optional profile fields that help us identify data broker records. We do not collect SSNs, driver's licenses, or sensitive documents.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">How we use your information</h2>
            <p>Your information is used only to perform the data broker removal service: searching for records, submitting opt-out requests, tracking statuses, and generating monthly proof reports. We do not sell, rent, or share your personal information for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Data storage and security</h2>
            <p>Your profile data is stored in a Supabase Postgres database with Row Level Security enabled. Authentication is handled by Supabase Auth. We do not store personal data in browser localStorage or sessionStorage.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Your rights</h2>
            <p>You may request deletion of your account and profile data at any time from your dashboard. You may also revoke consent or request a data export by contacting us.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Consent records</h2>
            <p>When you consent to data processing, we record a timestamped consent record linked to your account. This record documents what you consented to, the version of the consent text, and when consent was given.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Contact</h2>
            <p>For privacy inquiries, use the contact form on this site.</p>
          </section>
        </div>
      </div>
    </section>
  )
}
