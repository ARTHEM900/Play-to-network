"use client"

import { useState } from "react"
import { Radio, ChevronRight, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/shared/utils/utils"

type Match = {
  id: number
  league: string
  sport: string
  stage: string
  home: { name: string; abbr: string; score: number }
  away: { name: string; abbr: string; score: number }
  minute?: number
  half?: string
  time?: string
  status: "live" | "upcoming" | "finished"
}

const LIVE_MATCHES: Match[] = [
  {
    id: 1,
    league: "Premier Cup",
    sport: "Football",
    stage: "Group A · Matchday 5",
    home: { name: "FC Titans", abbr: "FT", score: 2 },
    away: { name: "Delhi Warriors", abbr: "DW", score: 1 },
    minute: 65,
    half: "2nd Half",
    status: "live",
  },
  {
    id: 2,
    league: "Capital T20",
    sport: "Cricket",
    stage: "Super 8",
    home: { name: "Capital Kings", abbr: "CK", score: 142 },
    away: { name: "South Strikers", abbr: "SS", score: 98 },
    minute: 14,
    half: "2nd Innings · 14 ov",
    status: "live",
  },
  {
    id: 3,
    league: "Hoops Night",
    sport: "Basketball",
    stage: "Quarter Final",
    home: { name: "Night Hoopers", abbr: "NH", score: 78 },
    away: { name: "Court Kings", abbr: "CK", score: 74 },
    minute: 8,
    half: "Q4 · 08:12",
    status: "live",
  },
]

const UPCOMING_MATCHES: Match[] = [
  {
    id: 4,
    league: "Premier Cup",
    sport: "Football",
    stage: "Group B · Matchday 5",
    home: { name: "Metro United", abbr: "MU", score: 0 },
    away: { name: "Royal FC", abbr: "RF", score: 0 },
    time: "Today · 18:30",
    status: "upcoming",
  },
  {
    id: 5,
    league: "Capital T20",
    sport: "Cricket",
    stage: "Super 8",
    home: { name: "East Eagles", abbr: "EE", score: 0 },
    away: { name: "North Knights", abbr: "NK", score: 0 },
    time: "Today · 20:00",
    status: "upcoming",
  },
  {
    id: 6,
    league: "Hoops Night",
    sport: "Basketball",
    stage: "Semi Final",
    home: { name: "Sky Ballers", abbr: "SB", score: 0 },
    away: { name: "Rim Rockers", abbr: "RR", score: 0 },
    time: "Tomorrow · 19:15",
    status: "upcoming",
  },
]

const FINISHED_MATCHES: Match[] = [
  {
    id: 7,
    league: "Premier Cup",
    sport: "Football",
    stage: "Group A · Matchday 4",
    home: { name: "FC Titans", abbr: "FT", score: 3 },
    away: { name: "Metro United", abbr: "MU", score: 0 },
    time: "Full Time",
    status: "finished",
  },
  {
    id: 8,
    league: "Capital T20",
    sport: "Cricket",
    stage: "Group Stage",
    home: { name: "Capital Kings", abbr: "CK", score: 176 },
    away: { name: "East Eagles", abbr: "EE", score: 171 },
    time: "Full Time",
    status: "finished",
  },
  {
    id: 9,
    league: "Hoops Night",
    sport: "Basketball",
    stage: "Quarter Final",
    home: { name: "Court Kings", abbr: "CK", score: 88 },
    away: { name: "Sky Ballers", abbr: "SB", score: 91 },
    time: "Full Time",
    status: "finished",
  },
]

const TABS = [
  { key: "live", label: "Live", count: LIVE_MATCHES.length },
  { key: "upcoming", label: "Upcoming", count: UPCOMING_MATCHES.length },
  { key: "finished", label: "Results", count: FINISHED_MATCHES.length },
] as const

function Team({
  team,
  align,
  winner,
}: {
  team: Match["home"]
  align: "left" | "right"
  winner?: boolean
}) {
  return (
    <div
      className={cn(
        "flex flex-1 items-center gap-3",
        align === "right" && "flex-row-reverse text-right",
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg font-heading text-sm font-bold",
          winner ? "bg-primary/15 text-primary" : "bg-secondary text-foreground",
        )}
      >
        {team.abbr}
      </span>
      <span
        className={cn(
          "font-heading text-sm font-semibold sm:text-base",
          winner ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {team.name}
      </span>
    </div>
  )
}

function MatchRow({ match }: { match: Match }) {
  const homeWin = match.home.score > match.away.score
  const awayWin = match.away.score > match.home.score
  const isLive = match.status === "live"

  return (
    <article className="group rounded-xl border border-border bg-background/40 p-4 transition-colors hover:border-primary/40 hover:bg-secondary/30">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span className="font-semibold text-foreground/80">{match.league}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
          {match.stage}
        </span>
        {match.status === "live" && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-destructive" />
            </span>
            {match.minute}&apos;
          </span>
        )}
        {match.status === "upcoming" && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <Clock className="h-3 w-3" />
            {match.time}
          </span>
        )}
        {match.status === "finished" && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <CheckCircle2 className="h-3 w-3 text-primary" />
            {match.time}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Team team={match.home} align="left" winner={homeWin} />
        <div className="flex shrink-0 flex-col items-center">
          <div className="flex items-center gap-2 rounded-lg bg-card px-3 py-1.5">
            <span
              className={cn(
                "font-heading text-2xl font-bold tabular-nums",
                homeWin ? "text-foreground" : "text-muted-foreground",
                isLive && "text-foreground",
              )}
            >
              {match.status === "upcoming" ? "–" : match.home.score}
            </span>
            <span className="text-muted-foreground">:</span>
            <span
              className={cn(
                "font-heading text-2xl font-bold tabular-nums",
                awayWin ? "text-foreground" : "text-muted-foreground",
                isLive && "text-foreground",
              )}
            >
              {match.status === "upcoming" ? "–" : match.away.score}
            </span>
          </div>
          {isLive && match.half && (
            <span className="mt-1.5 text-[10px] font-medium uppercase tracking-wide text-primary">
              {match.half}
            </span>
          )}
        </div>
        <Team team={match.away} align="right" winner={awayWin} />
      </div>
    </article>
  )
}

export function LiveMatchCenter() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("live")

  const matches =
    tab === "live"
      ? LIVE_MATCHES
      : tab === "upcoming"
        ? UPCOMING_MATCHES
        : FINISHED_MATCHES

  return (
    <section id="live" className="relative w-full py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
              <Radio className="h-4 w-4" />
              Match Center
            </span>
            <h2 className="mt-2 font-heading text-4xl font-bold uppercase tracking-tight text-balance text-foreground sm:text-5xl">
              Live Match Center
            </h2>
          </div>
          <Button variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary">
            Full Schedule
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card/60 shadow-2xl backdrop-blur-xl">
          {/* Tab bar */}
          <div className="flex items-center gap-1 border-b border-border p-2 sm:gap-2 sm:p-3">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors",
                  tab === t.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {t.key === "live" && (
                  <span className="relative flex h-2 w-2">
                    <span
                      className={cn(
                        "absolute inline-flex h-full w-full rounded-full",
                        tab === t.key ? "animate-ping bg-primary-foreground/70" : "bg-destructive opacity-75",
                      )}
                    />
                    <span
                      className={cn(
                        "relative inline-flex h-2 w-2 rounded-full",
                        tab === t.key ? "bg-primary-foreground" : "bg-destructive",
                      )}
                    />
                  </span>
                )}
                {t.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-xs tabular-nums",
                    tab === t.key ? "bg-primary-foreground/20" : "bg-secondary",
                  )}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* Match list */}
          <div className="grid grid-cols-1 gap-3 p-4 sm:p-5 lg:grid-cols-3">
            {matches.map((m) => (
              <MatchRow key={m.id} match={m} />
            ))}
          </div>

          {/* Footer ticker */}
          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Scores update in real time
            </span>
            <span className="font-medium uppercase tracking-wider">
              {LIVE_MATCHES.length} matches live now
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
