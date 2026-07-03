"use client"

import { useState, useEffect } from "react"

export function LiveMatchBanner() {
  const [minute, setMinute] = useState(65)

  useEffect(() => {
    const id = setInterval(() => {
      setMinute((m) => (m >= 90 ? 90 : m + 1))
    }, 8000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full bg-destructive/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-destructive">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
          </span>
          Live
        </span>
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Premier Cup · Group A
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 font-heading text-sm font-bold text-primary">
            FT
          </span>
          <span className="font-heading text-base font-semibold text-foreground">
            FC Titans
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-heading text-3xl font-bold tabular-nums text-foreground">
            2
          </span>
          <span className="text-muted-foreground">-</span>
          <span className="font-heading text-3xl font-bold tabular-nums text-foreground">
            1
          </span>
        </div>
        <div className="flex flex-1 items-center justify-end gap-3">
          <span className="font-heading text-base font-semibold text-foreground">
            Delhi Warriors
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary font-heading text-sm font-bold text-foreground">
            DW
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 border-t border-border pt-3">
        <span className="font-heading text-sm font-bold text-primary tabular-nums">
          {minute}&apos;
        </span>
        <span className="text-xs text-muted-foreground">2nd Half</span>
      </div>
    </div>
  )
}
