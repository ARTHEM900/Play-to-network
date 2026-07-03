import { redirect } from 'next/navigation'
import { getUser } from '@/features/auth/queries/get-user'
import { AdminLoginForm } from '@/features/auth/components/admin-login-form'
import { PtnNavbar } from '@/shared/components/ptn-navbar'
import { PtnFooter } from '@/shared/components/ptn-footer'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Welcome Back — Play To Network',
  description: 'Sign in to your Play To Network Account.',
}

/**
 * Shared login page (Server Component) for all players and administrators.
 * Redirects already-authenticated users to their respective dashboards.
 */
export default async function LoginPage() {
  // Server-side auth check — redirect based on role if already signed in.
  const user = await getUser()
  if (user) {
    const supabase = await createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'admin') {
      redirect('/admin')
    } else {
      redirect('/dashboard')
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <PtnNavbar />
      <div className="flex-1 flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-card border border-border p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-bold text-foreground">Welcome Back</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to manage your teams, matches, or view the administrator panel.
            </p>
          </div>

          <AdminLoginForm />
        </div>
      </div>
      <PtnFooter />
    </main>
  )
}
