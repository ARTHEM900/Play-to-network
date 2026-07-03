import { Trophy, Calendar, MapPin, Users, ArrowRight, Activity } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface TournamentHeroProps {
  name: string
  sport: string
  location: string
  startDate: string
  endDate: string
  registrationStatus: string
  teamCount: number
  maxTeams: number
  tournamentId?: string
}

export function TournamentHero({
  name,
  sport,
  location,
  startDate,
  endDate,
  registrationStatus,
  teamCount,
  maxTeams,
  tournamentId
}: TournamentHeroProps) {
  return (
    <div className="relative w-full h-[60vh] min-h-[500px] flex items-end pb-12 bg-black border-b border-white/10 mt-16">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/stadium_bg.jpg" 
          alt={name} 
          fill 
          className="object-cover opacity-50 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
        
        {/* Left Column: Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1.5 rounded-md bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-primary" />
              {sport}
            </span>
            <span className={`px-3 py-1.5 rounded-md border text-xs font-bold uppercase tracking-widest backdrop-blur-md ${
              registrationStatus === "Live" ? "text-red-500 border-red-500/50 bg-red-500/10" : 
              registrationStatus === "Open" ? "text-primary border-primary/50 bg-primary/10" : 
              "text-white/60 border-white/10 bg-white/5"
            }`}>
              {registrationStatus === "Live" && (
                <span className="relative flex h-2 w-2 inline-block mr-2 -mt-0.5 align-middle">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
              {registrationStatus}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-white tracking-tighter mb-4 drop-shadow-2xl">
            {name}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm md:text-base font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-white/40" />
              {location}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white/40" />
              {startDate} - {endDate}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-white/40" />
              {teamCount} / {maxTeams} Teams
            </div>
          </div>
        </div>

        {/* Right Column: CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 shrink-0">
          <Link href={`/register${tournamentId ? `?tournamentId=${tournamentId}` : ''}`}>
            <Button size="lg" className="h-14 px-8 text-sm font-bold tracking-wide uppercase bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(0,230,118,0.2)] hover:shadow-[0_0_30px_rgba(0,230,118,0.4)] transition-all rounded-md">
              Register Team <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#matches">
            <Button size="lg" variant="outline" className="h-14 px-8 text-sm font-bold tracking-wide border-white/10 bg-black/60 backdrop-blur-xl hover:bg-white/10 transition-all text-white rounded-md flex items-center">
              <Activity className="mr-2 h-4 w-4 text-primary" />
              View Matches
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}
