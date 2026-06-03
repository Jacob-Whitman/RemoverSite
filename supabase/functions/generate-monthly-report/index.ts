// Edge Function: generate-monthly-report
// Aggregates broker task counts for a user and inserts a report row.
// Intended to be invoked by an admin or a scheduled cron trigger.
// TODO: Wire to Supabase scheduled function or external cron when ready.

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
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    // Verify JWT and check admin role
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS })
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey)

    // Admin check
    const { data: profile } = await serviceClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (profile?.role !== 'admin') {
      return Response.json({ error: 'Forbidden — admin only' }, { status: 403, headers: CORS_HEADERS })
    }

    // Parse request body
    const body = await req.json().catch(() => ({}))
    const targetUserId: string | undefined = body?.user_id

    if (!targetUserId) {
      return Response.json({ error: 'user_id is required' }, { status: 400, headers: CORS_HEADERS })
    }

    // Report month: defaults to the current calendar month
    const reportMonth: string = body?.report_month ?? new Date().toISOString().slice(0, 7) + '-01'

    // Aggregate broker task counts for the target user
    const { data: tasks, error: tasksError } = await serviceClient
      .from('broker_tasks')
      .select('status')
      .eq('user_id', targetUserId)

    if (tasksError) throw tasksError

    const counts = {
      brokers_checked: tasks?.filter(t => t.status !== 'not_started').length ?? 0,
      records_found: tasks?.filter(t =>
        ['record_found','submitted','waiting_broker_response','removed','reappeared','waiting_user_action'].includes(t.status)
      ).length ?? 0,
      removals_submitted: tasks?.filter(t =>
        ['submitted','waiting_broker_response'].includes(t.status)
      ).length ?? 0,
      confirmed_removed: tasks?.filter(t => t.status === 'removed').length ?? 0,
      pending_count: tasks?.filter(t =>
        ['submitted','waiting_broker_response'].includes(t.status)
      ).length ?? 0,
      user_action_required_count: tasks?.filter(t => t.status === 'waiting_user_action').length ?? 0,
      reappeared_count: tasks?.filter(t => t.status === 'reappeared').length ?? 0,
    }

    // Insert report — upsert on (user_id, report_month) if you add a unique constraint later
    const { error: reportError } = await serviceClient.from('reports').insert({
      user_id: targetUserId,
      report_month: reportMonth,
      ...counts,
      report_data: { tasks_snapshot: tasks },
    })

    if (reportError) throw reportError

    // Log activity
    await serviceClient.from('activity_logs').insert({
      user_id: targetUserId,
      actor_type: 'admin',
      actor_id: user.id,
      action: 'monthly_report_generated',
      entity_type: 'report',
      metadata: { report_month: reportMonth, ...counts },
    })

    return Response.json({ success: true, report_month: reportMonth, ...counts }, { headers: CORS_HEADERS })
  } catch (err) {
    console.error('generate-monthly-report error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500, headers: CORS_HEADERS })
  }
})
