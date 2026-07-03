"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface StatItemProps {
  label: string
  value: number
  suffix?: string
  prefix?: string
  delay: number
}

function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number, suffix?: string, prefix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    const duration = 2000 // 2 seconds

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      
      if (progress < duration) {
        // easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress / duration, 4)
        setCount(Math.floor(easeProgress * value))
        requestAnimationFrame(animate)
      } else {
        setCount(value)
      }
    }

    requestAnimationFrame(animate)
  }, [value])

  return (
    <span className="font-heading font-black text-4xl sm:text-5xl text-white tracking-tight">
      {prefix}{count}{suffix}
    </span>
  )
}

function StatItem({ label, value, suffix, prefix, delay }: StatItemProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center sm:items-start p-6 rounded-xl bg-[#0A0A0A]/40 border border-white/5 backdrop-blur-sm"
    >
      <AnimatedCounter value={value} suffix={suffix} prefix={prefix} />
      <span className="text-xs uppercase font-bold text-white/40 tracking-widest mt-2">{label}</span>
    </motion.div>
  )
}

export interface EventsStatsProps {
  activeTeams?: number
  activeEvents?: number
  matchesPlayed?: number
  sportsHosted?: number
}

export function EventsStats({
  activeTeams = 1248,
  activeEvents = 42,
  matchesPlayed = 8500,
  sportsHosted = 12
}: EventsStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-12">
      <StatItem label="Active Teams" value={activeTeams} delay={0.1} />
      <StatItem label="Active Events" value={activeEvents} delay={0.2} />
      <StatItem label="Matches Played" value={matchesPlayed} suffix="+" delay={0.3} />
      <StatItem label="Sports Hosted" value={sportsHosted} delay={0.4} />
    </div>
  )
}

