import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
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

interface ConsentUIForm {
  authorization: boolean
  terms_and_privacy: boolean
  recurring_monitoring: boolean
}

export function ConsentForm({ userId, onSuccess }: ConsentFormProps) {
  const [error, setError] = useState('')
  const { control, handleSubmit, watch, formState: { isSubmitting } } = useForm<ConsentUIForm>({
    defaultValues: {
      authorization: false,
      terms_and_privacy: false,
      recurring_monitoring: false,
    },
  })

  const values = watch()
  const allRequired = values.authorization && values.terms_and_privacy

  async function onSubmit(data: ConsentUIForm) {
    setError('')
    try {
      // Map the two combined UI checkboxes back to individual consent records.
      // The database stores granular consent types for legal auditability.
      const consentEntries: { consent_type: ConsentType; consent_given: boolean }[] = [
        { consent_type: 'process_personal_data',        consent_given: data.authorization },
        { consent_type: 'submit_opt_out_requests',       consent_given: data.authorization },
        { consent_type: 'contact_brokers_on_user_behalf',consent_given: data.authorization },
        { consent_type: 'store_evidence',               consent_given: data.authorization },
        { consent_type: 'terms_of_service',             consent_given: data.terms_and_privacy },
        { consent_type: 'privacy_policy',               consent_given: data.terms_and_privacy },
        { consent_type: 'recurring_monitoring',         consent_given: data.recurring_monitoring },
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
        <Controller
          name="authorization"
          control={control}
          render={({ field }) => (
            <Checkbox
              label="I authorize Baseline Solutions to act on my behalf"
              description="I consent to Baseline collecting and processing my personal information, contacting data brokers, submitting opt-out and removal requests, and storing removal status records — all on my behalf."
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />

        <Controller
          name="terms_and_privacy"
          control={control}
          render={({ field }) => (
            <Checkbox
              label={
                <span>
                  I agree to the{' '}
                  <Link to={ROUTES.terms} className="underline hover:text-slate-700" target="_blank" onClick={e => e.stopPropagation()}>
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to={ROUTES.privacy} className="underline hover:text-slate-700" target="_blank" onClick={e => e.stopPropagation()}>
                    Privacy Policy
                  </Link>
                </span>
              }
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />

        <div className="border-t border-slate-100 pt-4">
          <Controller
            name="recurring_monitoring"
            control={control}
            render={({ field }) => (
              <Checkbox
                label="Enable recurring monitoring (optional)"
                description="Re-check for records that reappear after removal on a monthly basis."
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button type="submit" loading={isSubmitting} disabled={!allRequired} className="w-full" size="lg">
        Continue to profile intake
      </Button>

      {!allRequired && (
        <p className="text-xs text-slate-500 text-center">Both required boxes must be checked to continue.</p>
      )}
    </form>
  )
}
