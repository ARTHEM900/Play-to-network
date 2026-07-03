"use client"

import { Button } from "@/shared/components/ui/button"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

const liveViewport = { once: true, margin: "-50px" }
const liveContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}
const liveCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}
const liveCardWhileHover = { scale: 1.02 }

export function LiveEvents() {
  const [liveMatches, setLiveMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    const fetchLive = async () => {
      try {
        const { data, error } = await supabase
          .from('matches')
          .select('*, tournaments(name)')
          .eq('status', 'Live')
        
        if (data) {
          setLiveMatches(data.map((m: any) => ({
            id: m.id,
            sport: m.sport || "Football",
            tournament: m.tournaments?.name || m.tournament_name || "Play To Network Tournament",
            team1: m.team1_name || "TBD",
            team2: m.team2_name || "TBD",
            score1: m.team1_score ?? 0,
            score2: m.team2_score ?? 0,
            time: m.match_time || "Live",
            stream: false
          })))
        }
      } catch (err) {
        console.error("Failed to load live matches:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchLive()
  }, [])

  return (
    <section id="live" className="py-24 bg-background relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight uppercase flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              Live Events
            </h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">Track ongoing matches with real-time updates.</p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-white/40 text-sm font-medium animate-pulse">
            Loading live updates...
          </div>
        ) : liveMatches.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-white/5 bg-card rounded-xl text-white/45 text-sm font-semibold uppercase tracking-wider">
            No live matches currently.
          </div>
        ) : (
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={liveViewport}
            variants={liveContainerVariants}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {liveMatches.map((match) => (
              <motion.div 
                key={match.id} 
                variants={liveCardVariants}
                whileHover={liveCardWhileHover}
                className="group relative overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40 shadow-sm"
              >
                <div className="border-b border-border bg-secondary/40 px-4 py-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{match.tournament}</span>
                  {match.stream && (
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">
                      Stream
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <span>{match.sport}</span>
                    <span className="text-primary">{match.time}</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground text-lg">{match.team1}</span>
                      <span className="font-heading text-2xl font-bold text-foreground">{match.score1}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground text-lg">{match.team2}</span>
                      <span className="font-heading text-2xl font-bold text-foreground">{match.score2}</span>
                    </div>
                  </div>
                </div>
                
                {/* Premium Spotlight Hover Glow */}
                <div className="absolute inset-0 z-[-1] bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
