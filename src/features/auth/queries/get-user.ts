import { createClient } from '@/lib/supabase/server'
import type { User, Session } from '@supabase/supabase-js'

/**
 * Returns the currently authenticated Supabase user (server-side).
 * Uses getUser() — the only secure method per Supabase SSR best practices
 * (getSession() relies on the unverified JWT stored in the cookie).
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Returns true if there is a currently authenticated user.
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser()
  return user !== null
}
