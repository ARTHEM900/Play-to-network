"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/shared/utils/utils"

interface StickyCTAProps {
  label: string
  onClick: () => void
  visible?: boolean
  className?: string
}

export function StickyCTA({ label, onClick, visible = true, className }: StickyCTAProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className={cn(
            "fixed bottom-16 left-0 right-0 z-40 p-4 pointer-events-none md:hidden",
            className,
          )}
        >
          <div className="pointer-events-auto">
            <Button
              onClick={onClick}
              className="w-full bg-primary text-black font-bold hover:bg-primary/90 h-14 rounded-xl text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(0,230,118,0.3)]"
            >
              {label}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
