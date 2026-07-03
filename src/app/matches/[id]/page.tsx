export const dynamic = 'force-dynamic'

import { PtnNavbar } from "@/shared/components/ptn-navbar"
import { PtnFooter } from "@/shared/components/ptn-footer"
import { MatchHeader } from "@/features/tournaments/components/matches/match-header"
import { LiveScoreboard } from "@/features/tournaments/components/matches/live-scoreboard"
import { MatchTimeline } from "@/features/tournaments/components/matches/match-timeline"
import { MatchStatistics } from "@/features/tournaments/components/matches/match-statistics"
import { TeamLineups } from "@/features/tournaments/components/matches/team-lineups"
import { LiveActivityFeed } from "@/features/tournaments/components/matches/live-activity-feed"
import { StandingsImpact } from "@/features/tournaments/components/matches/standings-impact"
import { Activity } from "lucide-react"

import { config } from "@/lib/config"
import { createClient } from "@/lib/supabase/server"
import { MatchRepository } from "@/lib/repositories/match.repository"

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let matchData: any = null
  let loadError = false

  if (config.useLiveMatches) {
    try {
      const supabase = await createClient()
      matchData = await MatchRepository.getMatchById(supabase, id)
      if (!matchData) {
        loadError = true
      }
    } catch (error) {
      console.error("Failed to load match details from Supabase:", error)
      loadError = true
    }
  }

  if (config.useLiveMatches && loadError) {
    return (
      <main className="min-h-screen bg-[#000000] text-foreground selection:bg-primary/30 pb-20">
        <PtnNavbar />
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center justify-center text-center">
          <Activity className="w-16 h-16 text-white/20 mb-6 animate-pulse" />
          <h1 className="font-heading text-3xl font-black text-white uppercase tracking-wider">Match Not Found</h1>
          <p className="text-white/40 mt-3 text-lg max-w-md">
            No live matches currently or the match details are unavailable.
          </p>
        </div>
        <PtnFooter />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#000000] text-foreground selection:bg-primary/30 pb-20">
      <PtnNavbar />

      <div className="w-full pt-28 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        
        <MatchHeader match={matchData} />
        
        <LiveScoreboard match={matchData} />
        
        <MatchTimeline match={matchData} />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          
          {/* Left Column (Stats & Feed) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="h-[400px]">
              <MatchStatistics match={matchData} />
            </div>
            <div className="h-[300px]">
              <StandingsImpact match={matchData} />
            </div>
          </div>

          {/* Center Column (Lineups) */}
          <div className="lg:col-span-4 h-[732px]">
            <TeamLineups match={matchData} />
          </div>

          {/* Right Column (Live Feed) */}
          <div className="lg:col-span-4 h-[732px]">
            <LiveActivityFeed match={matchData} />
          </div>

        </div>

      </div>

      <div className="mt-20">
        <PtnFooter />
      </div>
    </main>
  )
}
