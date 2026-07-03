import { UserCircle2 } from "lucide-react"

export function TeamLineups({ match }: { match?: any }) {
  const DEFAULT_HOME_XI = [
    { no: 1, name: "V. Sharma", pos: "GK" },
    { no: 4, name: "A. Patel", pos: "DEF" },
    { no: 5, name: "R. Singh", pos: "DEF" },
    { no: 3, name: "M. Kumar", pos: "DEF" },
    { no: 2, name: "S. Iyer", pos: "DEF" },
    { no: 8, name: "K. Yadav", pos: "MID" },
    { no: 10, name: "R. Sharma", pos: "MID", captain: true },
    { no: 6, name: "H. Pandya", pos: "MID" },
    { no: 11, name: "V. Kohli", pos: "FWD" },
    { no: 9, name: "K. Patel", pos: "FWD" },
    { no: 7, name: "M. Dhoni", pos: "FWD" },
  ]

  const DEFAULT_AWAY_XI = [
    { no: 1, name: "J. Smith", pos: "GK" },
    { no: 2, name: "L. Johnson", pos: "DEF" },
    { no: 5, name: "D. Brown", pos: "DEF", captain: true },
    { no: 4, name: "C. Davis", pos: "DEF" },
    { no: 3, name: "A. Wilson", pos: "DEF" },
    { no: 6, name: "E. Taylor", pos: "MID" },
    { no: 8, name: "M. Anderson", pos: "MID" },
    { no: 10, name: "T. Thomas", pos: "MID" },
    { no: 7, name: "R. Jackson", pos: "FWD" },
    { no: 9, name: "A. Singh", pos: "FWD" },
    { no: 11, name: "S. White", pos: "FWD" },
  ]

  const team1Name = match?.team1_name || match?.team1?.name || "FC Titans"
  const team2Name = match?.team2_name || match?.team2?.name || "Warriors"
  const team1Initials = team1Name.substring(0, 2).toUpperCase()
  const team2Initials = team2Name.substring(0, 2).toUpperCase()

  const homeLineup = match?.lineups?.home || DEFAULT_HOME_XI
  const awayLineup = match?.lineups?.away || DEFAULT_AWAY_XI

  return (
    <div className="w-full bg-[#0A0A0A]/60 backdrop-blur-md border border-white/5 rounded-xl p-6 h-full flex flex-col">
      <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider mb-6 pb-4 border-b border-white/5">Starting Lineups</h3>
      
      <div className="flex-1 grid grid-cols-2 gap-8 relative">
        {/* Center Divider */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2"></div>

        {/* Home Lineup */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#050505] border border-white/10 flex items-center justify-center">
              <span className="text-xs font-black text-white/80">{team1Initials}</span>
            </div>
            <span className="text-sm font-bold text-white uppercase tracking-wider truncate max-w-[80px]">{team1Name.split(" ")[0]}</span>
          </div>
          
          {homeLineup.map((player: any) => (
            <div key={player.no} className="flex items-center gap-3 group cursor-default">
              <span className="text-[10px] font-mono font-bold text-white/30 w-4 text-right group-hover:text-primary transition-colors">{player.no}</span>
              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                <UserCircle2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-white/80 group-hover:text-white transition-colors flex items-center gap-1.5 truncate">
                  {player.name}
                  {player.captain && <span className="text-[8px] bg-primary/20 text-primary px-1 rounded font-bold">C</span>}
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-white/30">{player.pos}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Away Lineup */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 mb-4 flex-row-reverse text-right">
             <div className="w-8 h-8 rounded-lg bg-[#050505] border border-white/10 flex items-center justify-center">
              <span className="text-xs font-black text-white/80">{team2Initials}</span>
            </div>
            <span className="text-sm font-bold text-white uppercase tracking-wider truncate max-w-[80px]">{team2Name.split(" ")[0]}</span>
          </div>
          
          {awayLineup.map((player: any) => (
            <div key={player.no} className="flex items-center gap-3 group cursor-default flex-row-reverse text-right">
              <span className="text-[10px] font-mono font-bold text-white/30 w-4 text-left group-hover:text-blue-500 transition-colors">{player.no}</span>
              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                <UserCircle2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-end min-w-0">
                <span className="text-xs font-medium text-white/80 group-hover:text-white transition-colors flex items-center gap-1.5 flex-row-reverse truncate">
                  {player.name}
                  {player.captain && <span className="text-[8px] bg-blue-500/20 text-blue-500 px-1 rounded font-bold">C</span>}
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-white/30">{player.pos}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
