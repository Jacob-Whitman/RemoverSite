import { useEffect, useRef, useCallback } from 'react'
import { loadTurnstileScript, TURNSTILE_SITE_KEY } from '../../lib/turnstile'

interface TurnstileWidgetProps {
  onToken: (token: string) => void
  onExpire?: () => void
  onError?: () => void
  siteKey?: string
}

// IMPORTANT: This widget only renders the Turnstile challenge and returns a token.
// The token itself is NOT proof of verification — it must be validated server-side
// via the verify-turnstile Supabase Edge Function before any action is taken.
// Never skip server-side verification.
export function TurnstileWidget({ onToken, onExpire, onError, siteKey }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const key = siteKey ?? TURNSTILE_SITE_KEY

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !window.turnstile || !key) return
    // Remove previous widget if re-rendering
    if (widgetIdRef.current) {
      try { window.turnstile?.remove(widgetIdRef.current) } catch { /* ignore */ }
      widgetIdRef.current = null
    }
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: key,
      callback: onToken,
      'expired-callback': () => {
        onExpire?.()
      },
      'error-callback': () => {
        onError?.()
      },
      theme: 'light',
    })
  }, [key, onToken, onExpire, onError])

  useEffect(() => {
    if (!key) return
    loadTurnstileScript().then(renderWidget).catch(() => {
      onError?.()
    })
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current) } catch { /* ignore */ }
      }
    }
  }, [key, renderWidget, onError])

  if (!key) {
    return (
      <div className="text-xs text-slate-500 italic">
        Security check not configured (VITE_TURNSTILE_SITE_KEY missing).
      </div>
    )
  }

  return <div ref={containerRef} />
}
