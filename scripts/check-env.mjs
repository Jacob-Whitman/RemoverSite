#!/usr/bin/env node
// Run with: node scripts/check-env.mjs
// Checks that required frontend environment variables are present.
// Does NOT check for secret values — that's intentional.

const required = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
]

const optional = [
  'VITE_TURNSTILE_SITE_KEY',
  'VITE_APP_ENV',
  'VITE_BASE_PATH',
]

const never = [
  'VITE_SUPABASE_SERVICE_ROLE_KEY',
  'VITE_CLOUDFLARE_TURNSTILE_SECRET_KEY',
  'CLOUDFLARE_TURNSTILE_SECRET_KEY',
]

let ok = true

for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ Missing required env var: ${key}`)
    ok = false
  } else {
    console.log(`✓ ${key}`)
  }
}

for (const key of optional) {
  if (!process.env[key]) {
    console.warn(`⚠  Optional env var not set: ${key}`)
  } else {
    console.log(`✓ ${key}`)
  }
}

for (const key of never) {
  if (process.env[key]) {
    console.error(`🚨 SECURITY: ${key} must NEVER be set in the frontend environment! Remove it immediately.`)
    ok = false
  }
}

if (!ok) {
  process.exit(1)
}

console.log('\nEnvironment check passed.')
