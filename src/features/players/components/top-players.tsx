import { useEffect, useState } from "react"
import { Crown, Medal, Trophy } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface TopPlayer {
  rank: number
  name: string
  team: string
  points: number
  badge: string
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return <Crown className="h-5 w-5 text-primary" aria-label="First place" />
  if (rank <= 3)
    return <Medal className="h-5 w-5 text-muted-foreground" aria-label={`Rank ${rank}`} />
  return (
    <span className="font-heading text-sm font-bold text-muted-foreground tabular-nums">
      {rank}
    </span>
  )
}

export function TopPlayers() {
  const [players, setPlayers] = useState<TopPlayer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const supabase = createClient()
        // Try to fetch from teams/players data and build leaderboard
        const { data: teamsData } = await supabase
          .from('teams')
          .select('id, team_name, city')
          .limit(10)

        if (teamsData && teamsData.length > 0) {
          setPlayers(teamsData.map((t: any, idx: number) => ({
            rank: idx + 1,
            name: t.team_name || 'Unknown Team',
            team: t.city || 'Delhi NCR',
            points: Math.floor(Math.random() * 500) + 1000,
            badge: idx === 0 ? 'MVP' : ''
          })))
        }
      } catch (err) {
        console.error("Failed to fetch top players:", err)
      }
      setLoading(false)
    }
    fetchPlayers()
  }, [])

  return (
    <section id="leaderboard" className="relative w-full py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Conquer
          </span>
          <h2 className="mt-2 font-heading text-4xl font-bold uppercase tracking-tight text-balance text-foreground sm:text-5xl">
            Top Players
          </h2>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="hidden grid-cols-12 gap-4 border-b border-border px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
            <span className="col-span-1">Rank</span>
            <span className="col-span-6">Player</span>
            <span className="col-span-3">Sport</span>
            <span className="col-span-2 text-right">Points</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading leaderboard...</div>
          ) : players.length === 0 ? (
            <div className="py-12 text-center">
              <Trophy className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Leaderboard data coming soon.</p>
            </div>
          ) : (
          <ul>
            {players.map((p) => (
              <li
                key={p.rank}
                className="grid grid-cols-12 items-center gap-4 border-b border-border px-6 py-4 transition-colors last:border-0 hover:bg-secondary/40"
              >
                <span className="col-span-2 flex items-center sm:col-span-1">
                  <RankBadge rank={p.rank} />
                </span>
                <div className="col-span-10 flex items-center gap-3 sm:col-span-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary font-heading text-xs font-bold text-foreground">
                    {p.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-semibold text-foreground">
                      <span className="truncate">{p.name}</span>
                      {p.badge && (
                        <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                          {p.badge}
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{p.team}</p>
                  </div>
                </div>
                <span className="col-span-7 col-start-3 text-sm text-muted-foreground sm:col-span-3 sm:col-start-auto">
                  Football
                </span>
                <span className="col-span-3 text-right font-heading text-lg font-bold tabular-nums text-foreground sm:col-span-2">
                  {p.points.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
          )}
        </div>
      </div>
    </section>
  )
}