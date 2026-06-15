import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'
import { AuthContext } from '../lib/authContext'
import type { Profile } from '../types/database'
import { AppRouter } from './router'

export function App() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [hasConsent, setHasConsent] = useState(false)
  const [recoveryMode, setRecoveryMode] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      if (data.session?.user) {
        loadUserData(data.session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (event === 'PASSWORD_RECOVERY') {
        // User landed via a password reset email link.
        // Signal the router to redirect to /reset-password.
        setRecoveryMode(true)
        setLoading(false)
        return
      }
      setRecoveryMode(false)
      if (u) {
        loadUserData(u.id)
      } else {
        setProfile(null)
        setHasConsent(false)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadUserData(userId: string) {
    try {
      const [profileResult, consentResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase
          .from('consent_records')
          .select('id')
          .eq('user_id', userId)
          .eq('consent_type', 'submit_opt_out_requests')
          .eq('consent_given', true)
          .is('revoked_at', null)
          .limit(1)
          .maybeSingle(),
      ])
      setProfile(profileResult.data as Profile | null)
      setHasConsent(!!consentResult.data)
    } catch {
      setProfile(null)
      setHasConsent(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, hasConsent, recoveryMode, loading, refreshProfile: () => loadUserData(user?.id ?? '') }}>
      <AppRouter />
    </AuthContext.Provider>
  )
}
