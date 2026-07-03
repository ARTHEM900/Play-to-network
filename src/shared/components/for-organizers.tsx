"use client"

import { Trophy, Users, LayoutDashboard, Target, BarChart } from "lucide-react"
import { motion } from "framer-motion"

const FEATURES = [
  {
    title: "Create Events",
    description: "Set up tournaments, leagues, or one-off matches in minutes.",
    icon: Trophy,
  },
  {
    title: "Manage Registrations",
    description: "Handle payments, team sizes, and waitlists automatically.",
    icon: Users,
  },
  {
    title: "Generate Fixtures",
    description: "Create brackets and round-robin schedules with a single click.",
    icon: LayoutDashboard,
  },
  {
    title: "Track Scores",
    description: "Update match results in real-time to keep players informed.",
    icon: Target,
  },
  {
    title: "Publish Standings",
    description: "Automatically calculate points and rank teams instantly.",
    icon: BarChart,
  },
]

export function ForOrganizers() {
  return (
    <section id="organizers" className="py-24 bg-card border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-bold tracking-wider uppercase text-sm">For Organizers</span>
            <h2 className="mt-2 text-3xl font-heading font-bold text-foreground tracking-tight uppercase">Run Tournaments Like A Pro</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Play To Network gives you the infrastructure to host professional-grade competitions without the headache. Manage everything from a single, powerful dashboard.
            </p>
            
            <div className="mt-10 space-y-6">
              {FEATURES.map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <motion.div 
                    key={feature.title} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="mt-1 flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary border border-border text-muted-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{feature.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
          >
            {/* The ONLY floating element on the page, subtle 25% reduction in typical float intensity */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="rounded-xl border border-border bg-background p-2 shadow-2xl relative"
            >
              {/* Subtle background glow */}
              <div className="absolute inset-0 z-[-1] bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-50 blur-xl"></div>
              
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="border-b border-border bg-secondary/50 p-4 flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-border"></div>
                  <div className="h-3 w-3 rounded-full bg-border"></div>
                  <div className="h-3 w-3 rounded-full bg-border"></div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-secondary rounded"></div>
                      <div className="h-8 w-48 bg-primary/20 rounded border border-primary/30"></div>
                    </div>
                    <div className="h-10 w-32 bg-secondary rounded"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-background border border-border rounded-lg"></div>
                    <div className="h-24 bg-background border border-border rounded-lg"></div>
                    <div className="h-24 bg-background border border-border rounded-lg"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-12 w-full bg-background border border-border rounded-lg"></div>
                    <div className="h-12 w-full bg-background border border-border rounded-lg"></div>
                    <div className="h-12 w-full bg-background border border-border rounded-lg"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
        </div>
      </div>
    </section>
  )
}
