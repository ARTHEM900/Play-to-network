"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "matches", label: "Matches" },
  { id: "bracket", label: "Bracket" },
  { id: "standings", label: "Standings" },
  { id: "teams", label: "Teams" },
  { id: "rules", label: "Rules" },
]

export function TournamentTabs({ tournamentId }: { tournamentId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get("tab") || "overview"

  const handleTabChange = (tabId: string) => {
    router.push(`/tournaments/${tournamentId}?tab=${tabId}`, { scroll: false })
  }

  return (
    <div className="w-full bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 sticky top-[64px] z-40">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide pt-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`relative py-4 text-sm font-bold tracking-wide transition-colors whitespace-nowrap ${
                currentTab === tab.id ? "text-primary" : "text-white/50 hover:text-white/80"
              }`}
            >
              {tab.label}
              {currentTab === tab.id && (
                <motion.div
                  layoutId="tournamentTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-sm shadow-[0_0_10px_rgba(0,230,118,0.5)]"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
