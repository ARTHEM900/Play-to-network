"use client"

import { useState, useEffect } from "react"
import { MatchCard, MatchCardProps } from "./match-card"
import { createClient } from "@/lib/supabase/client"
import { MatchRepository } from "@/lib/repositories/match.repository"

export function MatchesSection({ tournamentId }: { tournamentId?: string }) {
  const [filter, setFilter] = useState<"All" | "Live" | "Upcoming" | "Completed" | "None">("All")
  const [matches, setMatches] = useState<MatchCardProps[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (tournamentId) {
      setLoading(true)
      const supabase = createClient()
      MatchRepository.getMatchesByTournament(supabase, tournamentId)
        .then((data) => {
          if (data && data.length > 0) {
            const mapped = data.map((m: any) => ({
              id: m.id,
              team1: { name: m.team1_name ?? m.team1?.name ?? "TBD", score: m.team1_score ?? m.team1?.score },
              team2: { name: m.team2_name ?? m.team2?.name ?? "TBD", score: m.team2_score ?? m.team2?.score },
              time: m.match_time ?? m.time ?? "",
              date: m.match_date ?? m.date ?? "",
              status: (m.status as "Live" | "Upcoming" | "Completed") || "Upcoming",
              group: m.group_name ?? m.group
            }))
            setMatches(mapped)
          } else {
            setMatches([])
          }
        })
        .catch((err) => {
          console.error("Failed to load live matches:", err)
          setMatches([])
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [tournamentId])

  const filteredMatches = matches.filter(match => filter === "All" || match.status === filter)

  return (
    <div className="w-full flex flex-col">
      
      {/* Internal Tabs */}
      {matches.length > 0 && (
        <div className="flex gap-4 mb-8 border-b border-white/5 pb-4">
          {["All", "Live", "Upcoming", "Completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`text-xs font-bold tracking-widest uppercase transition-colors px-4 py-2 rounded-md ${
                filter === tab ? "bg-white/10 text-white" : "text-white/40 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              {tab === "Live" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-2 -mt-0.5 align-middle"></span>}
              {tab}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-white/40 text-sm font-medium animate-pulse">
          Loading tournament matches...
        </div>
      ) : (
        /* Grid or empty states */
        <div>
          {matches.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-white/5 bg-[#0A0A0A]/40 rounded-xl text-white/45 text-sm font-semibold uppercase tracking-wider">
              Fixtures will be announced after registrations close.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMatches.map(match => (
                <MatchCard key={match.id} {...match} />
              ))}
              {filteredMatches.length === 0 && (
                <div className="col-span-full py-20 text-center text-white/45 text-sm font-semibold uppercase tracking-wider">
                  No {filter.toLowerCase()} matches found.
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  )
}
