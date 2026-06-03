import { createContext, useContext } from 'react'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '../types/database'

export interface AuthContextValue {
  user: User | null
  profile: Profile | null
  loading: boolean
}

export const AuthContext = createContext<AuthContextValue>({ user: null, profile: null, loading: true })

export function useAuth() {
  return useContext(AuthContext)
}
