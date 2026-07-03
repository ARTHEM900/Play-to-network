"use client"

import { useState, useEffect, useCallback } from "react"
import { Menu, X, LogOut } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { PtnLogo } from "./ptn-logo"
import Link from "next/link"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const NAV_LINKS = [
  { label: "Events", href: "/events" },
  { label: "Live", href: "#live" },
  { label: "Standings", href: "#standings" },
  { label: "Teams", href: "#teams" },
  { label: "Organizers", href: "#organizers" },
]

export function PtnNavbar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    const checkUser = async () => {
      setAuthLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setIsLoggedIn(true)
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single()

          if (profile?.role === "admin") {
            setIsAdmin(true)
          }
        } catch (err) {
          console.error("Error checking role in navbar:", err)
        }
      }
      setAuthLoading(false)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: any) => {
        if (session?.user) {
          setIsLoggedIn(true)
          supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single()
            .then(({ data: profile }: { data: { role: string } | null }) => {
              setIsAdmin(profile?.role === "admin")
            })
            .catch(() => setIsAdmin(false))
        } else {
          setIsLoggedIn(false)
          setIsAdmin(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = useCallback(async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch (err) {
      console.error("Navbar signout error:", err)
    }
    router.push("/")
    router.refresh()
  }, [router])

  const computedLinks = [
    ...NAV_LINKS,
    ...(isAdmin ? [{ label: "Admin Panel", href: "/admin" }] : []),
  ]

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 3.0, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-white/5 bg-[#050505]/90 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="Play To Network home">
          <PtnLogo />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {computedLinks.map((link) => (
            <li key={link.label} className="relative py-5">
              <a
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-white ${link.label === "Events" ? "text-white" : "text-white/70"}`}
              >
                {link.label}
              </a>
              {link.label === "Events" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-sm"></div>
              )}
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-6 md:flex">
          {authLoading ? (
            <div className="h-8 w-24 bg-white/5 rounded animate-pulse" />
          ) : isLoggedIn ? (
            <>
              <Link href={isAdmin ? "/admin" : "/dashboard"}>
                <button className="text-sm font-bold text-white hover:text-white/80 transition-colors">
                  Dashboard
                </button>
              </Link>
              <Button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 rounded-md flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="text-sm font-bold text-white hover:text-white/80 transition-colors">
                  Log In
                </button>
              </Link>
              <Link href="/login">
                <Button className="bg-primary text-black font-bold hover:bg-primary/90 px-6 rounded-md">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-1 px-4 py-4">
            {computedLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-2 flex flex-col gap-2">
              {authLoading ? (
                <div className="h-10 w-full bg-white/5 rounded animate-pulse" />
              ) : isLoggedIn ? (
                <>
                  <Link href={isAdmin ? "/admin" : "/dashboard"} onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full border-border bg-transparent">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      setOpen(false)
                      handleLogout()
                    }}
                    className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-bold"
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full border-border bg-transparent">
                      Login
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </motion.header>
  )
}