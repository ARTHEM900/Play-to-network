"use client"

import { motion } from "framer-motion"
import { ArrowRight, Radio } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function LiveTicker() {
  const [liveMatches, setLiveMatches] = useState<any[]>([])

  useEffect(() => {
    const abortController = new AbortController()
    const supabase = createClient()
    const fetchLive = async () => {
      if (abortController.signal.aborted) return
      try {
        const { data } = await supabase
          .from('matches')
          .select('*, tournaments(name)')
          .eq('status', 'Live')
        if (!abortController.signal.aborted && data) {
          setLiveMatches(data)
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.error("Failed to load live matches for ticker:", err)
        }
      }
    }
    fetchLive()
    const interval = setInterval(fetchLive, 30000)
    return () => {
      abortController.abort()
      clearInterval(interval)
    }
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 3.5 }}
      className="fixed bottom-0 inset-x-0 z-50 w-full bg-[#0A0A0A] border-t border-white/5 overflow-hidden h-12 flex items-center px-4 sm:px-6 lg:px-8"
    >
      <div className="flex items-center justify-between w-full max-w-[1400px] mx-auto text-xs font-medium">
        
        {/* Left Side: LIVE NOW Indicator */}
        <div className="flex items-center gap-2 text-primary pr-8 border-r border-white/10 h-full">
          <Radio className="w-4 h-4 animate-pulse" />
          <span className="font-bold tracking-widest uppercase text-primary">Live Now</span>
        </div>

        {/* Center: Matches */}
        <div className="flex-1 flex items-center justify-start pl-8 gap-12 overflow-hidden whitespace-nowrap">
          {liveMatches.length === 0 ? (
            <span className="text-white/45 text-xxs font-bold uppercase tracking-wider">No live matches currently.</span>
          ) : (
            liveMatches.map((m: any) => (
              <div key={m.id} className="flex items-center gap-4">
                <span className="text-white/60">{m.tournaments?.name || m.tournament_name || "Football Cup"}</span>
                <span className="text-white">{m.team1_name} <span className="font-bold mx-1">{m.team1_score ?? 0}-{m.team2_score ?? 0}</span> {m.team2_name}</span>
                <span className="text-primary">{m.match_time || "Live"}</span>
              </div>
            ))
          )}
        </div>

      </div>
    </motion.div>
  )
}
