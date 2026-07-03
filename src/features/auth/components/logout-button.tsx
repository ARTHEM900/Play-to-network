'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

interface LogoutButtonProps {
  className?: string
  iconOnly?: boolean
}

export function LogoutButton({ className, iconOnly = false }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      // Clear all cookies manually to ensure complete session cleanup
      document.cookie.split(';').forEach(c => {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`)
      })
    } catch (err) {
      console.error("Admin client signout error:", err)
    }
    router.push('/')
    router.refresh()
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={loading}
      title="Sign out of admin panel"
      className={
        className ??
        'border-white/10 hover:border-red-500/40 text-white/70 hover:text-red-400 transition-all duration-300 gap-2 h-10 px-4 bg-[#0B0B0B]/45 rounded-lg'
      }
    >
      <LogOut className="size-4" />
      {!iconOnly && <span>{loading ? 'Signing out…' : 'Sign Out'}</span>}
    </Button>
  )
}