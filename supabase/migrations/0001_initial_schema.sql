-- ============================================================
-- Migration: 0001_initial_schema.sql
-- Creates all application tables.
-- RLS is enabled here; policies are in 0002_rls_policies.sql.
-- ============================================================

-- profiles
-- One row per auth user. Created on first sign-in or after intake.
create table if not exists public.profiles (
  id                          uuid primary key references auth.users(id) on delete cascade,
  email                       text,
  legal_first_name            text,
  legal_middle_name           text,
  legal_last_name             text,
  current_city                text,
  current_state               text,
  aliases                     jsonb not null default '[]',
  year_of_birth               text,
  phone_numbers               jsonb not null default '[]',
  alternate_emails            jsonb not null default '[]',
  current_address             jsonb,
  previous_addresses          jsonb not null default '[]',
  known_relatives             jsonb not null default '[]',
  employer_or_business        text,
  public_facing_professional  boolean not null default false,
  household_removal_interest  boolean not null default false,
  recurring_monitoring_interest boolean not null default false,
  role                        text not null default 'user',
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- consent_records
-- Versioned, timestamped consent entries. Never updated; revocation is a new row.
create table if not exists public.consent_records (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  consent_type          text not null,
  consent_text_version  text not null,
  consent_given         boolean not null,
  ip_address            text,
  user_agent            text,
  created_at            timestamptz not null default now(),
  revoked_at            timestamptz
);

alter table public.consent_records enable row level security;

-- Valid consent types (for documentation; enforced in application layer):
-- process_personal_data
-- submit_opt_out_requests
-- contact_brokers_on_user_behalf
-- store_evidence
-- recurring_monitoring
-- terms_of_service
-- privacy_policy

-- brokers
-- Master list of data broker sites. Managed by admins.
create table if not exists public.brokers (
  id                         uuid primary key default gen_random_uuid(),
  name                       text not null,
  website_url                text,
  opt_out_url                text,
  category                   text,
  priority                   text not null default 'medium',
  country_region             text not null default 'US',
  source_reference           text,
  requires_email_verification boolean not null default false,
  requires_phone_verification boolean not null default false,
  requires_id_verification   boolean not null default false,
  requires_payment           boolean not null default false,
  supports_automation        boolean not null default false,
  automation_method          text not null default 'manual',
  manual_instructions        text,
  required_fields            jsonb not null default '[]',
  difficulty_score           int not null default 3,
  estimated_days             int,
  active                     boolean not null default false,
  last_verified_at           timestamptz,
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now()
);

alter table public.brokers enable row level security;

-- broker_tasks
-- One row per (user, broker) pair. Tracks removal status per broker.
create table if not exists public.broker_tasks (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users(id) on delete cascade,
  broker_id              uuid not null references public.brokers(id) on delete cascade,
  status                 text not null default 'not_started',
  match_confidence       text not null default 'not_searched',
  found_record_url       text,   -- internal only; not shown in public-facing UI
  exposed_fields_summary jsonb not null default '{}',
  submitted_at           timestamptz,
  last_checked_at        timestamptz,
  removed_at             timestamptz,
  reappeared_at          timestamptz,
  failure_reason         text,
  requires_user_action   boolean not null default false,
  user_action_type       text,
  assigned_admin_id      uuid,
  notes                  text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  unique(user_id, broker_id)
);

alter table public.broker_tasks enable row level security;

-- reports
-- Monthly proof reports aggregated per user.
create table if not exists public.reports (
  id                          uuid primary key default gen_random_uuid(),
  user_id                     uuid not null references auth.users(id) on delete cascade,
  report_month                date not null,
  brokers_checked             int not null default 0,
  records_found               int not null default 0,
  removals_submitted          int not null default 0,
  confirmed_removed           int not null default 0,
  pending_count               int not null default 0,
  user_action_required_count  int not null default 0,
  reappeared_count            int not null default 0,
  report_data                 jsonb not null default '{}',
  created_at                  timestamptz not null default now()
);

alter table public.reports enable row level security;

-- deletion_requests
-- User-initiated account or data deletion requests.
create table if not exists public.deletion_requests (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  request_type  text not null,
  status        text not null default 'pending',
  requested_at  timestamptz not null default now(),
  completed_at  timestamptz,
  notes         text
);

alter table public.deletion_requests enable row level security;

-- activity_logs
-- Append-only audit log. Written by Edge Functions using service role.
create table if not exists public.activity_logs (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid,  -- nullable; some actions may be system-level
  actor_type   text not null,  -- 'user' | 'admin' | 'system' | 'edge_function'
  actor_id     uuid,
  action       text not null,
  entity_type  text,
  entity_id    uuid,
  metadata     jsonb not null default '{}',
  ip_address   text,
  created_at   timestamptz not null default now()
);

alter table public.activity_logs enable row level security;

-- Indexes for common query patterns
create index if not exists idx_broker_tasks_user_id on public.broker_tasks(user_id);
create index if not exists idx_broker_tasks_broker_id on public.broker_tasks(broker_id);
create index if not exists idx_consent_records_user_id on public.consent_records(user_id);
create index if not exists idx_reports_user_id on public.reports(user_id);
create index if not exists idx_deletion_requests_user_id on public.deletion_requests(user_id);
create index if not exists idx_activity_logs_user_id on public.activity_logs(user_id);
create index if not exists idx_activity_logs_created_at on public.activity_logs(created_at desc);
