import { Activity, Clock } from "lucide-react"
import Link from "next/link"

export interface MatchCardProps {
  id: string
  team1: { name: string; score?: number; logo?: string }
  team2: { name: string; score?: number; logo?: string }
  time: string
  date: string
  status: "Live" | "Upcoming" | "Completed"
  group?: string
}

export function MatchCard({ id, team1, team2, time, date, status, group }: MatchCardProps) {
  return (
    <Link href={`/matches/${id}`} className="bg-[#0A0A0A]/40 backdrop-blur-md border border-white/5 rounded-xl p-4 hover:border-white/10 hover:bg-[#0A0A0A]/60 transition-all cursor-pointer group flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
        <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">
          {group ? `Group ${group}` : "Knockout"}
        </span>
        
        {status === "Live" && (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
            </span>
            <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">Live</span>
          </div>
        )}
        {status === "Upcoming" && (
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-white/50 tracking-wider">
            <Clock className="w-3 h-3" /> {time}
          </div>
        )}
        {status === "Completed" && (
          <span className="text-[10px] uppercase font-bold text-white/30 tracking-wider">FT</span>
        )}
      </div>

      {/* Teams */}
      <div className="flex-1 flex flex-col justify-center gap-4">
        {/* Team 1 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-xs font-bold text-white/70">{team1.name.substring(0,2).toUpperCase()}</span>
            </div>
            <span className="font-medium text-sm text-white group-hover:text-primary transition-colors">{team1.name}</span>
          </div>
          {status !== "Upcoming" && (
            <span className={`font-heading font-black text-xl ${team1.score && team2.score && team1.score > team2.score ? "text-white" : "text-white/50"}`}>
              {team1.score}
            </span>
          )}
        </div>

        {/* Team 2 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-xs font-bold text-white/70">{team2.name.substring(0,2).toUpperCase()}</span>
            </div>
            <span className="font-medium text-sm text-white group-hover:text-primary transition-colors">{team2.name}</span>
          </div>
          {status !== "Upcoming" && (
            <span className={`font-heading font-black text-xl ${team1.score && team2.score && team2.score > team1.score ? "text-white" : "text-white/50"}`}>
              {team2.score}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">{date}</span>
        <span className="text-[10px] uppercase font-bold text-primary tracking-widest flex items-center gap-1">
          Match Center <Activity className="w-3 h-3" />
        </span>
      </div>

    </Link>
  )
}
