"use client"

import { useMediaQuery } from "@/shared/hooks/useMediaQuery"
import { PageTransition } from "./page-transition"
import { MobileBottomNav } from "./mobile-bottom-nav"

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <>
      <div
        className="flex min-h-screen flex-col"
        style={
          isMobile
            ? { paddingBottom: "calc(72px + env(safe-area-inset-bottom, 16px))" }
            : undefined
        }
      >
        <PageTransition>{children}</PageTransition>
      </div>
      <MobileBottomNav />
    </>
  )
}
