"use client"

import { CircleDot, Target, Activity, Trophy, Monitor, Tv } from "lucide-react"
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

const CATEGORIES: { name: string; icon: any; status: "live" | "coming-soon" }[] = [
  { name: "Football", icon: CircleDot, status: "live" },
  { name: "Cricket", icon: Target, status: "coming-soon" },
  { name: "Badminton", icon: Trophy, status: "coming-soon" },
  { name: "Volleyball", icon: Monitor, status: "coming-soon" },
  { name: "Basketball", icon: Activity, status: "coming-soon" },
  { name: "BGMI", icon: Tv, status: "coming-soon" },
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
            const isLive = cat.status === "live"
            return (
              <motion.div 
                key={cat.name} 
                variants={sportsCardVariants}
                className={`flex items-center gap-3 text-muted-foreground transition-colors group ${isLive ? "cursor-pointer hover:text-foreground" : "cursor-default opacity-60"}`}
              >
                <div className="rounded-md bg-secondary p-2 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm tracking-wide uppercase">{cat.name}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isLive ? "text-primary" : "text-muted-foreground"}`}>
                    {isLive ? "LIVE" : "Coming Soon"}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
