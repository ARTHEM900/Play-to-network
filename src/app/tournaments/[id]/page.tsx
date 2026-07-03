export const revalidate = 60

import { Suspense } from "react"
import { PtnNavbar } from "@/shared/components/ptn-navbar"
import { PtnFooter } from "@/shared/components/ptn-footer"
import { TournamentHero } from "@/features/tournaments/components/tournaments/tournament-hero"
import { TournamentStatusBanner } from "@/features/tournaments/components/tournaments/tournament-status-banner"
import { TournamentTabs } from "@/features/tournaments/components/tournaments/tournament-tabs"
import { Trophy } from "lucide-react"

// Sections
import { OverviewSection } from "@/features/tournaments/components/tournaments/sections/overview-section"
import { MatchesSection } from "@/features/tournaments/components/tournaments/sections/matches-section"
import { BracketSection } from "@/features/tournaments/components/tournaments/sections/bracket-section"
import { StandingsSection } from "@/features/tournaments/components/tournaments/sections/standings-section"
import { TeamsSection } from "@/features/tournaments/components/tournaments/sections/teams-section"
import { RulesSection } from "@/features/tournaments/components/tournaments/sections/rules-section"

import { config } from "@/lib/config"
import { createClient } from "@/lib/supabase/server"
import { TournamentRepository } from "@/lib/repositories/tournament.repository"

export default async function TournamentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { id } = await params
  const { tab } = await searchParams
  const currentTab = tab || "overview"

  let tournamentData: any = {
    title: "Delhi Champions Cup 2026",
    sport: "Football",
    location: "Delhi NCR, India",
    start_date: "Sep 10, 2026",
    end_date: "Oct 05, 2026",
    registration_status: "Live",
    team_count: 32,
    max_teams: 32,
    current_stage: "Groups"
  }
  let loadError = false

  if (config.useLiveTournamentDetails) {
    try {
      const supabase = await createClient()
      const dbTourney = await TournamentRepository.getTournamentById(supabase, id)
      if (dbTourney) {
        tournamentData = dbTourney
      } else {
        loadError = true
      }
    } catch (error) {
      console.error("Failed to load tournament from Supabase:", error)
      loadError = true
    }
  }

  if (config.useLiveTournamentDetails && loadError) {
    return (
      <main className="min-h-screen bg-[#050505] text-foreground selection:bg-primary/30">
        <PtnNavbar />
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center justify-center text-center">
          <Trophy className="w-16 h-16 text-white/20 mb-6 animate-pulse" />
          <h1 className="font-heading text-3xl font-black text-white uppercase tracking-wider">Tournament Not Found</h1>
          <p className="text-white/40 mt-3 text-lg max-w-md">
            The tournament you are looking for does not exist or has been removed.
          </p>
        </div>
        <PtnFooter />
      </main>
    )
  }

  // Format dates for display
  const startDateStr = tournamentData.start_date
    ? new Date(tournamentData.start_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    : "Sep 10, 2026"
  const endDateStr = tournamentData.end_date
    ? new Date(tournamentData.end_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    : "Oct 05, 2026"

  return (
    <main className="min-h-screen bg-[#050505] text-foreground selection:bg-primary/30">
      <PtnNavbar />
      
      {/* Hero Section */}
      <TournamentHero 
        name={tournamentData.title || tournamentData.name}
        sport={tournamentData.sport}
        location={tournamentData.location}
        startDate={startDateStr}
        endDate={endDateStr}
        registrationStatus={tournamentData.registration_status || tournamentData.registrationStatus}
        teamCount={tournamentData.team_count ?? tournamentData.teamCount ?? 0}
        maxTeams={tournamentData.max_teams ?? tournamentData.maxTeams ?? 32}
        tournamentId={id}
      />

      {/* Status & Timeline */}
      <TournamentStatusBanner currentStage={tournamentData.current_stage || "Groups"} />

      {/* Navigation Tabs (Sticky) */}
      <Suspense fallback={<div className="w-full h-12 bg-[#050505]" />}>
        <TournamentTabs tournamentId={id} />
      </Suspense>

      {/* Dynamic Content Area */}
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12 min-h-[500px]">
        {currentTab === "overview" && <OverviewSection tournamentId={id} />}
        {currentTab === "matches" && <MatchesSection tournamentId={id} />}
        {currentTab === "bracket" && <BracketSection tournamentId={id} />}
        {currentTab === "standings" && <StandingsSection tournamentId={id} />}
        {currentTab === "teams" && <TeamsSection tournamentId={id} />}
        {currentTab === "rules" && <RulesSection tournamentId={id} rules={tournamentData.rules} />}
      </div>

      <PtnFooter />
    </main>
  )
}
