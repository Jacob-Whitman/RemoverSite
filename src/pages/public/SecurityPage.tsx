export function SecurityPage() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-6">Security</h1>
        <p className="text-slate-600 mb-10 leading-relaxed">
          We take a security-first approach to handling personal information. Below is a summary of our technical and operational security practices.
        </p>

        <div className="space-y-10">
          {[
            {
              heading: 'Data minimization',
              body: 'We collect only the information needed to identify and remove data broker records. SSNs, driver\'s licenses, passport images, financial account numbers, and sensitive credentials are not collected at any point.',
            },
            {
              heading: 'Authentication',
              body: 'User accounts are managed through Supabase Auth. We do not store passwords ourselves — authentication is handled by a dedicated identity service with industry-standard security.',
            },
            {
              heading: 'Row-level security',
              body: 'All database tables have Row Level Security (RLS) enabled. Users can only access their own data. Admin access is enforced at the database level, not only at the application layer.',
            },
            {
              heading: 'No sensitive data in browser storage',
              body: 'Profile data is not stored in localStorage or sessionStorage. Session management is handled by Supabase Auth, not by custom browser-side token logic.',
            },
            {
              heading: 'Server-side verification',
              body: 'Form submissions that use Cloudflare Turnstile for anti-spam protection are verified server-side via a Supabase Edge Function. The Turnstile secret key is never exposed to the browser.',
            },
            {
              heading: 'Infrastructure',
              body: 'The application is hosted on GitHub Pages behind Cloudflare DNS and WAF. Supabase handles database, authentication, and serverless functions.',
            },
            {
              heading: 'What we do not store',
              body: 'SSNs · Driver\'s license scans · Passport images · Financial accounts · Medical records · Biometric data · Badge numbers · Sensitive law enforcement credentials · Found broker record URLs in public-facing pages.',
            },
          ].map(section => (
            <div key={section.heading}>
              <h2 className="text-lg font-semibold text-navy-900 mb-2">{section.heading}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
