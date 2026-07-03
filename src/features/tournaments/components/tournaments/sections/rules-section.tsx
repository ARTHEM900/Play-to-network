"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

const RULES = [
  {
    title: "1. Match Format & Duration",
    content: "Matches are played in a 5v5 format. The tournament starts with a league stage, leading into single-elimination knockouts. Match duration is 15 minutes per half, with a 2-minute half-time break (30 minutes total). On a draw in knockouts, matches go straight to a penalty shootout (5 penalties each, followed by sudden death; no extra time)."
  },
  {
    title: "2. Team Composition",
    content: "Each team must consist of exactly 5 players. There are NO SUBSTITUTES. A player may represent only one team throughout the tournament. Early registrations have a better chance of securing preferred national teams, allotted strictly on a first-come, first-served basis."
  },
  {
    title: "3. Individual Registrations",
    content: "Individual registrations are accepted at ₹600 per player. If sufficient registrations are received, the organizers will form balanced teams. The formed teams are final and cannot be modified. National team allocation for individuals is random depending on available teams."
  },
  {
    title: "4. Disciplinary & Officiating",
    content: "The referee's decision during a match is final and binding. Late arrival for scheduled matches can lead to straight disqualification. The Play to Network Organizing Committee's decisions regarding scheduling, management, and disciplinary matters are final and cannot be challenged."
  },
  {
    title: "5. Code of Conduct",
    content: "Uphold the spirit of sportsmanship. Respect referees, opponents, organizers, and volunteers. Avoid abusive language, offensive behaviour, or unsporting conduct. The organizers reserve the right to issue warnings, suspend, or disqualify any participant whose behavior is inappropriate."
  }
]

export function RulesSection({ tournamentId, rules }: { tournamentId?: string; rules?: any }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  // Parse rules if stringified, or check if it's already an array
  const parsedRules = typeof rules === 'string'
    ? JSON.parse(rules)
    : (Array.isArray(rules) ? rules : null);

  const displayRules = parsedRules || RULES;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
      <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider mb-2">Tournament Regulations</h3>
      
      {displayRules.map((rule: any, index: number) => {
        const isOpen = openIndex === index
        const isCategoryFormat = rule.category && Array.isArray(rule.items);
        const title = isCategoryFormat ? rule.category : rule.title;

        return (
          <div key={index} className="bg-[#0A0A0A]/40 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden transition-colors hover:border-white/10">
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
            >
              <span className={`text-sm font-bold transition-colors ${isOpen ? "text-primary" : "text-white"}`}>
                {title}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-white/40" />
              </motion.div>
            </button>
            
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className={`overflow-hidden min-h-0 transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-100" : "opacity-0"}`}>
                <div className="p-5 pt-0 text-sm text-white/60 leading-relaxed border-t border-white/5 mt-2">
                  {isCategoryFormat ? (
                    <ul className="list-disc pl-5 space-y-2.5">
                      {rule.items.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    rule.content
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
      
      <div className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
        <h4 className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2">Important Notice</h4>
        <p className="text-sm text-white/60">
          The tournament organizers reserve the right to alter the rules or schedule due to unforeseen circumstances such as extreme weather. All decisions made by the match officials on the field are final.
        </p>
      </div>
    </div>
  )
}
