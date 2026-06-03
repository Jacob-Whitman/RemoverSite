// Edge Function: submit-contact-request
// Validates Turnstile, validates input, and stores/sends contact request.
// TODO: Add email sending (Resend, SendGrid, or similar) when configured.
// TODO: Add rate limiting per IP or email.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
// TODO: import createClient when database storage of contact requests is implemented
// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContactPayload {
  name: string
  email: string
  role: string
  state: string
  message: string
  turnstileToken: string
}

async function verifyTurnstile(token: string, secretKey: string, clientIp?: string): Promise<boolean> {
  const form = new FormData()
  form.append('secret', secretKey)
  form.append('response', token)
  if (clientIp) form.append('remoteip', clientIp)

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  })
  const result = await res.json()
  return result.success === true
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    const body: ContactPayload = await req.json()

    // Basic input validation
    if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim() || !body.turnstileToken) {
      return Response.json({ error: 'Missing required fields' }, { status: 400, headers: CORS_HEADERS })
    }

    if (body.message.trim().length < 10 || body.message.trim().length > 2000) {
      return Response.json({ error: 'Message length invalid' }, { status: 400, headers: CORS_HEADERS })
    }

    // Server-side Turnstile verification
    const turnstileSecret = Deno.env.get('CLOUDFLARE_TURNSTILE_SECRET_KEY')
    if (!turnstileSecret) {
      console.error('CLOUDFLARE_TURNSTILE_SECRET_KEY not set')
      return Response.json({ error: 'Server configuration error' }, { status: 500, headers: CORS_HEADERS })
    }

    const clientIp = req.headers.get('CF-Connecting-IP') ?? req.headers.get('X-Forwarded-For') ?? undefined
    const turnstileOk = await verifyTurnstile(body.turnstileToken, turnstileSecret, clientIp)

    if (!turnstileOk) {
      return Response.json({ error: 'Security check failed' }, { status: 403, headers: CORS_HEADERS })
    }

    // TODO: Store contact request in database or send email
    // Example: insert into a contact_requests table using service role
    // Example: call Resend/SendGrid API to forward to team inbox
    //
    // For now: log safely (no PII in production logs)
    console.log(`Contact request received from role=${body.role} state=${body.state} (email redacted)`)

    // TODO: When email is configured, send to team address here.
    // Do NOT log email addresses or full message content in production.

    return Response.json({ success: true }, { headers: CORS_HEADERS })
  } catch (err) {
    console.error('submit-contact-request error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500, headers: CORS_HEADERS })
  }
})
