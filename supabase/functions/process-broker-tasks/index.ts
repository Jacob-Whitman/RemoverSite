// Edge Function: process-broker-tasks
// Processes pending broker opt-out tasks for all users (or a specific user).
// Supports two automation methods:
//   - email: sends a CCPA opt-out email via Resend API to the broker's privacy contact
//   - form_submit: submits an HTTP POST/GET form with the user's profile fields
//
// Required Supabase secrets:
//   RESEND_API_KEY       - Resend API key for sending email
//   REMOVAL_EMAIL_FROM   - "From" address (e.g. "removals@removals.homeplateshield.com")
//
// Body params:
//   user_id?      - scope to a single user
//   retry_failed? - if true, also retry tasks with status = 'failed'

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BATCH_SIZE = 10
const REQUEST_DELAY_MS = 500

// ─── Types ────────────────────────────────────────────────────────────────────

interface AutomationConfig {
  type: 'email' | 'form'
  url?: string
  method?: 'POST' | 'GET'
  content_type?: string
  fields?: Record<string, string>
}

interface BrokerRow {
  id: string
  name: string
  source_reference: string | null
  automation_method: string
  automation_config: AutomationConfig | null
  opt_out_url: string | null
  requires_email_verification: boolean
}

interface TaskRow {
  id: string
  user_id: string
  broker_id: string
  broker: BrokerRow
}

interface ProfileRow {
  email: string | null
  legal_first_name: string | null
  legal_middle_name: string | null
  legal_last_name: string | null
  current_city: string | null
  current_state: string | null
  current_address: { street?: string; city: string; state: string; zip?: string } | null
  year_of_birth: string | null
  phone_numbers: string[]
  aliases: string[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function buildProfileMap(p: ProfileRow): Record<string, string> {
  const map: Record<string, string> = {}
  const set = (value: string | null | undefined, ...keys: string[]) => {
    if (!value) return
    for (const k of keys) map[k] = value
  }
  set(p.legal_first_name, 'first_name', 'firstName', 'fname', 'first')
  set(p.legal_last_name, 'last_name', 'lastName', 'lname', 'last')
  set(p.legal_middle_name, 'middle_name', 'middleName', 'mname', 'middle')
  set(p.email, 'email', 'emailAddress', 'email_address')
  set(p.current_state, 'state', 'stateCode', 'state_code')
  set(p.current_city, 'city', 'cityName', 'city_name')
  set(p.year_of_birth, 'year_of_birth', 'yearOfBirth', 'dob_year', 'birth_year')
  if (p.current_address) {
    set(p.current_address.street, 'street', 'streetAddress', 'address', 'address1')
    set(p.current_address.city, 'city', 'cityName')
    set(p.current_address.state, 'state', 'stateCode')
    set(p.current_address.zip, 'zip', 'zipCode', 'postal_code', 'postalCode')
  }
  if (p.phone_numbers?.length) {
    set(p.phone_numbers[0], 'phone', 'phoneNumber', 'phone_number', 'tel')
  }
  const fullName = [p.legal_first_name, p.legal_middle_name, p.legal_last_name].filter(Boolean).join(' ')
  if (fullName) set(fullName, 'full_name', 'fullName', 'name')
  return map
}

// ─── Email automation ─────────────────────────────────────────────────────────

async function sendOptOutEmail(
  resendApiKey: string,
  fromAddress: string,
  broker: BrokerRow,
  profile: ProfileRow,
): Promise<{ success: boolean; error?: string }> {
  const toAddress = broker.source_reference
  if (!toAddress || !toAddress.includes('@')) {
    return { success: false, error: 'No valid privacy contact email in source_reference' }
  }

  const firstName = profile.legal_first_name ?? ''
  const lastName = profile.legal_last_name ?? ''
  const fullName = [firstName, profile.legal_middle_name, lastName].filter(Boolean).join(' ')
  const email = profile.email ?? ''
  const state = profile.current_address?.state ?? profile.current_state ?? ''
  const city = profile.current_address?.city ?? profile.current_city ?? ''

  const subject = `CCPA Opt-Out and Data Deletion Request — ${fullName}`
  const body = `To Whom It May Concern,

I am writing to request the immediate deletion of all personal information your company, ${broker.name}, holds about me pursuant to the California Consumer Privacy Act (CCPA) and any other applicable state or federal privacy laws.

My information:
  Full Name:     ${fullName}
  Email Address: ${email}
  City, State:   ${city}, ${state}${profile.year_of_birth ? `\n  Year of Birth: ${profile.year_of_birth}` : ''}

Please:
1. Delete all records, profiles, and data associated with my name, email, address, and any other identifiers.
2. Opt me out of all data collection and sale of my personal information.
3. Confirm in writing that my data has been removed.

I expect a response within 45 days as required under the CCPA (Cal. Civ. Code § 1798.105). If your company operates in a state with similar data deletion rights (such as Virginia, Colorado, Connecticut, or Texas), I am invoking those rights as well.

Failure to comply may be reported to the California Attorney General's office.

Respectfully,
${fullName}
${email}`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: fromAddress, to: [toAddress], subject, text: body }),
  })

  if (!res.ok) {
    const text = await res.text()
    return { success: false, error: `Resend API ${res.status}: ${text}` }
  }

  return { success: true }
}

// ─── Form submission automation ───────────────────────────────────────────────

async function submitOptOutForm(
  broker: BrokerRow,
  profile: ProfileRow,
): Promise<{ success: boolean; error?: string }> {
  const config = broker.automation_config
  if (!config || config.type !== 'form' || !config.url || !config.fields) {
    return { success: false, error: 'Invalid or missing form automation_config' }
  }

  const profileMap = buildProfileMap(profile)
  const formData: Record<string, string> = {}
  for (const [formField, profileField] of Object.entries(config.fields)) {
    formData[formField] = profileMap[profileField] ?? ''
  }

  const method = config.method ?? 'POST'
  const contentType = config.content_type ?? 'application/x-www-form-urlencoded'
  const headers: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (compatible; PrivacyOptOut/1.0)',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  }

  let url = config.url
  let body: string | undefined

  if (method === 'GET') {
    url = `${config.url}?${new URLSearchParams(formData).toString()}`
  } else if (contentType === 'application/json') {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(formData)
  } else {
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
    body = new URLSearchParams(formData).toString()
  }

  try {
    const res = await fetch(url, { method, headers, body })
    if (res.status >= 400) return { success: false, error: `HTTP ${res.status} from form endpoint` }
    return { success: true }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const resendApiKey = Deno.env.get('RESEND_API_KEY') ?? ''
    const fromAddress = Deno.env.get('REMOVAL_EMAIL_FROM') ?? ''

    const authHeader = req.headers.get('Authorization') ?? ''
    const serviceClient = createClient(supabaseUrl, serviceRoleKey)

    if (!authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS })
    }

    const token = authHeader.slice(7)
    if (token !== serviceRoleKey) {
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      })
      const { data: { user }, error: authError } = await userClient.auth.getUser()
      if (authError || !user) {
        return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS })
      }
      const { data: profile } = await serviceClient
        .from('profiles').select('role').eq('id', user.id).maybeSingle()
      if (profile?.role !== 'admin') {
        return Response.json({ error: 'Forbidden — admin only' }, { status: 403, headers: CORS_HEADERS })
      }
    }

    const body = await req.json().catch(() => ({}))
    const filterUserId: string | null = body.user_id ?? null
    const retryFailed: boolean = body.retry_failed === true

    // Build status filter: always include not_started, optionally also failed
    const statusFilter = retryFailed ? ['not_started', 'failed'] : ['not_started']

    // When scoped to a single user (e.g. right after intake), process all their
    // tasks in one shot. For global cron runs, cap at BATCH_SIZE to avoid timeouts.
    const limit = filterUserId ? 200 : BATCH_SIZE

    let taskQuery = serviceClient
      .from('broker_tasks')
      .select(`
        id,
        user_id,
        broker_id,
        broker:brokers (
          id,
          name,
          source_reference,
          automation_method,
          automation_config,
          opt_out_url,
          requires_email_verification
        )
      `)
      .in('status', statusFilter)
      .limit(limit)

    if (filterUserId) taskQuery = taskQuery.eq('user_id', filterUserId)

    const { data: tasks, error: taskError } = await taskQuery
    if (taskError) throw taskError

    if (!tasks || tasks.length === 0) {
      return Response.json({ success: true, processed: 0, message: 'No pending tasks' }, { headers: CORS_HEADERS })
    }

    const results = {
      processed: 0,
      email_sent: 0,
      form_submitted: 0,
      waiting_user_action: 0,
      skipped_no_consent: 0,
      failed: 0,
      errors: [] as Array<{ task_id: string; broker: string; error: string }>,
    }

    const profileCache: Record<string, ProfileRow | null> = {}
    const consentCache: Record<string, boolean> = {}

    for (const task of tasks as TaskRow[]) {
      const broker = task.broker
      if (!broker || !broker.automation_method) continue

      // Check consent
      if (!(task.user_id in consentCache)) {
        const { data: consent } = await serviceClient
          .from('consent_records')
          .select('id')
          .eq('user_id', task.user_id)
          .eq('consent_type', 'submit_opt_out_requests')
          .eq('consent_given', true)
          .is('revoked_at', null)
          .maybeSingle()
        consentCache[task.user_id] = !!consent
      }
      if (!consentCache[task.user_id]) { results.skipped_no_consent++; continue }

      // Fetch profile
      if (!(task.user_id in profileCache)) {
        const { data: p } = await serviceClient
          .from('profiles')
          .select('email, legal_first_name, legal_middle_name, legal_last_name, current_city, current_state, current_address, year_of_birth, phone_numbers, aliases')
          .eq('id', task.user_id)
          .maybeSingle()
        profileCache[task.user_id] = p ?? null
      }
      const profile = profileCache[task.user_id]
      if (!profile) {
        results.failed++
        results.errors.push({ task_id: task.id, broker: broker.name, error: 'Profile not found' })
        continue
      }

      // Submit
      let outcome: { success: boolean; error?: string }
      if (broker.automation_method === 'email') {
        outcome = resendApiKey
          ? await sendOptOutEmail(resendApiKey, fromAddress, broker, profile)
          : { success: false, error: 'RESEND_API_KEY not configured' }
      } else if (broker.automation_method === 'form_submit') {
        outcome = await submitOptOutForm(broker, profile)
      } else {
        outcome = { success: false, error: `Unknown automation_method: ${broker.automation_method}` }
      }

      const now = new Date().toISOString()

      let updatePayload: Record<string, unknown>
      if (outcome.success) {
        // If the broker sends a confirmation email to the user, they need to act on it
        if (broker.requires_email_verification) {
          updatePayload = {
            status: 'waiting_user_action',
            submitted_at: now,
            last_checked_at: now,
            failure_reason: null,
            requires_user_action: true,
            user_action_type: 'Check your email and click the confirmation link sent by ' + broker.name + ' to complete your removal request.',
          }
          results.waiting_user_action++
        } else {
          updatePayload = {
            status: 'submitted',
            submitted_at: now,
            last_checked_at: now,
            failure_reason: null,
            requires_user_action: false,
          }
          if (broker.automation_method === 'email') results.email_sent++
          else results.form_submitted++
        }
      } else {
        updatePayload = {
          status: 'failed',
          last_checked_at: now,
          failure_reason: outcome.error ?? 'Unknown error',
        }
        results.failed++
        results.errors.push({ task_id: task.id, broker: broker.name, error: outcome.error ?? 'Unknown' })
      }

      await serviceClient.from('broker_tasks').update(updatePayload).eq('id', task.id)

      await serviceClient.from('activity_logs').insert({
        user_id: task.user_id,
        actor_type: 'edge_function',
        actor_id: null,
        action: outcome.success ? 'opt_out_submitted' : 'opt_out_failed',
        entity_type: 'broker_task',
        entity_id: task.id,
        metadata: {
          broker_id: broker.id,
          broker_name: broker.name,
          automation_method: broker.automation_method,
          requires_email_verification: broker.requires_email_verification,
          ...(outcome.error ? { error: outcome.error } : {}),
        },
      })

      results.processed++
      await sleep(REQUEST_DELAY_MS)
    }

    return Response.json({ success: true, ...results }, { headers: CORS_HEADERS })
  } catch (err) {
    console.error('process-broker-tasks error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500, headers: CORS_HEADERS })
  }
})
