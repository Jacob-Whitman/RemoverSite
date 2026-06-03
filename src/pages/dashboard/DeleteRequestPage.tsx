import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { deletionRequestSchema, type DeletionRequestFormData } from '../../lib/validation'
import { Checkbox } from '../../components/ui/Checkbox'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { Card } from '../../components/ui/Card'
import { useAuth } from '../../lib/authContext'
import { SUPABASE_FUNCTIONS_URL } from '../../lib/constants'
import { supabase } from '../../lib/supabaseClient'

const TYPE_OPTIONS = [
  { value: 'full_account_deletion', label: 'Delete my account and all data' },
  { value: 'profile_data_only', label: 'Delete profile data only (keep account)' },
  { value: 'consent_revocation', label: 'Revoke consent and stop processing' },
]

export function DeleteRequestPage() {
  const { user } = useAuth()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<DeletionRequestFormData>({
    resolver: zodResolver(deletionRequestSchema),
  })

  async function onSubmit(data: DeletionRequestFormData) {
    setStatus('loading')
    setErrorMsg('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/request-account-deletion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ request_type: data.request_type }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error ?? 'Request failed')
      }
      setStatus('success')
    } catch (e) {
      setStatus('error')
      setErrorMsg(e instanceof Error ? e.message : 'Request failed. Please try again.')
    }
  }

  if (!user) return null

  if (status === 'success') {
    return (
      <Alert variant="success" title="Request received">
        Your deletion request has been recorded. We will process it within 30 days and confirm by email.
      </Alert>
    )
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Request account deletion</h1>
        <p className="text-sm text-slate-600 mt-1">
          This request will be reviewed by our team and processed within 30 days.
        </p>
      </div>

      <Alert variant="warning" title="This action cannot be undone">
        Account deletion removes your profile, broker tasks, consent records, and reports. Any in-progress broker removals will be cancelled.
      </Alert>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <Select
            label="Request type"
            required
            options={TYPE_OPTIONS}
            placeholder="Select request type"
            error={errors.request_type?.message}
            {...register('request_type')}
          />

          <Checkbox
            label="I understand this action cannot be undone"
            error={errors.confirmation?.message}
            {...register('confirmation')}
          />

          {status === 'error' && <Alert variant="danger">{errorMsg}</Alert>}

          <Button type="submit" variant="danger" loading={status === 'loading'} className="w-full">
            Submit deletion request
          </Button>
        </form>
      </Card>
    </div>
  )
}
