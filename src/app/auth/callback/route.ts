import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ProfileRepository } from '@/lib/repositories/profile.repository'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Automatically create user profile if it does not exist
        let profile = null
        try {
          profile = await ProfileRepository.getProfileById(supabase, user.id)
          if (!profile) {
            const email = user.email || ''
            const role = (email.startsWith('admin') || email.includes('admin@') || email === 'play2network@gmail.com') ? 'admin' : 'player'
            
            profile = await ProfileRepository.upsertProfile(supabase, {
              id: user.id,
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
              phone: user.phone || null,
              city: null,
              avatar_url: user.user_metadata?.avatar_url || null,
              role
            })
          }
        } catch (profileErr) {
          console.error('Failed to retrieve or create profile:', profileErr)
        }

        // Check for explicit redirect target (passed by signInWithOAuth redirectTo)
        const next = searchParams.get('next')
        if (next) {
          return NextResponse.redirect(`${origin}${next}`)
        }

        // Default redirect based on role
        const targetRoute = profile?.role === 'admin' ? '/admin' : '/dashboard'
        return NextResponse.redirect(`${origin}${targetRoute}`)
      }
    }
  }

  // Return the user to login page on authentication failure
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
}
