import { PtnNavbar } from "@/shared/components/ptn-navbar"
import { LiveTicker } from "@/shared/components/live-ticker"
import { PtnHero } from "@/shared/components/ptn-hero"
import { SportsCategories } from "@/shared/components/sports-categories"
import { LiveEvents } from "@/shared/components/live-events"
import { UpcomingEvents } from "@/shared/components/upcoming-events"
import { ForPlayers } from "@/shared/components/for-players"
import { ForOrganizers } from "@/shared/components/for-organizers"
import { RecentResults } from "@/shared/components/recent-results"
import { PtnFooter } from "@/shared/components/ptn-footer"
import { CinematicLoader } from "@/shared/components/cinematic-loader"

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <CinematicLoader />
      <PtnNavbar />
      <LiveTicker />
      <PtnHero />
      <SportsCategories />
      <LiveEvents />
      <UpcomingEvents />
      <ForPlayers />
      <ForOrganizers />
      <RecentResults />
      <PtnFooter />
    </main>
  )
}
