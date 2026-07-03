"use client"

import { Button } from "@/shared/components/ui/button"
import { Calendar, MapPin, Users, Trophy } from "lucide-react"
import { motion, useInView, animate } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

// Smooth count-up component
function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (inView && ref.current) {
      const controls = animate(0, to, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate(value) {
          if (ref.current) {
            ref.current.textContent = Math.round(value).toString()
          }
        }
      })
      return () => controls.stop()
    }
  }, [inView, to])

  return <span ref={ref}>0</span>
}

export function UpcomingEvents() {
  const [tournaments, setTournaments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    const fetchTournaments = async () => {
      try {
        const { data } = await supabase
          .from('tournaments')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(4)
        
        if (data) {
          // Fetch registrations for count
          const { data: regs } = await supabase
            .from('registrations')
            .select('tournament_id')
            .eq('registration_status', 'Approved')

          const regsMap = new Map()
          regs?.forEach(r => {
            const count = regsMap.get(r.tournament_id) || 0
            regsMap.set(r.tournament_id, count + 1)
          })

          setTournaments(data.map((t: any) => ({
            id: t.id,
            name: t.name,
            sport: t.sport || "Football",
            targetTeams: t.max_teams || 12,
            registeredTeams: regsMap.get(t.id) || t.current_teams || 0,
            location: t.location || "Delhi, India",
            status: t.status === "Registration Open" ? "Open" : "Closed",
            prize: t.prize_pool || "TBD",
            date: t.start_date ? new Date(t.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Coming Soon"
          })))
        }
      } catch (err) {
        console.error("Failed to load upcoming tournaments:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTournaments()
  }, [])

  return (
    <section id="events" className="py-24 bg-card border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight uppercase">Upcoming Events</h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">Register your team for the next big competition.</p>
          </div>
          <Link href="/events">
            <Button variant="outline" className="hidden sm:flex border-border hover:bg-secondary">Browse All Events</Button>
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-white/40 text-sm font-medium animate-pulse">
            Loading upcoming tournaments...
          </div>
        ) : tournaments.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-white/5 bg-background rounded-xl text-white/45 text-sm font-semibold uppercase tracking-wider">
            No upcoming events scheduled at the moment.
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
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {tournaments.map((t) => (
              <motion.div 
                key={t.id} 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="flex flex-col overflow-hidden rounded-xl border border-border bg-background transition-all group relative"
              >
                {/* Subtle Spotlight Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="p-5 flex-1 relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t.sport}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      t.status === 'Open' ? 'text-primary bg-primary/10' : 
                      t.status === 'Closed' ? 'text-muted-foreground bg-secondary' : 
                      'text-yellow-500 bg-yellow-500/10'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground mb-4 line-clamp-2">{t.name}</h3>
                  
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{t.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{t.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>
                        <CountUp to={t.registeredTeams} /> / {t.targetTeams} Teams
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      <span>Prize: <span className="text-foreground font-semibold">{t.prize}</span></span>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-border bg-secondary/20 relative z-10">
                  <Link href={`/tournaments/${t.id}`}>
                    <Button className="w-full font-semibold shadow-sm transition-shadow group-hover:shadow-[0_0_15px_rgba(0,230,118,0.15)]" variant={t.status === 'Closed' ? 'secondary' : 'default'} disabled={t.status === 'Closed'}>
                      {t.status === 'Closed' ? 'Registration Full' : 'Register Now'}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        <Link href="/events">
          <Button variant="outline" className="w-full mt-6 sm:hidden border-border hover:bg-secondary">Browse All Events</Button>
        </Link>
      </div>
    </section>
  )
}
