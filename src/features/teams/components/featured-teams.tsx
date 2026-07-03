import { TrendingUp } from "lucide-react"

const TEAMS = [
  { name: "FC Titans", tag: "FT", sport: "Football", wins: 24, played: 30, rank: 1 },
  { name: "Delhi Warriors", tag: "DW", sport: "Football", wins: 21, played: 30, rank: 2 },
  { name: "Capital Kings", tag: "CK", sport: "Cricket", wins: 19, played: 26, rank: 3 },
  { name: "Night Hoopers", tag: "NH", sport: "Basketball", wins: 18, played: 24, rank: 4 },
]

export function FeaturedTeams() {
  return (
    <section id="teams" className="relative w-full py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Connect
          </span>
          <h2 className="mt-2 font-heading text-4xl font-bold uppercase tracking-tight text-balance text-foreground sm:text-5xl">
            Featured Teams
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground text-pretty">
            The squads setting the pace across Delhi&apos;s amateur circuit.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAMS.map((team) => {
            const winRate = Math.round((team.wins / team.played) * 100)
            return (
              <article
                key={team.name}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <span className="absolute right-4 top-4 font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  #{team.rank}
                </span>

                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary font-heading text-2xl font-bold text-primary ring-1 ring-primary/30">
                  {team.tag}
                </div>

                <h3 className="mt-4 font-heading text-xl font-bold uppercase text-foreground">
                  {team.name}
                </h3>
                <p className="text-sm text-muted-foreground">{team.sport}</p>

                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
                  <div>
                    <p className="font-heading text-2xl font-bold tabular-nums text-foreground">
                      {team.wins}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Wins
                    </p>
                  </div>
                  <div>
                    <p className="flex items-center gap-1 font-heading text-2xl font-bold tabular-nums text-primary">
                      {winRate}%
                      <TrendingUp className="h-4 w-4" />
                    </p>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Win Rate
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
