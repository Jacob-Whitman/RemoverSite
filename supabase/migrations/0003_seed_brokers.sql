-- ============================================================
-- Migration: 0003_seed_brokers.sql
-- Placeholder broker seed data for development and demo purposes.
-- TODO: Replace with verified broker data before production launch.
-- Do NOT use the full BADBOOL list until it has been reviewed and verified.
-- ============================================================

insert into public.brokers (
  name,
  website_url,
  opt_out_url,
  category,
  priority,
  country_region,
  supports_automation,
  automation_method,
  manual_instructions,
  required_fields,
  difficulty_score,
  estimated_days,
  active
)
values
  (
    'People Search Broker A',
    'https://example-broker-a.invalid',
    'https://example-broker-a.invalid/optout',
    'people_search',
    'high',
    'US',
    false,
    'manual',
    -- TODO: Replace with real opt-out instructions for this broker
    'Visit the opt-out URL, search for your record by name and city, and submit the removal form. Confirmation may take up to 14 days.',
    '["first_name","last_name","state"]',
    2,
    14,
    true
  ),
  (
    'Address Lookup Broker B',
    'https://example-broker-b.invalid',
    'https://example-broker-b.invalid/remove',
    'address_lookup',
    'high',
    'US',
    false,
    'manual',
    -- TODO: Replace with real opt-out instructions for this broker
    'Navigate to the removal page, enter your name and city, select your listing, and submit the form. Processing may take up to 30 days.',
    '["first_name","last_name","city","state"]',
    3,
    30,
    true
  ),
  (
    'Public Records Broker C',
    'https://example-broker-c.invalid',
    'https://example-broker-c.invalid/optout',
    'public_records',
    'medium',
    'US',
    false,
    'manual',
    -- TODO: Replace with real opt-out instructions for this broker
    'Search for your record, click the opt-out link on the listing page, and complete the verification step. This broker may require email confirmation.',
    '["first_name","last_name","state","email"]',
    3,
    21,
    true
  ),
  (
    'Marketing Data Broker D',
    'https://example-broker-d.invalid',
    'https://example-broker-d.invalid/privacy',
    'marketing_data',
    'medium',
    'US',
    false,
    'manual',
    -- TODO: Replace with real opt-out instructions for this broker
    'Submit a data subject access request via the privacy page. This broker processes requests under privacy regulations and may take up to 45 days.',
    '["first_name","last_name","email"]',
    4,
    45,
    true
  ),
  (
    'Reverse Phone Broker E',
    'https://example-broker-e.invalid',
    'https://example-broker-e.invalid/remove',
    'reverse_phone',
    'medium',
    'US',
    false,
    'manual',
    -- TODO: Replace with real opt-out instructions for this broker
    'Enter your phone number on the removal page to find your listing, then submit the removal request. Confirmation typically arrives within 7 days.',
    '["first_name","last_name","phone"]',
    2,
    7,
    true
  )
;
