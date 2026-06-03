// Edge Function: request-account-deletion
// Inserts a deletion request for the authenticated user and logs the action.
// Requires a valid user JWT in the Authorization header.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const VALID_REQUEST_TYPES = ['full_account_deletion', 'profile_data_only', 'consent_revocation'] as const
type RequestType = typeof VALID_REQUEST_TYPES[number]

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    // Verify JWT
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: authError } = await userClient.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: 'Invalid or expired token' }, { status: 401, headers: CORS_HEADERS })
    }

    // Parse and validate body
    const body = await req.json().catch(() => ({}))
    const requestType: string = body?.request_type ?? ''

    if (!VALID_REQUEST_TYPES.includes(requestType as RequestType)) {
      return Response.json({ error: 'Invalid request_type' }, { status: 400, headers: CORS_HEADERS })
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey)

    // Insert deletion request
    const { error: insertError } = await serviceClient.from('deletion_requests').insert({
      user_id: user.id,
      request_type: requestType,
      status: 'pending',
    })

    if (insertError) throw insertError

    // Log activity
    await serviceClient.from('activity_logs').insert({
      user_id: user.id,
      actor_type: 'user',
      actor_id: user.id,
      action: 'deletion_request_submitted',
      entity_type: 'deletion_request',
      metadata: { request_type: requestType },
      ip_address: req.headers.get('CF-Connecting-IP') ?? req.headers.get('X-Forwarded-For'),
    })

    // TODO: Send notification to admin/team when email is configured.

    return Response.json({ success: true }, { headers: CORS_HEADERS })
  } catch (err) {
    console.error('request-account-deletion error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500, headers: CORS_HEADERS })
  }
})
