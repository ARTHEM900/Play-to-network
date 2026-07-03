"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Calendar, Radio, Shield, User } from "lucide-react"
import { cn } from "@/shared/utils/utils"
import { useMediaQuery } from "@/shared/hooks/useMediaQuery"

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Events", href: "/events", icon: Calendar },
  { label: "Live", href: "/live", icon: Radio },
  { label: "Dashboard", href: "/dashboard", icon: Shield },
  { label: "Profile", href: "/profile", icon: User },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const isMobile = useMediaQuery("(max-width: 768px)")

  if (!isMobile) return null

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50">
      <div className="flex items-center justify-around bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-white/5 pb-safe pt-1.5 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-h-[44px] justify-center relative press-scale",
                isActive
                  ? "text-primary"
                  : "text-white/40 hover:text-white/70",
              )}
              prefetch={true}
            >
              <Icon
                className={cn(
                  "w-5 h-5",
                  isActive && "drop-shadow-[0_0_8px_rgba(0,230,118,0.3)]",
                )}
              />
              <span className="text-[9px] font-bold uppercase tracking-wider">
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
