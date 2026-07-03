'use client'

import { useState } from 'react'
import { loginWithPassword } from '@/features/auth/actions/auth.actions'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { createClient } from '@/lib/supabase/client'

/**
 * Upgraded auth form supporting both Google OAuth and Email/Password credentials.
 */
export function AdminLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await loginWithPassword(email, password)

    // If loginWithPassword redirects, this code is never reached on success.
    if (result?.error) {
      setError(result.error)
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (oauthError) {
        throw oauthError
      }
    } catch (err: any) {
      console.error("Google OAuth initialization failure:", err)
      
      // Check if it's a configuration issue in Supabase Auth
      const errMsg = err.message || String(err)
      if (
        errMsg.toLowerCase().includes("not enabled") || 
        errMsg.toLowerCase().includes("not configured") || 
        errMsg.toLowerCase().includes("invalid provider")
      ) {
        setError(
          "Google OAuth is not enabled/configured in your Supabase project. " +
          "Please verify that Google login is enabled under Authentication > Providers in your Supabase dashboard, " +
          "and that Client ID/Secret are properly filled."
        )
      } else {
        setError(
          "development warning: Google login initialization failed. " +
          "This typically means Supabase Google OAuth provider is not configured. " +
          "Details: " + errMsg
        )
      }
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-900/40 border border-red-500/35 text-red-200 rounded-xl text-xs text-center leading-relaxed">
          {error}
        </div>
      )}

      {/* Continue with Google button */}
      <Button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/90 text-black font-bold h-11 rounded-lg border-0 transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span>Continue with Google</span>
      </Button>

      {/* Divider */}
      <div className="flex items-center justify-center">
        <span className="text-white/20 text-xxs font-bold tracking-widest uppercase">
          ──────── OR ────────
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="admin-email" className="text-foreground text-xs font-bold uppercase tracking-wider text-white/50">
            Email address
          </Label>
          <Input
            id="admin-email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="bg-black/40 border-white/10 text-foreground h-11 rounded-lg placeholder:text-white/25 focus:border-primary/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-password" className="text-foreground text-xs font-bold uppercase tracking-wider text-white/50">
            Password
          </Label>
          <Input
            id="admin-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="bg-black/40 border-white/10 text-foreground h-11 rounded-lg placeholder:text-white/25 focus:border-primary/50"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-primary text-black hover:bg-primary/95 font-bold h-11 rounded-lg transition-colors cursor-pointer"
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>

      {/* Create Account / Forgot Password links */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4 text-xs">
        <a href="/register" className="text-white/50 hover:text-primary font-semibold transition-colors">
          Create Account
        </a>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault()
            alert("To reset your password, please contact our support team at support@ptn.gg.")
          }} 
          className="text-white/50 hover:text-primary font-semibold transition-colors"
        >
          Forgot Password?
        </a>
      </div>
    </div>
  )
}
