"use client"

import { Users, CalendarCheck, Activity, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"

const headerInitial = { opacity: 0, y: 20 }
const headerWhileInView = { opacity: 1, y: 0 }
const headerViewport = { once: true, margin: "-50px" }
const headerTransition = { duration: 0.6 }
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

const FEATURES = [
  {
    title: "Join Teams",
    description: "Find players, build your roster, and manage your squad all in one place.",
    icon: Users,
  },
  {
    title: "Register for Events",
    description: "Seamlessly sign up for tournaments and leagues across various sports.",
    icon: CalendarCheck,
  },
  {
    title: "Track Matches",
    description: "Follow live scores, upcoming schedules, and personal performance stats.",
    icon: Activity,
  },
  {
    title: "View Standings",
    description: "Climb the leaderboard and see where your team ranks globally.",
    icon: BarChart3,
  },
]

export function ForPlayers() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={headerInitial}
          whileInView={headerWhileInView}
          viewport={headerViewport}
          transition={headerTransition}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight uppercase">Built For Competitors</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">Everything you need to compete at the highest level, right at your fingertips.</p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={headerViewport}
          variants={containerVariants}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div 
                key={feature.title} 
                variants={cardVariants}
                className="flex flex-col items-start p-6 rounded-xl border border-border bg-card/40 hover:bg-card transition-colors"
              >
                <div className="mb-5 rounded-lg bg-secondary p-3 text-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
