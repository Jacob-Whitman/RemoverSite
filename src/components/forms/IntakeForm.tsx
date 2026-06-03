import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { intakeSchema, type IntakeFormData } from '../../lib/validation'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Checkbox } from '../ui/Checkbox'
import { Button } from '../ui/Button'
import { Alert } from '../ui/Alert'
import { US_STATES } from '../../lib/constants'
import { supabase } from '../../lib/supabaseClient'
import { useState } from 'react'
import type { User } from '@supabase/supabase-js'

const STATE_OPTIONS = US_STATES.map(s => ({ value: s, label: s }))

interface IntakeFormProps {
  user: User
  defaultEmail: string
  onSuccess: () => void
}

export function IntakeForm({ user, defaultEmail, onSuccess }: IntakeFormProps) {
  const [error, setError] = useState('')

  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<IntakeFormData>({
    resolver: zodResolver(intakeSchema),
    defaultValues: {
      email: defaultEmail,
      public_facing_professional: false,
      household_removal_interest: false,
      recurring_monitoring_interest: false,
      consent_confirmed: true,
    },
  })

  async function onSubmit(data: IntakeFormData) {
    setError('')
    try {
      // Cast needed because our hand-written Database type doesn't perfectly match supabase-js generics
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const typedFrom = supabase.from as any
      const { error: upsertError } = await typedFrom('profiles').upsert({
        id: user.id,
        email: data.email,
        legal_first_name: data.legal_first_name,
        legal_middle_name: data.legal_middle_name ?? null,
        legal_last_name: data.legal_last_name,
        current_city: data.current_city,
        current_state: data.current_state,
        aliases: data.aliases ?? [],
        year_of_birth: data.year_of_birth ?? null,
        phone_numbers: data.phone_numbers ?? [],
        alternate_emails: data.alternate_emails ?? [],
        employer_or_business: data.employer_or_business ?? null,
        public_facing_professional: data.public_facing_professional ?? false,
        household_removal_interest: data.household_removal_interest ?? false,
        recurring_monitoring_interest: data.recurring_monitoring_interest ?? false,
        updated_at: new Date().toISOString(),
      })
      if (upsertError) throw upsertError
      onSuccess()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save profile. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="bg-slate-50 border border-slate-200 rounded-md px-4 py-3 text-sm text-slate-600 leading-relaxed">
        We only ask for information that can help identify exposed data broker records. Optional fields may improve match accuracy. <strong>Do not submit SSNs, driver's license images, or sensitive credentials.</strong>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Required information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Legal first name" required error={errors.legal_first_name?.message} {...register('legal_first_name')} />
          <Input label="Legal middle name" error={errors.legal_middle_name?.message} {...register('legal_middle_name')} />
          <Input label="Legal last name" required error={errors.legal_last_name?.message} {...register('legal_last_name')} className="sm:col-span-2" />
        </div>
        <Input label="Email address" type="email" required error={errors.email?.message} {...register('email')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Current city" required error={errors.current_city?.message} {...register('current_city')} />
          <Select label="Current state" required options={STATE_OPTIONS} placeholder="Select state" error={errors.current_state?.message} {...register('current_state')} />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Optional — improves match accuracy</h3>
        <Input
          label="Year of birth"
          placeholder="e.g. 1985"
          hint="4-digit year only. Helps distinguish your record from others with the same name."
          error={errors.year_of_birth?.message}
          {...register('year_of_birth')}
        />
        <Input
          label="Employer or department type"
          placeholder="e.g. Municipal PD, County Sheriff — do not include department name"
          hint="Optional. Do not include your specific department name."
          error={errors.employer_or_business?.message}
          {...register('employer_or_business')}
        />
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Preferences</h3>
        <Controller
          name="public_facing_professional"
          control={control}
          render={({ field }) => (
            <Checkbox
              label="I am in a public-facing professional role"
              description="Police officer, sheriff, first responder, or similar."
              checked={!!field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name="household_removal_interest"
          control={control}
          render={({ field }) => (
            <Checkbox
              label="I'm interested in household / family member coverage"
              description="A team member will follow up to discuss family member inclusion."
              checked={!!field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name="recurring_monitoring_interest"
          control={control}
          render={({ field }) => (
            <Checkbox
              label="I'm interested in recurring monitoring"
              description="Monthly re-checks for records that reappear after removal."
              checked={!!field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
        Save profile and continue
      </Button>
    </form>
  )
}
