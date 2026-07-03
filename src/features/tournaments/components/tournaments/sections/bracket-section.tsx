import { createClient } from "@/lib/supabase/server"
import { MatchRepository } from "@/lib/repositories/match.repository"

export async function BracketSection({ tournamentId }: { tournamentId?: string }) {
  let hasMatches = false

  if (tournamentId) {
    try {
      const supabase = await createClient()
      const matches = await MatchRepository.getMatchesByTournament(supabase, tournamentId)
      if (matches && matches.length > 0) {
        hasMatches = true
      }
    } catch (error) {
      console.error("Failed to check matches for bracket:", error)
    }
  }

  if (!hasMatches) {
    return (
      <div className="py-20 text-center border border-dashed border-white/5 bg-[#0A0A0A]/40 rounded-xl text-white/45 text-sm font-semibold uppercase tracking-wider">
        Fixtures will be announced after registrations close.
      </div>
    )
  }

  return (
    <div className="w-full text-center py-20 border border-white/5 bg-[#0A0A0A]/40 rounded-xl text-white/45 text-sm font-semibold uppercase tracking-wider">
      Bracket view is ready. Check matches tab for schedules and scores.
    </div>
  )
}
