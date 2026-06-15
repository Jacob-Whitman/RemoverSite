/**
 * Cloudflare Email Worker: email-inbound
 *
 * Receives all inbound email on removals.yourdomain.com via a catch-all
 * Email Routing rule. Parses the recipient to extract the task UUID,
 * finds the verification link in the email body, follows it, then marks
 * the broker_tasks row as removed in Supabase.
 *
 * Required Worker secrets (set via: wrangler secret put <NAME>):
 *   SUPABASE_URL              - https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY - Supabase service role key
 */

import PostalMime from 'postal-mime'

export interface Env {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * Matches the local-part of our proxy addresses.
 * Format: task-{uuid}  e.g. task-550e8400-e29b-41d4-a716-446655440000
 */
const TASK_ADDRESS_RE =
  /^task-([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i

/**
 * Keywords that strongly indicate a link is a verification/action link.
 * Used to score candidate URLs — highest-scoring URL wins.
 */
const POSITIVE_KEYWORDS = [
  'confirm', 'verify', 'verification', 'optout', 'opt-out', 'opt_out',
  'unsubscribe', 'remove', 'removal', 'delete', 'complete', 'activate',
  'action', 'click', 'proceed',
]

/**
 * Patterns that indicate a URL is NOT an action link (images, CDNs, trackers).
 * Filtered out before scoring.
 */
const NEGATIVE_PATTERNS = [
  /\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot|css|js)(\?|$)/i,
  /^https:\/\/(www\.)?(google|facebook|twitter|linkedin|instagram|youtube)\./i,
  /\/track\//i,
  /\/pixel\//i,
  /\/open\//i,
  /\/beacon\//i,
]

// ─── Link extraction ──────────────────────────────────────────────────────────

function scoreUrl(url: string): number {
  const lower = url.toLowerCase()
  return POSITIVE_KEYWORDS.reduce((n, kw) => n + (lower.includes(kw) ? 1 : 0), 0)
}

function isNegativeUrl(url: string): boolean {
  return NEGATIVE_PATTERNS.some((re) => re.test(url))
}

/**
 * Extracts the best verification link from text and/or HTML email body.
 * Collects all https URLs, filters negatives, then returns the highest-scoring one.
 */
function extractVerificationLink(
  text: string | null | undefined,
  html: string | null | undefined,
): string | null {
  const candidates = new Set<string>()

  if (text) {
    for (const m of text.matchAll(/https:\/\/[^\s<>"']{10,2048}/g)) {
      candidates.add(m[0].replace(/[.,;:!?)]+$/, ''))
    }
  }

  if (html) {
    // Unescape HTML entities in URLs before adding
    for (const m of html.matchAll(/https:\/\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=%]{10,2048}?(?=[<"'\s]|$)/g)) {
      candidates.add(m[0].replace(/&amp;/g, '&').replace(/[.,;:!?)]+$/, ''))
    }
  }

  const filtered = [...candidates].filter((u) => !isNegativeUrl(u))
  if (filtered.length === 0) return null

  filtered.sort((a, b) => scoreUrl(b) - scoreUrl(a) || a.localeCompare(b))
  return filtered[0]
}

// ─── Supabase helpers ─────────────────────────────────────────────────────────

async function markTaskRemoved(
  supabaseUrl: string,
  serviceRoleKey: string,
  taskId: string,
): Promise<{ ok: boolean; error?: string }> {
  const now = new Date().toISOString()

  // Filter on status=eq.submitted as an idempotency guard — prevents overwriting
  // a task that was already resolved by an admin or a previous email delivery.
  const url = new URL(`${supabaseUrl}/rest/v1/broker_tasks`)
  url.searchParams.set('id', `eq.${taskId}`)
  url.searchParams.set('status', 'eq.submitted')

  const res = await fetch(url.toString(), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: 'return=headers-only',
    },
    body: JSON.stringify({
      status: 'removed',
      removed_at: now,
      last_checked_at: now,
      requires_user_action: false,
      user_action_type: null,
      failure_reason: null,
    }),
  })

  if (!res.ok) {
    return { ok: false, error: `Supabase PATCH ${res.status}: ${await res.text()}` }
  }

  // PostgREST returns Content-Range: */0 when no rows matched the filter.
  const contentRange = res.headers.get('Content-Range') ?? ''
  if (contentRange.endsWith('/0')) {
    return { ok: false, error: `No task matched id=${taskId} with status=submitted — already resolved or wrong ID` }
  }

  return { ok: true }
}

async function logActivity(
  supabaseUrl: string,
  serviceRoleKey: string,
  taskId: string,
  success: boolean,
  metadata: Record<string, unknown>,
): Promise<void> {
  try {
    await fetch(`${supabaseUrl}/rest/v1/activity_logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        user_id: null,
        actor_type: 'system',
        actor_id: null,
        action: success ? 'email_verification_auto_completed' : 'email_verification_auto_failed',
        entity_type: 'broker_task',
        entity_id: taskId,
        metadata,
      }),
    })
  } catch {
    // Log failures must never interrupt the main verification flow
  }
}

// ─── Email handler ────────────────────────────────────────────────────────────

export default {
  async email(
    message: ForwardableEmailMessage,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<void> {
    // Parse taskId from the recipient address local-part
    // e.g. task-550e8400-e29b-41d4-a716-446655440000@removals.yourdomain.com
    const localPart = message.to.split('@')[0]
    const match = TASK_ADDRESS_RE.exec(localPart)

    if (!match) {
      // Reject unrecognized addresses with a permanent SMTP error (5xx)
      message.setReject('Address not recognized')
      return
    }

    const taskId = match[1].toLowerCase()

    // Buffer the raw stream once — ReadableStream can only be consumed once
    const rawBuffer = await new Response(message.raw).arrayBuffer()
    const parsed = await PostalMime.parse(rawBuffer)

    const verificationLink = extractVerificationLink(parsed.text, parsed.html)

    if (!verificationLink) {
      console.warn(`[email-inbound] No verification link found in email to ${message.to} (subject: ${parsed.subject})`)
      ctx.waitUntil(
        logActivity(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, taskId, false, {
          reason: 'no_verification_link_found',
          subject: parsed.subject ?? null,
          from: message.from,
        }),
      )
      return
    }

    // Follow the verification link — broker records the opt-out on click
    let clickOk = false
    let clickError: string | undefined
    try {
      const clickRes = await fetch(verificationLink, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      })
      if (clickRes.ok) {
        clickOk = true
      } else {
        clickError = `Broker endpoint returned HTTP ${clickRes.status}`
      }
    } catch (err) {
      clickError = String(err)
    }

    if (!clickOk) {
      console.error(`[email-inbound] Link click failed for task ${taskId}: ${clickError}`)
      ctx.waitUntil(
        logActivity(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, taskId, false, {
          reason: 'link_click_failed',
          verification_url: verificationLink,
          error: clickError,
        }),
      )
      return
    }

    // Mark the task removed in Supabase
    const result = await markTaskRemoved(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, taskId)

    if (result.ok) {
      console.log(`[email-inbound] Task ${taskId} marked removed via auto-verification`)
    } else {
      console.error(`[email-inbound] Supabase update failed for task ${taskId}: ${result.error}`)
    }

    ctx.waitUntil(
      logActivity(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, taskId, result.ok, {
        verification_url: verificationLink,
        from: message.from,
        subject: parsed.subject ?? null,
        ...(result.error ? { error: result.error } : {}),
      }),
    )
  },
} satisfies ExportedHandler<Env>
