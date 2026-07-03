'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * Authenticates an admin user with email + password credentials.
 * Returns an error string on failure; redirects to /ptn-admin on success.
 */
export async function loginWithPassword(
  email: string,
  password: string
): Promise<{ error: string } | never> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  const { data: authUser } = await supabase.auth.getUser()
  if (authUser?.user) {
    const userId = authUser.user.id

    // Check if profile exists
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    let role = profileData?.role

    if (!profileData) {
      const userEmail = authUser.user.email || ''
      role = (userEmail.startsWith('admin') || userEmail.includes('admin@') || userEmail === 'play2network@gmail.com') ? 'admin' : 'player'
      await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: authUser.user.user_metadata?.full_name || authUser.user.user_metadata?.name || null,
          role
        })
    }

    if (role === 'admin') {
      redirect('/admin')
    } else {
      redirect('/dashboard')
    }
  }

  redirect('/dashboard')
}

/**
 * Server-side logout.
 * Clears the session and redirects to the homepage.
 * The middleware will handle cookie cleanup on the next request.
 */
export async function logout(): Promise<never> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
