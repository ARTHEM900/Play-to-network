"use client"

import { Trophy, CircleDot, MonitorPlay, Target, Activity } from "lucide-react"
import { motion } from "framer-motion"

const sportsViewport = { once: true, margin: "-50px" }
const sportsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}
const sportsCardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

const CATEGORIES = [
  { name: "Football", icon: CircleDot },
  { name: "Cricket", icon: Target },
  { name: "Basketball", icon: Activity },
  { name: "Badminton", icon: Trophy },
  { name: "Esports", icon: MonitorPlay },
]

export function SportsCategories() {
  return (
    <div className="w-full border-y border-border bg-card/30 backdrop-blur-sm relative z-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={sportsViewport}
          variants={sportsContainerVariants}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-12 py-6"
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            return (
              <motion.div 
                key={cat.name} 
                variants={sportsCardVariants}
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
              >
                <div className="rounded-md bg-secondary p-2 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-semibold text-sm tracking-wide uppercase">{cat.name}</span>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
