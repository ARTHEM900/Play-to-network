"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Radio, Calendar, MapPin, Trophy, Clock, ChevronLeft, BarChart3, Users2, Activity } from "lucide-react"
import { PtnNavbar } from "@/shared/components/ptn-navbar"
import { PtnFooter } from "@/shared/components/ptn-footer"
import { Button } from "@/shared/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { MatchRepository } from "@/lib/repositories/match.repository"

export default function MatchDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [match, setMatch] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeTab, setActiveTab] = useState<"timeline" | "stats" | "lineups">("timeline")

  useEffect(() => {
    if (!id) return

    const supabase = createClient()
    const fetchMatch = async () => {
      try {
        const data = await MatchRepository.getMatchById(supabase, id)
        if (data) {
          setMatch(data)
          setError(false)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error("Failed to load match details:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchMatch()
    const interval = setInterval(fetchMatch, 15000)
    return () => clearInterval(interval)
  }, [id])

  const getInitials = (name: string) => {
    return name
      ? name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
      : "TBD"
  }

  const team1Name = match?.team1?.team_name || "TBD"
  const team2Name = match?.team2?.team_name || "TBD"

  return (
    <main className="min-h-screen bg-[#050505] text-foreground selection:bg-primary/30 pb-20 relative">
      <PtnNavbar />

      <div className="pt-28 px-4 sm:px-6 lg:px-8 max-w-[1000px] mx-auto w-full">
        {/* Back Button */}
        <button
          onClick={() => router.push("/live")}
          className="flex items-center gap-1 text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-8 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"
        >
          <ChevronLeft className="size-4" />
          <span>Back to Match Center</span>
        </button>

        {loading ? (
          <div className="py-20 text-center text-white/40 text-sm font-medium animate-pulse">
            Loading match data...
          </div>
        ) : error || !match ? (
          <div className="py-20 text-center text-red-500/80 text-sm font-medium">
            Match details not found or error loading data.
          </div>
        ) : (
          <div className="space-y-8">
            {/* Match Header Scoreboard Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0B0B0B]/80 backdrop-blur-xl p-8 flex flex-col justify-between shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            >
              {/* Glow background indicator if live */}
              {match.status === "Live" && (
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
              )}

              {/* Tournament & Stage */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs uppercase font-black text-white/45 tracking-widest flex items-center gap-2">
                  <Trophy className="size-4 text-primary" />
                  {match.tournaments?.name || "Play To Network Tournament"} • {match.group_name || "Group Stage"}
                </span>

                {match.status === "Live" ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-xs font-black uppercase text-red-500 animate-pulse">
                    <span className="size-1.5 rounded-full bg-red-500" />
                    <span>{match.minute}' LIVE</span>
                  </div>
                ) : (
                  <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                    match.status === "Upcoming" ? "bg-white/5 text-white/60" : "bg-emerald-500/10 text-emerald-400"
                  }`}>
                    {match.status}
                  </span>
                )}
              </div>

              {/* Match Header Layout */}
              <div className="flex justify-between items-center py-6">
                {/* Team 1 Details */}
                <div className="flex flex-col items-center gap-3 flex-1">
                  <div className="size-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-xl font-extrabold text-white/80 shadow-[0_0_20px_rgba(255,255,255,0.02)]">
                    {getInitials(team1Name)}
                  </div>
                  <span className="text-sm sm:text-base font-black text-white text-center">{team1Name}</span>
                </div>

                {/* Score Ticker */}
                <div className="flex flex-col items-center px-6">
                  <div className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-center gap-4">
                    <span>{match.team1_score ?? 0}</span>
                    <span className="text-white/20 text-3xl font-medium">:</span>
                    <span>{match.team2_score ?? 0}</span>
                  </div>
                  {match.status === "Upcoming" ? (
                    <div className="flex items-center gap-1.5 text-xs text-white/40 font-semibold uppercase tracking-widest mt-4">
                      <Clock className="size-3.5" />
                      <span>{match.kickoff_time || "TBD"}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] uppercase text-white/40 font-bold tracking-widest mt-3">
                      {match.status === "Live" ? "Game In Progress" : "Full Time"}
                    </span>
                  )}
                </div>

                {/* Team 2 Details */}
                <div className="flex flex-col items-center gap-3 flex-1">
                  <div className="size-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-xl font-extrabold text-white/80 shadow-[0_0_20px_rgba(255,255,255,0.02)]">
                    {getInitials(team2Name)}
                  </div>
                  <span className="text-sm sm:text-base font-black text-white text-center">{team2Name}</span>
                </div>
              </div>

              {/* Match Meta Information Grid */}
              <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4 text-xs text-white/50">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-white/30" />
                  <span>Venue: <strong>{match.venue || "Play To Network Arena"}</strong></span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Clock className="size-4 text-white/30" />
                  <span>Scheduled: <strong>{match.kickoff_time || "TBD"}</strong></span>
                </div>
              </div>
            </motion.div>

            {/* Custom Tab Panel Navigation */}
            <div className="flex gap-4 border-b border-white/5 pb-1">
              {[
                { id: "timeline", label: "Timeline", icon: Activity },
                { id: "stats", label: "Statistics", icon: BarChart3 },
                { id: "lineups", label: "Lineups", icon: Users2 }
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-all px-4 py-3 border-b-2 -mb-[2px] ${
                      isActive 
                        ? "border-primary text-white bg-white/5 rounded-t-lg" 
                        : "border-transparent text-white/40 hover:text-white/70"
                    }`}
                  >
                    <Icon className="size-3.5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Graceful Placeholder Display */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-16 text-center border border-dashed border-white/5 bg-[#0B0B0B]/40 rounded-2xl p-8 flex flex-col items-center justify-center gap-3"
            >
              <div className="p-3 bg-white/5 rounded-full border border-white/5 text-white/40 animate-pulse">
                {activeTab === "timeline" ? <Activity className="size-6" /> : activeTab === "stats" ? <BarChart3 className="size-6" /> : <Users2 className="size-6" />}
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider text-white/45 mt-2">
                Available during live matches.
              </span>
              <p className="text-xs text-white/30 max-w-xs leading-relaxed">
                Roster lineups, performance statistics, and chronological event timelines are logged as match events unfold.
              </p>
            </motion.div>
          </div>
        )}
      </div>

      <div className="mt-24">
        <PtnFooter />
      </div>
    </main>
  )
}
