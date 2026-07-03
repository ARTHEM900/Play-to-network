import { createClient } from "@/lib/supabase/server"
import { StandingRepository } from "@/lib/repositories/standing.repository"

export async function StandingsSection({ tournamentId }: { tournamentId?: string }) {
  let standings: any[] = []

  if (tournamentId) {
    try {
      const supabase = await createClient()
      const dbStandings = await StandingRepository.getStandingsByTournament(supabase, tournamentId)
      if (dbStandings && dbStandings.length > 0) {
        standings = dbStandings.map((row: any) => {
          const diff = (row.goals_for ?? 0) - (row.goals_against ?? 0)
          const gdStr = diff >= 0 ? `+${diff}` : `${diff}`
          return {
            rank: row.rank,
            team: row.team_name ?? row.team ?? "",
            pld: row.played ?? 0,
            w: row.won ?? 0,
            d: row.drawn ?? 0,
            l: row.lost ?? 0,
            gf: row.goals_for ?? 0,
            ga: row.goals_against ?? 0,
            gd: gdStr,
            pts: row.points ?? 0
          }
        })
      }
    } catch (error) {
      console.error("Failed to load standings from Supabase:", error)
      standings = []
    }
  }

  return (
    <div className="w-full flex flex-col gap-8">
      
      {/* Group Selector / Info */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wider">Group A</h3>
      </div>

      {standings.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/5 bg-[#0A0A0A]/40 rounded-xl text-white/45 text-sm font-semibold uppercase tracking-wider">
          No standings calculated yet.
        </div>
      ) : (
        /* Standings Table */
        <div className="w-full overflow-x-auto rounded-xl border border-white/5 bg-[#0A0A0A]/40 backdrop-blur-sm">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="py-4 px-6 text-[10px] uppercase font-bold text-white/40 tracking-widest w-12 text-center">#</th>
                <th className="py-4 px-6 text-[10px] uppercase font-bold text-white/40 tracking-widest">Club</th>
                <th className="py-4 px-4 text-[10px] uppercase font-bold text-white/40 tracking-widest text-center">MP</th>
                <th className="py-4 px-4 text-[10px] uppercase font-bold text-white/40 tracking-widest text-center">W</th>
                <th className="py-4 px-4 text-[10px] uppercase font-bold text-white/40 tracking-widest text-center">D</th>
                <th className="py-4 px-4 text-[10px] uppercase font-bold text-white/40 tracking-widest text-center">L</th>
                <th className="py-4 px-4 text-[10px] uppercase font-bold text-white/40 tracking-widest text-center hidden sm:table-cell">GF</th>
                <th className="py-4 px-4 text-[10px] uppercase font-bold text-white/40 tracking-widest text-center hidden sm:table-cell">GA</th>
                <th className="py-4 px-4 text-[10px] uppercase font-bold text-white/40 tracking-widest text-center hidden sm:table-cell">GD</th>
                <th className="py-4 px-6 text-[10px] uppercase font-bold text-white tracking-widest text-center bg-white/5">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {standings.map((row) => (
                <tr key={row.rank} className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-6 text-sm font-bold text-white/50 text-center">{row.rank}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white/70">{(row.team || "??").substring(0,2).toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">{row.team}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-white/60 text-center">{row.pld}</td>
                  <td className="py-4 px-4 text-sm font-medium text-white/80 text-center">{row.w}</td>
                  <td className="py-4 px-4 text-sm font-medium text-white/60 text-center">{row.d}</td>
                  <td className="py-4 px-4 text-sm font-medium text-white/60 text-center">{row.l}</td>
                  <td className="py-4 px-4 text-sm font-medium text-white/40 text-center hidden sm:table-cell">{row.gf}</td>
                  <td className="py-4 px-4 text-sm font-medium text-white/40 text-center hidden sm:table-cell">{row.ga}</td>
                  <td className="py-4 px-4 text-sm font-medium text-white/60 text-center hidden sm:table-cell">{row.gd}</td>
                  <td className="py-4 px-6 text-sm font-bold text-primary text-center bg-white/5">{row.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/40">
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span> Qualifies for Knockouts</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> Eliminated</div>
      </div>
    </div>
  )
}
