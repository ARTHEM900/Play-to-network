"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { PtnLogo } from "./ptn-logo"

export function CinematicLoader() {
  const [isMounted, setIsMounted] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    setIsMounted(true)
    
    // Timeline steps for 3.4 seconds max loader duration
    const timers = [
      setTimeout(() => setStep(1), 300),   // 0.3s: PTN Logo fades in
      setTimeout(() => setStep(2), 1000),  // 1.0s: PLAY fades in
      setTimeout(() => setStep(3), 1600),  // 1.6s: COMPETE fades in
      setTimeout(() => setStep(4), 2200),  // 2.2s: BELONG fades in
    ]
    
    return () => timers.forEach(clearTimeout)
  }, [])

  if (!isMounted) return null

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 0, pointerEvents: "none" }}
      transition={{ duration: 0.6, delay: 3.2, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] overflow-hidden select-none"
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-60 blur-3xl"></div>

      <div className="flex flex-col items-center gap-10 relative z-10">
        
        {/* PTN Logo fading in at Step >= 1 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: step >= 1 ? 1 : 0, scale: step >= 1 ? 1 : 0.95 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <PtnLogo className="scale-125 sm:scale-150" />
        </motion.div>

        {/* Tagline sequence: PLAY • COMPETE • BELONG */}
        <div className="flex items-center gap-3 font-heading font-bold text-sm sm:text-base tracking-[0.25em] uppercase">
          {/* PLAY */}
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 5 }}
            transition={{ duration: 0.4 }}
            className="text-white"
          >
            PLAY
          </motion.span>

          {/* Dot 1 */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 3 ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-primary font-black"
          >
            •
          </motion.span>

          {/* COMPETE */}
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : 5 }}
            transition={{ duration: 0.4 }}
            className="text-white"
          >
            COMPETE
          </motion.span>

          {/* Dot 2 */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 4 ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-primary font-black"
          >
            •
          </motion.span>

          {/* BELONG */}
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: step >= 4 ? 1 : 0, y: step >= 4 ? 0 : 5 }}
            transition={{ duration: 0.4 }}
            className="text-white"
          >
            BELONG
          </motion.span>
        </div>

      </div>
    </motion.div>
  )
}
