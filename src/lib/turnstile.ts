// Turnstile frontend helpers.
// The SECRET key is NEVER used here — only the public site key.
// Server-side verification happens in the verify-turnstile Edge Function.

export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: TurnstileOptions) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

export interface TurnstileOptions {
  sitekey: string
  callback: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: () => void
  theme?: 'light' | 'dark' | 'auto'
}

let scriptLoaded = false

export function loadTurnstileScript(): Promise<void> {
  if (scriptLoaded || typeof window === 'undefined') return Promise.resolve()
  if (document.querySelector('script[data-turnstile]')) {
    scriptLoaded = true
    return Promise.resolve()
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.setAttribute('data-turnstile', '1')
    script.onload = () => { scriptLoaded = true; resolve() }
    script.onerror = reject
    document.head.appendChild(script)
  })
}
