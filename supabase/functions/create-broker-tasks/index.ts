// Edge Function: create-broker-tasks
// Creates broker_task rows for all active brokers for the authenticated user.
// Only creates tasks for the requesting user unless the caller is an admin.
// Requires a valid user JWT in the Authorization header.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    // Authenticate request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    // Verify the user JWT using the anon client
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: authError } = await userClient.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: 'Invalid or expired token' }, { status: 401, headers: CORS_HEADERS })
    }

    // Parse optional target_user_id (admin-only)
    const body = await req.json().catch(() => ({}))
    let targetUserId: string = user.id

    if (body.target_user_id && body.target_user_id !== user.id) {
      // Only admins can create tasks for other users
      const serviceClient = createClient(supabaseUrl, serviceRoleKey)
      const { data: profile } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (profile?.role !== 'admin') {
        return Response.json({ error: 'Forbidden' }, { status: 403, headers: CORS_HEADERS })
      }
      targetUserId = body.target_user_id
    }

    // Use service role for writes
    const serviceClient = createClient(supabaseUrl, serviceRoleKey)

    // Fetch all active brokers
    const { data: brokers, error: brokerError } = await serviceClient
      .from('brokers')
      .select('id')
      .eq('active', true)

    if (brokerError) throw brokerError

    if (!brokers || brokers.length === 0) {
      return Response.json({ success: true, created: 0, message: 'No active brokers found' }, { headers: CORS_HEADERS })
    }

    // Insert tasks — ignore conflicts (upsert with onConflict ignore)
    const tasks = brokers.map((b: { id: string }) => ({
      user_id: targetUserId,
      broker_id: b.id,
      status: 'not_started',
      match_confidence: 'not_searched',
    }))

    const { error: insertError, count } = await serviceClient
      .from('broker_tasks')
      .upsert(tasks, { onConflict: 'user_id,broker_id', ignoreDuplicates: true })
      .select('id', { count: 'exact', head: true })

    if (insertError) throw insertError

    // Log activity
    await serviceClient.from('activity_logs').insert({
      user_id: targetUserId,
      actor_type: 'edge_function',
      actor_id: null,
      action: 'broker_tasks_created',
      entity_type: 'broker_task',
      metadata: { broker_count: brokers.length, created_count: count ?? 0 },
    })

    return Response.json({ success: true, created: count ?? 0 }, { headers: CORS_HEADERS })
  } catch (err) {
    console.error('create-broker-tasks error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500, headers: CORS_HEADERS })
  }
})
