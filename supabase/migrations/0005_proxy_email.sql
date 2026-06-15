-- Migration: 0005_proxy_email.sql
-- Adds proxy_email column to broker_tasks.
-- Stores the per-task inbound address (task-{id}@removals.yourdomain.com) used
-- when submitting opt-outs to brokers that require email verification.
-- The Cloudflare Email Worker parses the task UUID back out of the local-part
-- and updates this row automatically when the verification email arrives.

alter table public.broker_tasks
  add column if not exists proxy_email text;

comment on column public.broker_tasks.proxy_email is
  'Proxy inbound address assigned when opt-out was submitted. '
  'Format: task-{id}@removals.yourdomain.com. Null when broker does not require email verification or PROXY_EMAIL_DOMAIN is not configured.';
