// Edge Function: verify-turnstile
// Validates a Cloudflare Turnstile token server-side.
// NEVER expose CLOUDFLARE_TURNSTILE_SECRET_KEY to the browser.
// This function must be called by any form protected by Turnstile before trusting the submission.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TurnstileVerifyResponse {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    const body = await req.json()
    const token: string | undefined = body?.token

    if (!token || typeof token !== 'string') {
      return Response.json({ success: false, error: 'Missing token' }, { status: 400, headers: CORS_HEADERS })
    }

    const secretKey = Deno.env.get('CLOUDFLARE_TURNSTILE_SECRET_KEY')
    if (!secretKey) {
      console.error('CLOUDFLARE_TURNSTILE_SECRET_KEY is not set')
      return Response.json({ success: false, error: 'Server configuration error' }, { status: 500, headers: CORS_HEADERS })
    }

    const formData = new FormData()
    formData.append('secret', secretKey)
    formData.append('response', token)

    // Optional: pass client IP for additional verification
    const clientIp = req.headers.get('CF-Connecting-IP') ?? req.headers.get('X-Forwarded-For')
    if (clientIp) {
      formData.append('remoteip', clientIp)
    }

    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    })

    const result: TurnstileVerifyResponse = await verifyRes.json()

    if (!result.success) {
      console.warn('Turnstile verification failed:', result['error-codes'])
      return Response.json(
        { success: false, error: 'Turnstile verification failed', codes: result['error-codes'] },
        { status: 403, headers: CORS_HEADERS }
      )
    }

    return Response.json({ success: true }, { headers: CORS_HEADERS })
  } catch (err) {
    console.error('verify-turnstile error:', err)
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500, headers: CORS_HEADERS })
  }
})
