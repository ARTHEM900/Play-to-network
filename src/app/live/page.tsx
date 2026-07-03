"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Radio, Calendar, MapPin, Trophy, Clock, ArrowRight } from "lucide-react"
import { PtnNavbar } from "@/shared/components/ptn-navbar"
import { PtnFooter } from "@/shared/components/ptn-footer"
import { createClient } from "@/lib/supabase/client"
import { MatchRepository } from "@/lib/repositories/match.repository"

export default function PublicLivePage() {
  const [liveMatches, setLiveMatches] = useState<any[]>([])
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([])
  const [completedMatches, setCompletedMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    const fetchMatches = async () => {
      try {
        const [live, upcoming, completed] = await Promise.all([
          MatchRepository.getLiveMatches(supabase),
          MatchRepository.getUpcomingMatches(supabase),
          MatchRepository.getCompletedMatches(supabase)
        ])
        setLiveMatches(live || [])
        setUpcomingMatches(upcoming || [])
        setCompletedMatches(completed || [])
        setError(false)
      } catch (err) {
        console.error("Failed to fetch matches in Live Center:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
    const interval = setInterval(fetchMatches, 15000)
    return () => clearInterval(interval)
  }, [])

  const allEmpty = liveMatches.length === 0 && upcomingMatches.length === 0 && completedMatches.length === 0

  const getInitials = (name: string) => {
    return name
      ? name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
      : "TBD"
  }

  return (
    <main className="min-h-screen bg-[#050505] text-foreground selection:bg-primary/30 pb-20 relative">
      <PtnNavbar />

      <div className="pt-28 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-primary font-bold">Live Match Center</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/50 bg-clip-text text-transparent">
              Real-Time Match Tracker
            </h1>
            <p className="text-sm text-white/50 mt-1">
              Follow live games, track upcoming fixtures, and review completed results on Play To Network. Refreshes every 15s.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-white/40 text-sm font-medium animate-pulse">
            Loading match schedules...
          </div>
        ) : error ? (
          <div className="py-20 text-center text-red-500/80 text-sm font-medium">
            Failed to connect to Live Score Center. Please refresh.
          </div>
        ) : allEmpty ? (
          <div className="py-24 text-center border border-dashed border-white/5 bg-[#0B0B0B]/40 rounded-2xl text-white/45 text-sm font-semibold uppercase tracking-wider max-w-md mx-auto">
            No live matches currently.
          </div>
        ) : (
          <div className="space-y-16">
            {/* Live Matches Section */}
            <div>
              <h2 className="text-sm font-bold tracking-widest text-white uppercase mb-6 flex items-center gap-2.5">
                <Radio className="size-4 text-primary animate-pulse" />
                <span>Live Matches</span>
                {liveMatches.length > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-black ml-1.5 animate-pulse">
                    {liveMatches.length} ACTIVE
                  </span>
                )}
              </h2>

              {liveMatches.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-white/5 bg-[#0B0B0B]/20 rounded-xl text-white/40 text-xs font-semibold uppercase tracking-widest">
                  No live matches currently.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveMatches.map((m) => (
                    <MatchCard key={m.id} match={m} getInitials={getInitials} isLive />
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Matches Section */}
            <div>
              <h2 className="text-sm font-bold tracking-widest text-white/70 uppercase mb-6 flex items-center gap-2.5">
                <Calendar className="size-4 text-white/40" />
                <span>Upcoming Matches</span>
              </h2>

              {upcomingMatches.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-white/5 bg-[#0B0B0B]/20 rounded-xl text-white/40 text-xs font-semibold uppercase tracking-widest">
                  No upcoming matches scheduled.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingMatches.map((m) => (
                    <MatchCard key={m.id} match={m} getInitials={getInitials} />
                  ))}
                </div>
              )}
            </div>

            {/* Completed Matches Section */}
            <div>
              <h2 className="text-sm font-bold tracking-widest text-white/70 uppercase mb-6 flex items-center gap-2.5">
                <Trophy className="size-4 text-white/40" />
                <span>Completed Matches</span>
              </h2>

              {completedMatches.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-white/5 bg-[#0B0B0B]/20 rounded-xl text-white/40 text-xs font-semibold uppercase tracking-widest">
                  No completed matches on record.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedMatches.map((m) => (
                    <MatchCard key={m.id} match={m} getInitials={getInitials} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-24">
        <PtnFooter />
      </div>
    </main>
  )
}

function MatchCard({ match, getInitials, isLive = false }: { match: any; getInitials: any; isLive?: boolean }) {
  const team1Name = match.team1?.team_name || "TBD"
  const team2Name = match.team2?.team_name || "TBD"

  return (
    <motion.div
      whileHover={{ y: -4, borderColor: "rgba(0, 230, 118, 0.3)" }}
      className={`relative overflow-hidden rounded-2xl border border-white/5 bg-[#0B0B0B]/60 backdrop-blur-xl transition-all duration-300 p-5 flex flex-col justify-between ${
        isLive ? "shadow-[0_0_20px_rgba(0,230,118,0.05)] border-primary/20" : ""
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] uppercase font-black text-white/40 tracking-wider">
            {match.tournaments?.name || "Play To Network Tournament"} • {match.group_name || "Group Stage"}
          </span>
          {isLive ? (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[10px] font-black uppercase text-red-500 animate-pulse">
              <span>{match.minute}'</span>
            </div>
          ) : (
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
              match.status === "Upcoming" ? "bg-white/5 text-white/60" : "bg-emerald-500/10 text-emerald-400"
            }`}>
              {match.status}
            </span>
          )}
        </div>

        {/* Scoreboard Layout */}
        <div className="flex justify-between items-center py-4 px-2">
          {/* Team 1 */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="size-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-xs font-bold text-white/70 shadow-inner">
              {getInitials(team1Name)}
            </div>
            <span className="text-xs font-bold text-white text-center line-clamp-1">{team1Name}</span>
          </div>

          {/* Scores */}
          <div className="flex flex-col items-center px-4">
            <div className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
              <span>{match.team1_score ?? 0}</span>
              <span className="text-white/30 text-lg font-medium">:</span>
              <span>{match.team2_score ?? 0}</span>
            </div>
            {match.status === "Upcoming" && (
              <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mt-1.5 flex items-center gap-1">
                <Clock className="size-3" />
                {match.kickoff_time || "TBD"}
              </span>
            )}
          </div>

          {/* Team 2 */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="size-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-xs font-bold text-white/70 shadow-inner">
              {getInitials(team2Name)}
            </div>
            <span className="text-xs font-bold text-white text-center line-clamp-1">{team2Name}</span>
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-white/50">
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3.5 text-white/30" />
          <span className="truncate max-w-[150px]">{match.venue || "Play To Network Arena"}</span>
        </span>

        <Link
          href={`/live/${match.id}`}
          className="flex items-center gap-1 text-primary hover:text-primary-light font-bold transition-colors uppercase tracking-wider"
        >
          <span>Match Info</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>
    </motion.div>
  )
}
