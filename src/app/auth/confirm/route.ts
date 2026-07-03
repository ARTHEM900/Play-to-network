import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/profile'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // redirect user to specified redirect URL or root of app
      request.nextUrl.pathname = next
      request.nextUrl.searchParams.delete('token_hash')
      request.nextUrl.searchParams.delete('type')
      return NextResponse.redirect(request.nextUrl)
    }
  }

  // redirect the user to an error page with some instructions
  request.nextUrl.pathname = '/login'
  request.nextUrl.searchParams.set('error', 'Auth token is invalid or expired')
  return NextResponse.redirect(request.nextUrl)
}
