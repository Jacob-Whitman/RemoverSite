import { ContactForm } from '../../components/forms/ContactForm'

export function ContactPage() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Confidential Privacy Review</h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Use this form to request a confidential privacy review. We'll follow up within 2 business days to discuss your situation and explain next steps.
        </p>
        <ContactForm />
      </div>
    </section>
  )
}
