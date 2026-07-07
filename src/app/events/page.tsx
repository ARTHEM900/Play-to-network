export const revalidate = 60

import dynamic from "next/dynamic"
import { PtnNavbar } from "@/shared/components/ptn-navbar"
import { PtnFooter } from "@/shared/components/ptn-footer"
import { FeaturedEvent } from "@/features/tournaments/components/events/featured-event"
import { EventsStats } from "@/features/tournaments/components/events/events-stats"
import { EventCard, EventCardProps } from "@/features/tournaments/components/events/event-card"

const EventsFilter = dynamic(() => import("@/features/tournaments/components/events/events-filter").then(m => m.EventsFilter))
const EventsTabs = dynamic(() => import("@/features/tournaments/components/events/events-tabs").then(m => m.EventsTabs))
import { Trophy } from "lucide-react"

import { EVENT_CONFIG } from "@/lib/config/event"
import { createClient } from "@/lib/supabase/server"
import { TournamentRepository } from "@/lib/repositories/tournament.repository"
import { MatchRepository } from "@/lib/repositories/match.repository"

export default async function EventsPage() {
  let events: EventCardProps[] = []
  let featuredEvent: any = undefined
  let liveStats: any = undefined

  try {
    const supabase = await createClient()
    const liveTournaments = await TournamentRepository.getTournaments(supabase)
    
    events = (liveTournaments || []).map((t: any) => ({
      id: t.id,
      title: t.name || t.title || "Tournament",
      sport: t.sport || "",
      location: t.location || "",
      teamCount: t.current_teams ?? t.team_count ?? 0,
      maxTeams: t.max_teams ?? 12,
      registrationStatus: (t.status || "Open") as "Open" | "Closed" | "Closing Soon",
      registrationDeadline: t.end_date || EVENT_CONFIG.eventDate,
      startDate: t.start_date || EVENT_CONFIG.eventDate,
      imageUrl: t.image_url || "/stadium_bg.jpg",
      format: t.format || "5 vs 5",
      prizePool: t.prize_pool || "₹10,000",
      entryFeeTeam: t.entry_fee_team ?? 3000,
      entryFeeIndividual: t.entry_fee_individual ?? 600
    }))

    if (liveTournaments && liveTournaments.length > 0) {
      const featuredTourney = liveTournaments[0]
      featuredEvent = {
        id: featuredTourney.id || "",
        title: featuredTourney.name || "",
        sport: featuredTourney.sport || "",
        location: featuredTourney.location || "",
        teamCount: featuredTourney.current_teams ?? 0,
        maxTeams: featuredTourney.max_teams ?? 12,
        registrationStatus: (featuredTourney.status || "Open") as 'Open' | 'Closed' | 'Closing Soon',
        startDate: featuredTourney.start_date || EVENT_CONFIG.eventDate,
        prizePool: featuredTourney.prize_pool || "₹10,000",
        description: featuredTourney.description || "A competitive football tournament hosted by Play To Network."
      }

      let completedMatchesCount = 0
      try {
        const matches = await MatchRepository.getMatches(supabase)
        if (matches) {
          completedMatchesCount = matches.filter((m: any) => m.status === "Completed").length
        }
      } catch (matchErr) {
        console.error("Failed to load match stats:", matchErr)
      }

      liveStats = {
        activeEvents: liveTournaments.length,
        activeTeams: liveTournaments.reduce((acc: number, t: any) => acc + (t.current_teams ?? 0), 0),
        sportsHosted: new Set(liveTournaments.map((t: any) => t.sport).filter(Boolean)).size,
        matchesPlayed: completedMatchesCount
      }
    }
  } catch (error) {
    console.error("Failed to load live events from Supabase:", error)
    events = []
  }

  // Display professional empty state if no tournaments exist
  if (events.length === 0) {
    return (
      <main className="min-h-screen bg-[#050505] text-foreground selection:bg-primary/30">
        <PtnNavbar />
        <div className="h-20 w-full"></div>
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-heading text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Tournaments & Events</h1>
            <p className="text-white/60 mt-2 text-lg">Discover and register for the biggest competitions across all sports.</p>
          </div>
          <div className="py-20 flex flex-col items-center justify-center text-center px-4 bg-[#0A0A0A]/40 border border-white/5 rounded-2xl mt-8 mb-20">
            <Trophy className="w-12 h-12 text-white/20 mb-4 animate-pulse" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">No tournaments available</h3>
            <p className="text-sm text-white/45 mt-2 max-w-md">
              There are currently no scheduled tournaments. Check back soon for updates.
            </p>
          </div>
        </div>
        <PtnFooter />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#050505] text-foreground selection:bg-primary/30">
      <PtnNavbar />
      
      {/* Spacer for fixed navbar */}
      <div className="h-20 w-full"></div>

      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-heading text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Tournaments & Events</h1>
          <p className="text-white/60 mt-2 text-lg">Discover and register for the biggest competitions across all sports.</p>
        </div>

        {/* Featured Event Banner */}
        {featuredEvent && <FeaturedEvent event={featuredEvent} />}

        {/* Statistics Row */}
        {liveStats && (
          <EventsStats 
            activeEvents={liveStats.activeEvents}
            activeTeams={liveStats.activeTeams}
            sportsHosted={liveStats.sportsHosted}
            matchesPlayed={liveStats.matchesPlayed}
          />
        )}

        {/* Search & Filters */}
        <div className="sticky top-20 z-40 bg-[#050505]/95 backdrop-blur-xl py-4 border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <EventsFilter />
          <EventsTabs />
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 mb-20">
          {events.map(event => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>

      </div>

      <PtnFooter />
    </main>
  )
}
