import { MapPin, Trophy, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function MatchHeader({ match }: { match?: any }) {
  const tournamentTitle = match?.tournaments?.title || match?.tournament_title || "Delhi Champions Cup"
  const location = match?.location || "JLN Stadium, Pitch 2"
  const statusStr = match?.status === "Live" 
    ? "Match Center Live" 
    : match?.status === "Completed" 
    ? "Match Completed" 
    : "Match Scheduled"

  return (
    <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/5 pb-6 mb-8 gap-4">
      <div className="flex flex-col gap-3">
        <Link href={`/tournaments/${match?.tournament_id || "e1"}`} prefetch={true} className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2 hover:text-white transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Tournament
        </Link>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-primary" />
            {tournamentTitle}
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            {location}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/5 rounded-lg backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          {match?.status !== "Completed" && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${match?.status === "Live" ? "bg-red-500" : "bg-primary"}`}></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${match?.status === "Completed" ? "bg-white/45" : match?.status === "Live" ? "bg-red-500" : "bg-primary"}`}></span>
        </span>
        <span className={`text-[10px] font-black uppercase tracking-widest ${match?.status === "Completed" ? "text-white/45" : match?.status === "Live" ? "text-red-500" : "text-primary"}`}>
          {statusStr}
        </span>
      </div>
    </div>
  )
}
