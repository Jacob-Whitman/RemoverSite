import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'Do you collect SSNs or driver\'s license images?',
    a: 'No. We do not collect Social Security Numbers, driver\'s licenses, passport images, financial account numbers, or sensitive law enforcement credentials. If a broker requires identity verification, the task is marked as User Action Required so you can complete it directly.',
  },
  {
    q: 'Can you guarantee removal from every site?',
    a: 'No service can guarantee complete or permanent removal from every data broker site. Broker timelines vary, some records may return, and some brokers require user action. We provide transparent tracking and documented removal work.',
  },
  {
    q: 'How long does removal take?',
    a: 'Timelines vary by broker. Some process requests within a few days; others may take several weeks. We track each request status and update you through your dashboard and monthly report.',
  },
  {
    q: 'What happens if a record reappears?',
    a: 'We run recurring monitoring checks to detect records that resurface. When a reappearance is detected, the task status updates to Reappeared and we re-submit the removal request where possible.',
  },
  {
    q: 'Is my information shared with anyone?',
    a: 'Your information is collected only to perform the service — to search for and remove your records from data broker sites. We do not sell or share your personal information with third parties for marketing or analytics.',
  },
  {
    q: 'Can I include family members?',
    a: 'Yes. Household and family member coverage can be added as an optional scope. In the current version, indicate your interest during intake and a team member will follow up. We treat all household member data with the same confidentiality as your own profile.',
  },
  {
    q: 'What is in the monthly proof report?',
    a: 'Your monthly report shows which brokers were checked, where records were found, which opt-outs were submitted, which removals were confirmed, which requests are still pending, and whether any records reappeared.',
  },
  {
    q: 'Is this service only for police officers?',
    a: 'Our service is focused on law enforcement professionals and their families, including officers, first responders, and department personnel. Contact us if you\'re unsure whether your situation fits.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-slate-200">
      <button
        className="flex items-center justify-between w-full py-4 text-left text-sm font-medium text-slate-800 hover:text-navy-800 transition-colors"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        {q}
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pb-4 text-sm text-slate-600 leading-relaxed">{a}</p>}
    </div>
  )
}

export function FAQPage() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-8">Frequently Asked Questions</h1>
        <div>
          {faqs.map(item => <FAQItem key={item.q} {...item} />)}
        </div>
      </div>
    </section>
  )
}
