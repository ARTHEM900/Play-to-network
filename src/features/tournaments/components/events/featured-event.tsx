"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/shared/components/ui/button"
import { ArrowRight, Trophy, Users, Calendar } from "lucide-react"
import Link from "next/link"

export interface FeaturedEventProps {
  event?: {
    id: string
    title: string
    sport: string
    location: string
    teamCount: number
    maxTeams: number
    registrationStatus: 'Open' | 'Closed' | 'Closing Soon'
    startDate: string
    prizePool?: string
    description?: string
  }
}

export function FeaturedEvent({ event }: FeaturedEventProps) {
  const data = event || {
    id: "default",
    title: "DELHI CHAMPIONS CUP 2026",
    sport: "Football",
    location: "Delhi NCR",
    teamCount: 24,
    maxTeams: 32,
    registrationStatus: "Open" as const,
    startDate: "Sep 10, 2026",
    prizePool: "₹5L",
    description: "The biggest amateur football tournament in North India. Compete for a prize pool of ₹5,00,000 and the ultimate bragging rights."
  }

  const startsInText = event 
    ? event.startDate 
    : "12 Days"

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full rounded-2xl border border-white/10 overflow-hidden bg-black mt-8"
    >
      <div className="absolute inset-0 z-0">
        <Image 
          src="/stadium_bg.jpg" 
          alt="Featured Event" 
          fill 
          className="object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 lg:p-16 gap-8">
        
        <div className="flex-1 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-1 rounded bg-primary/20 border border-primary/30 text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
              </span>
              Featured Event
            </span>
            <span className="px-2.5 py-1 rounded bg-white/10 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/70">
              {data.sport}
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white tracking-tighter mb-4 uppercase">
            {data.title}
          </h2>
          
          <p className="text-white/60 text-lg mb-8 max-w-xl">
            {data.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-6 mb-8">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Start Date</span>
              <span className="font-mono font-bold text-white text-lg">{startsInText}</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10 hidden sm:block"></div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest flex items-center gap-1.5"><Users className="w-3 h-3" /> Registered</span>
              <span className="font-heading font-bold text-white text-xl">{data.teamCount} <span className="text-sm text-white/40">/ {data.maxTeams} Teams</span></span>
            </div>
            <div className="w-[1px] h-8 bg-white/10 hidden sm:block"></div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest flex items-center gap-1.5"><Trophy className="w-3 h-3" /> Prize Pool</span>
              <span className="font-heading font-bold text-white text-xl">{data.prizePool || "TBD"}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {data.id !== "default" ? (
              <Link href={`/tournaments/${data.id}`} prefetch={true}>
                <Button size="lg" className="h-12 px-8 text-sm font-bold tracking-wide uppercase bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(0,230,118,0.2)] hover:shadow-[0_0_30px_rgba(0,230,118,0.4)] transition-all rounded-md">
                  Register / Details <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register" prefetch={true}>
                  <Button size="lg" className="h-12 px-8 text-sm font-bold tracking-wide uppercase bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(0,230,118,0.2)] hover:shadow-[0_0_30px_rgba(0,230,118,0.4)] transition-all rounded-md">
                    Register Team <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-12 px-6 text-sm font-bold tracking-wide border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all text-white rounded-md">
                  View Details
                </Button>
              </>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  )
}

