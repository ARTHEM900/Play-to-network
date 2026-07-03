import { ArrowUp, ArrowDown, Minus } from "lucide-react"

export function StandingsImpact({ match }: { match?: any }) {
  const DEFAULT_STANDINGS = [
    { rank: 1, team: "FC Titans", pts: 9, change: "up", oldRank: 2 },
    { rank: 2, team: "Storm FC", pts: 6, change: "down", oldRank: 1 },
    { rank: 3, team: "Warriors", pts: 3, change: "none", oldRank: 3 },
    { rank: 4, team: "Red Dragons", pts: 0, change: "none", oldRank: 4 },
  ]

  const currentStandings = match?.standings_impact || DEFAULT_STANDINGS
  const team1Name = match?.team1_name || "FC Titans"
  const team2Name = match?.team2_name || "Warriors"

  return (
    <div className="w-full bg-gradient-to-br from-[#0A0A0A]/80 to-[#050505] backdrop-blur-md border border-white/5 rounded-xl p-6 h-full flex flex-col relative overflow-hidden group">
      
      {/* Background Effect */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-500"></div>

      <div className="relative z-10">
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
          Live Standings Impact
        </h3>
        <p className="text-[11px] text-white/50 mb-6 font-medium">As it stands with the current scoreline</p>
        
        <div className="space-y-4">
          {currentStandings.map((row: any) => (
            <div key={row.rank} className="flex items-center justify-between">
              
              <div className="flex items-center gap-3">
                {/* Movement Indicator */}
                <div className="w-4 flex justify-center">
                  {row.change === 'up' && <ArrowUp className="w-3 h-3 text-primary" />}
                  {row.change === 'down' && <ArrowDown className="w-3 h-3 text-red-500" />}
                  {row.change === 'none' && <Minus className="w-3 h-3 text-white/20" />}
                </div>
                
                <span className="text-sm font-bold text-white/50">{row.rank}.</span>
                <span className={`text-sm font-bold truncate max-w-[120px] ${row.team === team1Name || row.team === team2Name ? 'text-white' : 'text-white/60'}`}>
                  {row.team}
                </span>
              </div>
              
              <span className="text-sm font-black text-white">{row.pts} <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest ml-1">Pts</span></span>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 text-[9px] uppercase font-bold tracking-widest text-white/30 text-center">
          {match?.group_name || "Group A"} • {match?.match_date || "Live"}
        </div>
      </div>
    </div>
  )
}
