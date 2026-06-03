-- ============================================================
-- Migration: 0002_rls_policies.sql
-- Row Level Security policies for all application tables.
-- IMPORTANT: RLS is the primary data access boundary.
-- Frontend authorization checks are UI-only and do not replace RLS.
-- ============================================================

-- Helper: check if the current user is an admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
    and role = 'admin'
  );
$$;

-- ============================================================
-- profiles
-- ============================================================

-- Users: read own profile
create policy "profiles: users read own"
  on public.profiles for select
  using (auth.uid() = id);

-- Users: insert own profile
create policy "profiles: users insert own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Users: update own profile
create policy "profiles: users update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins: read all profiles
create policy "profiles: admins read all"
  on public.profiles for select
  using (public.is_admin());

-- Admins: update any profile (e.g. role changes)
create policy "profiles: admins update any"
  on public.profiles for update
  using (public.is_admin());

-- ============================================================
-- consent_records
-- ============================================================

-- Users: insert own consent records
create policy "consent_records: users insert own"
  on public.consent_records for insert
  with check (auth.uid() = user_id);

-- Users: read own consent records
create policy "consent_records: users read own"
  on public.consent_records for select
  using (auth.uid() = user_id);

-- Users cannot update consent records directly (revocation is a new record)
-- Admins: read all consent records for audit purposes
create policy "consent_records: admins read all"
  on public.consent_records for select
  using (public.is_admin());

-- ============================================================
-- brokers
-- ============================================================

-- Authenticated users: read active brokers only
create policy "brokers: authenticated users read active"
  on public.brokers for select
  to authenticated
  using (active = true);

-- Admins: full access
create policy "brokers: admins read all"
  on public.brokers for select
  using (public.is_admin());

create policy "brokers: admins insert"
  on public.brokers for insert
  with check (public.is_admin());

create policy "brokers: admins update"
  on public.brokers for update
  using (public.is_admin());

-- ============================================================
-- broker_tasks
-- ============================================================

-- Users: read own tasks
create policy "broker_tasks: users read own"
  on public.broker_tasks for select
  using (auth.uid() = user_id);

-- Users cannot directly insert/update broker_tasks.
-- Task creation is done by create-broker-tasks Edge Function (service role).
-- Admins: full access
create policy "broker_tasks: admins read all"
  on public.broker_tasks for select
  using (public.is_admin());

create policy "broker_tasks: admins insert"
  on public.broker_tasks for insert
  with check (public.is_admin());

create policy "broker_tasks: admins update"
  on public.broker_tasks for update
  using (public.is_admin());

-- ============================================================
-- reports
-- ============================================================

-- Users: read own reports
create policy "reports: users read own"
  on public.reports for select
  using (auth.uid() = user_id);

-- Admins: full access
create policy "reports: admins read all"
  on public.reports for select
  using (public.is_admin());

create policy "reports: admins insert"
  on public.reports for insert
  with check (public.is_admin());

-- ============================================================
-- deletion_requests
-- ============================================================

-- Users: insert own deletion requests
create policy "deletion_requests: users insert own"
  on public.deletion_requests for insert
  with check (auth.uid() = user_id);

-- Users: read own deletion requests
create policy "deletion_requests: users read own"
  on public.deletion_requests for select
  using (auth.uid() = user_id);

-- Admins: full access
create policy "deletion_requests: admins read all"
  on public.deletion_requests for select
  using (public.is_admin());

create policy "deletion_requests: admins update"
  on public.deletion_requests for update
  using (public.is_admin());

-- ============================================================
-- activity_logs
-- ============================================================

-- Users generally cannot write activity logs directly.
-- Edge Functions write logs using the service role key.
-- Users can read their own user-visible log entries if needed.
create policy "activity_logs: users read own"
  on public.activity_logs for select
  using (auth.uid() = user_id);

-- Admins: read all logs
create policy "activity_logs: admins read all"
  on public.activity_logs for select
  using (public.is_admin());

-- Note: INSERT policy for activity_logs is intentionally absent for normal roles.
-- Use service role in Edge Functions to insert log entries.
