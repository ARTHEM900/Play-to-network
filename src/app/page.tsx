import dynamic from "next/dynamic"
import { PtnNavbar } from "@/shared/components/ptn-navbar"
import { PtnHero } from "@/shared/components/ptn-hero"
import { CinematicLoader } from "@/shared/components/cinematic-loader"

const LiveTicker = dynamic(() => import("@/shared/components/live-ticker").then(m => m.LiveTicker))
const SportsCategories = dynamic(() => import("@/shared/components/sports-categories").then(m => m.SportsCategories))
const LiveEvents = dynamic(() => import("@/shared/components/live-events").then(m => m.LiveEvents))
const UpcomingEvents = dynamic(() => import("@/shared/components/upcoming-events").then(m => m.UpcomingEvents))
const ForPlayers = dynamic(() => import("@/shared/components/for-players").then(m => m.ForPlayers))
const ForOrganizers = dynamic(() => import("@/shared/components/for-organizers").then(m => m.ForOrganizers))
const RecentResults = dynamic(() => import("@/shared/components/recent-results").then(m => m.RecentResults))
const PtnFooter = dynamic(() => import("@/shared/components/ptn-footer").then(m => m.PtnFooter))

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
