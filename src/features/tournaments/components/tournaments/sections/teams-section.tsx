import { TeamCard, TeamCardProps } from "./team-card"
import { createClient } from "@/lib/supabase/server"

export async function TeamsSection({ tournamentId }: { tournamentId?: string }) {
  let teams: TeamCardProps[] = []

  if (tournamentId) {
    try {
      const supabase = await createClient()
      
      // Query registrations for this tournament
      const { data: regs } = await supabase
        .from('registrations')
        .select('team_id')
        .eq('tournament_id', tournamentId)

      if (regs && regs.length > 0) {
        const teamIds = regs.map(r => r.team_id).filter(Boolean)
        
        if (teamIds.length > 0) {
          // Fetch teams
          const { data: dbTeams } = await supabase
            .from('teams')
            .select('*')
            .in('id', teamIds)

          if (dbTeams && dbTeams.length > 0) {
            // Query roster count
            const { data: playersData } = await supabase
              .from('players')
              .select('team_id')
              .in('team_id', teamIds)

            const playersCountMap = new Map()
            playersData?.forEach(p => {
              playersCountMap.set(p.team_id, (playersCountMap.get(p.team_id) || 0) + 1)
            })

            teams = dbTeams.map((t: any, idx: number) => ({
              id: t.id,
              name: t.team_name,
              captain: t.captain_name || "",
              players: playersCountMap.get(t.id) || 1,
              group: idx < 4 ? "A" : idx < 8 ? "B" : idx < 12 ? "C" : "D"
            }))
          }
        }
      }
    } catch (error) {
      console.error("Failed to load live teams from Supabase:", error)
      teams = []
    }
  }

  return (
    <div className="w-full flex flex-col gap-6">
      
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
          {teams.length} Registered Teams
        </h3>
      </div>

      {teams.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/5 bg-[#0A0A0A]/40 rounded-xl text-white/45 text-sm font-semibold uppercase tracking-wider">
          No teams have registered yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
          {teams.map((team) => (
            <TeamCard key={team.id} {...team} />
          ))}
        </div>
      )}

    </div>
  )
}
