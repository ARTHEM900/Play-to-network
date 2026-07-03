import { Users, Trophy, Calendar, MapPin } from "lucide-react"

const STATS = [
  { icon: Users, value: "12,400+", label: "Active Players" },
  { icon: Trophy, value: "320", label: "Tournaments Hosted" },
  { icon: Calendar, value: "1,850", label: "Matches Played" },
  { icon: MapPin, value: "48", label: "Partner Venues" },
]

export function StatsStrip() {
  return (
    <section aria-label="Platform statistics" className="relative w-full border-y border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 divide-x divide-y divide-border lg:grid-cols-4 lg:divide-y-0">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="group flex items-center gap-4 px-2 py-8 sm:px-6 lg:py-10"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <s.icon className="h-6 w-6" />
              </span>
              <div>
                <dd className="font-heading text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
                  {s.value}
                </dd>
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
                  {s.label}
                </dt>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
