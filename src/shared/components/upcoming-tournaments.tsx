import Image from "next/image"
import { Calendar, MapPin, Trophy, ArrowUpRight } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import Link from "next/link"

const TOURNAMENTS = [
  {
    title: "Delhi Premier Football Cup",
    sport: "Football · 11v11",
    date: "Mar 22, 2026",
    venue: "Siri Fort Complex",
    prize: "₹1,50,000",
    slots: "12 / 16 Teams",
    image: "/tournament-football.png",
    status: "Registration Open",
  },
  {
    title: "Capital T20 Smash",
    sport: "Cricket · T20",
    date: "Apr 05, 2026",
    venue: "Feroz Shah Kotla",
    prize: "₹2,00,000",
    slots: "8 / 12 Teams",
    image: "/tournament-cricket.png",
    status: "Registration Open",
  },
  {
    title: "Hoops Night League",
    sport: "Basketball · 5v5",
    date: "Apr 18, 2026",
    venue: "Thyagaraj Stadium",
    prize: "₹80,000",
    slots: "10 / 10 Teams",
    image: "/tournament-basketball.png",
    status: "Filling Fast",
  },
]

export function UpcomingTournaments() {
  return (
    <section id="events" className="relative w-full py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Compete
            </span>
            <h2 className="mt-2 font-heading text-4xl font-bold uppercase tracking-tight text-balance text-foreground sm:text-5xl">
              Upcoming Tournaments
            </h2>
          </div>
          <Button variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary">
            View All Events
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TOURNAMENTS.map((t) => (
            <article
              key={t.title}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/40"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={t.image || "/placeholder.svg"}
                  alt={t.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
                  {t.status}
                </span>
                <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t.sport}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-heading text-xl font-bold uppercase leading-tight text-foreground">
                  {t.title}
                </h3>

                <dl className="mt-4 space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <dd>{t.date}</dd>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <dd>{t.venue}</dd>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Trophy className="h-4 w-4 text-primary" />
                    <dd>
                      Prize Pool{" "}
                      <span className="font-semibold text-foreground">{t.prize}</span>
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-xs font-medium text-muted-foreground">
                    {t.slots}
                  </span>
                  <Link href="/register">
                    <Button
                      size="sm"
                      className="bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      Register
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
