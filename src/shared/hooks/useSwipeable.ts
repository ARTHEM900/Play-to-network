"use client"

import { useRef, useCallback } from "react"

interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
}

export function useSwipeable({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
}: SwipeHandlers) {
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const touchEndX = useRef(0)
  const ref = useRef<HTMLDivElement>(null)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      touchEndX.current = e.changedTouches[0].clientX
      const diffX = touchEndX.current - touchStartX.current
      const diffY = e.changedTouches[0].clientY - touchStartY.current

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
        if (diffX > 0 && onSwipeRight) {
          onSwipeRight()
        } else if (diffX < 0 && onSwipeLeft) {
          onSwipeLeft()
        }
      }
    },
    [onSwipeLeft, onSwipeRight, threshold],
  )

  return {
    ref,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  } as const
}
