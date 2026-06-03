import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactFormData } from '../../lib/validation'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'
import { Button } from '../ui/Button'
import { Alert } from '../ui/Alert'
import { TurnstileWidget } from '../security/TurnstileWidget'
import { SUPABASE_FUNCTIONS_URL, ROLE_OPTIONS, US_STATES } from '../../lib/constants'
import { supabase } from '../../lib/supabaseClient'

const STATE_OPTIONS = US_STATES.map(s => ({ value: s, label: s }))

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  async function onSubmit(data: ContactFormData) {
    setStatus('loading')
    setErrorMsg('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/submit-contact-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error ?? 'Submission failed')
      }
      setStatus('success')
    } catch (e) {
      setStatus('error')
      setErrorMsg(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <Alert variant="success" title="Request received">
        Thank you. We will follow up confidentially within 2 business days.
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="bg-amber-50 border border-amber-200 rounded-md px-4 py-3 text-sm text-amber-800">
        <strong>Please do not include</strong> SSNs, badge numbers, sensitive case information, or confidential law enforcement details in this form.
      </div>

      <Input label="Full name" required error={errors.name?.message} {...register('name')} />
      <Input label="Email address" type="email" required error={errors.email?.message} {...register('email')} />

      <Select
        label="Your role"
        required
        options={ROLE_OPTIONS}
        placeholder="Select your role"
        error={errors.role?.message}
        {...register('role')}
      />

      <Select
        label="State"
        required
        options={STATE_OPTIONS}
        placeholder="Select state"
        error={errors.state?.message}
        {...register('state')}
      />

      <Textarea
        label="Message"
        required
        placeholder="Briefly describe your situation or what you'd like to discuss."
        error={errors.message?.message}
        {...register('message')}
      />

      <div>
        <p className="text-xs text-slate-500 mb-2">Please complete the security check below.</p>
        <TurnstileWidget
          onToken={token => setValue('turnstileToken', token, { shouldValidate: true })}
          onExpire={() => setValue('turnstileToken', '', { shouldValidate: true })}
        />
        {errors.turnstileToken && <p className="text-xs text-red-600 mt-1">{errors.turnstileToken.message}</p>}
      </div>

      {status === 'error' && <Alert variant="danger">{errorMsg}</Alert>}

      <Button type="submit" loading={status === 'loading'} className="w-full" size="lg">
        Submit Confidential Request
      </Button>
    </form>
  )
}
