"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ProfileRepository } from "@/lib/repositories/profile.repository"
import { PtnNavbar } from "@/shared/components/ptn-navbar"
import { PtnFooter } from "@/shared/components/ptn-footer"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { User } from "@supabase/supabase-js"

type Profile = {
  id: string
  full_name: string | null
  phone: string | null
  city: string | null
  avatar_url: string | null
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function loadSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login")
        return
      }
      setUser(session.user)
      
      try {
        const profileData = await ProfileRepository.getProfileById(supabase, session.user.id)
        if (profileData) {
          setProfile(profileData)
        }
      } catch (err) {
        setError("Error loading profile.")
      }
      setLoading(false)
    }
    loadSession()
  }, [router, supabase])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error("Profile client signout error:", err)
    }
    router.push("/")
    router.refresh()
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setSaving(true)
    setMessage("")
    setError("")
    
    const updates = {
      id: user.id,
      full_name: profile?.full_name || null,
      phone: profile?.phone || null,
      city: profile?.city || null,
      avatar_url: profile?.avatar_url || null,
      updated_at: new Date().toISOString(),
    }

    try {
      await ProfileRepository.upsertProfile(supabase, updates)
      setMessage("Profile updated successfully.")
    } catch (err: any) {
      setError(err.message || "Failed to update profile.")
    }
    setSaving(false)
  }


  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <PtnNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground animate-pulse">Loading profile...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <PtnNavbar />
      <div className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground">Your Profile</h1>
          <Button variant="outline" onClick={handleSignOut} className="border-border hover:bg-secondary">
            Sign Out
          </Button>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-lg p-6 md:p-8">
          <div className="mb-6 pb-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground mb-1">Account Info</h2>
            <p className="text-sm text-muted-foreground">Logged in as {user?.email}</p>
          </div>

          {error && <div className="mb-6 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded text-sm">{error}</div>}
          {message && <div className="mb-6 p-3 bg-green-900/50 border border-green-500 text-green-200 rounded text-sm">{message}</div>}

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-foreground">Full Name</Label>
                <Input
                  id="full_name"
                  value={profile?.full_name || ""}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value } as Profile)}
                  className="bg-background border-border"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile?.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value } as Profile)}
                  className="bg-background border-border"
                  placeholder="+91 9876543210"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-foreground">City</Label>
                <Input
                  id="city"
                  value={profile?.city || ""}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value } as Profile)}
                  className="bg-background border-border"
                  placeholder="Delhi"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar_url" className="text-foreground">Avatar URL</Label>
                <Input
                  id="avatar_url"
                  value={profile?.avatar_url || ""}
                  onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value } as Profile)}
                  className="bg-background border-border"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <PtnFooter />
    </main>
  )
}
