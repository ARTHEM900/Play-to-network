"use client"

import { Trophy } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function RecentResults() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    const fetchResults = async () => {
      try {
        const { data } = await supabase
          .from('matches')
          .select('*, tournaments(name)')
          .eq('status', 'Completed')
          .order('created_at', { ascending: false })
          .limit(5)
        
        if (data) {
          setResults(data.map((m: any) => ({
            id: m.id,
            sport: m.sport || "Football",
            tournament: m.tournaments?.name || m.tournament_name || "Play To Network Tournament",
            winner: (m.team1_score ?? 0) >= (m.team2_score ?? 0) ? (m.team1_name || "TBD") : (m.team2_name || "TBD"),
            score: `${m.team1_score ?? 0} - ${m.team2_score ?? 0}`,
            runnerUp: (m.team1_score ?? 0) >= (m.team2_score ?? 0) ? (m.team2_name || "TBD") : (m.team1_name || "TBD"),
            date: m.match_date || "Recently"
          })))
        }
      } catch (err) {
        console.error("Failed to fetch recent results:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [])

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight uppercase">Recent Results</h2>
          <p className="mt-2 text-muted-foreground text-sm sm:text-base">The latest match outcomes on Play To Network.</p>
        </motion.div>

        {loading ? (
          <div className="py-12 text-center text-white/40 text-sm font-medium animate-pulse">
            Loading recent outcomes...
          </div>
        ) : results.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-white/5 bg-card/30 rounded-xl text-white/45 text-sm font-semibold uppercase tracking-wider">
            No recent match results available.
          </div>
        ) : (
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="space-y-4"
          >
            {results.map((result) => (
              <motion.div 
                key={result.id} 
                variants={{
                  hidden: { opacity: 0, scale: 0.98 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }
                }}
                whileHover={{ scale: 1.01, backgroundColor: "var(--card)" }}
                className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 rounded-lg border border-border bg-card/50 transition-colors"
              >
                <div className="flex w-full sm:w-1/3 flex-col items-center sm:items-start mb-4 sm:mb-0">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-1">{result.sport}</span>
                  <span className="font-semibold text-foreground text-center sm:text-left text-sm sm:text-base">{result.tournament}</span>
                  <span className="text-[10px] uppercase text-muted-foreground mt-1 font-bold">{result.date}</span>
                </div>
                
                <div className="flex w-full sm:w-2/3 items-center justify-center sm:justify-end gap-4 sm:gap-8">
                  <div className="flex flex-col items-center sm:items-end w-1/3">
                    <Trophy className="h-4 w-4 text-primary mb-1 hidden sm:block" />
                    <span className="font-bold text-foreground text-center sm:text-right">{result.winner}</span>
                    <span className="text-[10px] uppercase text-primary font-bold">Winner</span>
                  </div>
                  
                  <div className="bg-secondary px-4 py-2 rounded font-heading font-bold text-xl text-foreground min-w-[80px] text-center border border-border/50">
                    {result.score}
                  </div>
                  
                  <div className="flex flex-col items-center sm:items-start w-1/3">
                    <span className="font-semibold text-muted-foreground text-center sm:text-left">{result.runnerUp}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
