import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { consentSchema, type ConsentFormData } from '../../lib/validation'
import { Checkbox } from '../ui/Checkbox'
import { Button } from '../ui/Button'
import { Alert } from '../ui/Alert'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { supabase } from '../../lib/supabaseClient'
import { CONSENT_VERSION } from '../../lib/constants'
import type { ConsentType } from '../../types/database'

interface ConsentFormProps {
  userId: string
  onSuccess: () => void
}

const REQUIRED_CONSENTS: { key: keyof ConsentFormData; label: string; description: string }[] = [
  {
    key: 'process_personal_data',
    label: 'Processing my personal data',
    description: 'I consent to Baseline Solutions collecting and processing my personal information to identify and remove data broker records.',
  },
  {
    key: 'submit_opt_out_requests',
    label: 'Submitting opt-out and removal requests',
    description: 'I authorize Baseline Solutions to submit opt-out and removal requests to data brokers on my behalf.',
  },
  {
    key: 'contact_brokers_on_user_behalf',
    label: 'Contacting brokers on my behalf',
    description: 'I authorize Baseline Solutions to contact data broker sites to request the removal of my records.',
  },
  {
    key: 'store_evidence',
    label: 'Storing limited evidence and status data',
    description: 'I consent to storing broker status information and limited removal evidence linked to my account.',
  },
  {
    key: 'terms_of_service',
    label: 'Terms of Service',
    description: '',
  },
  {
    key: 'privacy_policy',
    label: 'Privacy Policy',
    description: '',
  },
]

export function ConsentForm({ userId, onSuccess }: ConsentFormProps) {
  const [error, setError] = useState('')
  const { control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ConsentFormData>({
    resolver: zodResolver(consentSchema),
    defaultValues: {
      process_personal_data: false as unknown as true,
      submit_opt_out_requests: false as unknown as true,
      contact_brokers_on_user_behalf: false as unknown as true,
      store_evidence: false as unknown as true,
      terms_of_service: false as unknown as true,
      privacy_policy: false as unknown as true,
      recurring_monitoring: false,
    },
  })

  const values = watch()
  const allRequired = REQUIRED_CONSENTS.every(c => values[c.key] === true)

  async function onSubmit(data: ConsentFormData) {
    setError('')
    try {
      const consentEntries: { consent_type: ConsentType; consent_given: boolean }[] = [
        { consent_type: 'process_personal_data', consent_given: data.process_personal_data },
        { consent_type: 'submit_opt_out_requests', consent_given: data.submit_opt_out_requests },
        { consent_type: 'contact_brokers_on_user_behalf', consent_given: data.contact_brokers_on_user_behalf },
        { consent_type: 'store_evidence', consent_given: data.store_evidence },
        { consent_type: 'terms_of_service', consent_given: data.terms_of_service },
        { consent_type: 'privacy_policy', consent_given: data.privacy_policy },
        { consent_type: 'recurring_monitoring', consent_given: data.recurring_monitoring ?? false },
      ]

      const rows = consentEntries.map(entry => ({
        user_id: userId,
        consent_type: entry.consent_type,
        consent_text_version: CONSENT_VERSION,
        consent_given: entry.consent_given,
        user_agent: navigator.userAgent,
      }))

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await supabase.from('consent_records').insert(rows as any)
      if (insertError) throw insertError

      onSuccess()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save consent. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="space-y-4">
        {REQUIRED_CONSENTS.map(item => (
          <Controller
            key={item.key}
            name={item.key}
            control={control}
            render={({ field }) => (
              <Checkbox
                label={item.key === 'terms_of_service'
                  ? 'I agree to the Terms of Service'
                  : item.key === 'privacy_policy'
                  ? 'I have read and agree to the Privacy Policy'
                  : item.label}
                description={
                  item.key === 'terms_of_service' ? undefined
                  : item.key === 'privacy_policy' ? undefined
                  : item.description
                }
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                error={errors[item.key]?.message}
              />
            )}
          />
        ))}

        <div className="ml-0">
          <p className="text-xs text-slate-500 -mt-1 mb-2">
            <Link to={ROUTES.terms} className="underline hover:text-slate-700" target="_blank">Terms of Service</Link>
            {' · '}
            <Link to={ROUTES.privacy} className="underline hover:text-slate-700" target="_blank">Privacy Policy</Link>
          </p>
        </div>

        <Controller
          name="recurring_monitoring"
          control={control}
          render={({ field }) => (
            <Checkbox
              label="Recurring monitoring (optional)"
              description="I consent to recurring checks to detect records that reappear after removal."
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button type="submit" loading={isSubmitting} disabled={!allRequired} className="w-full" size="lg">
        Continue to profile intake
      </Button>

      {!allRequired && (
        <p className="text-xs text-slate-500 text-center">All required consents must be checked to continue.</p>
      )}
    </form>
  )
}
