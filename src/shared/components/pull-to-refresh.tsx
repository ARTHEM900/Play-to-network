"use client"

import { usePullToRefresh } from "@/shared/hooks/usePullToRefresh"
import { Loader2 } from "lucide-react"

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const { pullDistance, isRefreshing, containerRef, pullDistanceStyle } =
    usePullToRefresh({ onRefresh })

  return (
    <div ref={containerRef} className="relative">
      {pullDistance > 0 && (
        <div
          className="absolute left-0 right-0 flex items-center justify-center pointer-events-none z-10"
          style={{ top: `${Math.max(pullDistance - 60, 0)}px` }}
        >
          {isRefreshing ? (
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          ) : (
            <div
              className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full"
              style={{
                transform: `rotate(${pullDistance * 3}deg)`,
                opacity: Math.min(pullDistance / 80, 1),
              }}
            />
          )}
        </div>
      )}

      <div style={pullDistanceStyle as React.CSSProperties}>{children}</div>
    </div>
  )
}
