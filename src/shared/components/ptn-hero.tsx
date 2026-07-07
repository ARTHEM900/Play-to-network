"use client"

import { Button } from "@/shared/components/ui/button"
import { ArrowRight, Trophy, Users, Activity } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { PtnLogo } from "./ptn-logo"
import { useState, useEffect } from "react"

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const target = new Date("2026-07-19T00:00:00+05:30")

    const update = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) return
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="font-mono font-bold text-white tracking-wider">
      {String(timeLeft.days).padStart(2, "0")} : {String(timeLeft.hours).padStart(2, "0")} : {String(timeLeft.minutes).padStart(2, "0")} : {String(timeLeft.seconds).padStart(2, "0")}
    </div>
  )
}

export function PtnHero() {
  return (
    <section id="home" className="relative overflow-hidden h-screen w-full bg-[#000000] flex items-center">
      
      {/* ---------------------------------------------------- */}
      {/* CINEMATIC BACKGROUND TUNNEL (0.0s - 3.0s Intro) */}
      {/* ---------------------------------------------------- */}
      
      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ 
          opacity: [0, 0.15, 0.4, 0.6, 0.8, 1, 1],
          scale: [1.1, 1.1, 1.1, 1.1, 1.1, 1.0, 1.0]
        }}
        transition={{
          duration: 4.0,
          times: [0, 0.5/4.0, 1.0/4.0, 1.5/4.0, 2.0/4.0, 3.0/4.0, 1.0],
          ease: "easeInOut"
        }}
        className="absolute inset-0 z-0 pointer-events-none origin-center"
        style={{ filter: "blur(1px)" }}
      >
        <Image
          src="/stadium_bg.jpg"
          alt="Cinematic Stadium Tunnel"
          fill
          className="object-cover object-center"
          priority
          quality={100}
        />
        
        {/* Soft edge darkening to keep the focus on the stadium and UI */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black via-black/40 to-transparent"></div>

        {/* Subtle Arena Wall Branding Projection */}
        <div className="absolute top-[38%] left-[26%] rotate-[-7deg] skew-y-[-2deg] opacity-[0.25] mix-blend-screen select-none pointer-events-none filter blur-[0.5px]">
          <PtnLogo className="scale-[2.2]" />
        </div>
      </motion.div>

      {/* ---------------------------------------------------- */}
      {/* FOREGROUND CONTENT (3.0s: Activation) */}
      {/* ---------------------------------------------------- */}

      <div className="relative z-20 mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 mt-16 sm:mt-0 flex flex-col md:flex-row items-center justify-between h-full pt-20 pb-32 pointer-events-none">
        
        {/* Left Column: Subtle Branding & CTA */}
        <div className="w-full md:w-1/3 relative z-30 pointer-events-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3.0, ease: "easeOut" }}
            className="mt-[30vh]"
          >
            {/* Small Branding */}
            <div className="mb-6 flex items-center gap-3">
              <PtnLogo className="scale-105" />
            </div>

            <p className="text-lg text-white/80 font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pr-10 mb-8">
              Join tournaments, build teams, track live matches, and compete across sports and esports.
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <Link href="/events" prefetch={true}>
                <Button size="lg" className="h-14 px-8 text-sm font-bold tracking-wide uppercase bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(0,230,118,0.3)] hover:shadow-[0_0_40px_rgba(0,230,118,0.5)] transition-all rounded-lg">
                  Explore Events <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-sm font-bold tracking-wide border-white/10 bg-black/60 backdrop-blur-md hover:bg-black/80 transition-all text-white rounded-lg group">
                <span className="w-2 h-2 rounded-full bg-primary mr-3 shadow-[0_0_10px_rgba(0,230,118,0.8)] group-hover:animate-pulse"></span>
                View Live Matches
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Dashboard */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 3.0, ease: "easeOut" }}
          className="w-full md:w-[420px] relative z-20 mt-12 md:mt-0 pointer-events-auto"
        >
          {/* Dashboard Container - Dark Glassmorphism */}
          <div className="rounded-xl border border-white/10 bg-[#0A0A0A]/60 backdrop-blur-xl shadow-[0_40px_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
            
            <div className="p-5 flex flex-col gap-4">
              
              {/* Live Match Widget */}
              <div className="rounded-lg bg-black/40 p-4 relative overflow-hidden border border-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-white/50" />
                    <span className="text-[10px] font-bold text-white/50 tracking-widest uppercase">Live Match</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                    </span>
                    <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">Live</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center px-2">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center bg-black/40">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">FC Titans</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-primary font-bold mb-1">• 67'</span>
                    <div className="text-4xl font-heading font-black text-white tracking-tighter drop-shadow-lg">
                      2 - 1
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-black/40">
                      <Users className="w-5 h-5 text-white/70" />
                    </div>
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Warriors</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Active Registrations Widget */}
                <div className="rounded-lg bg-black/40 p-4 border border-white/5 flex flex-col justify-between backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest flex items-center gap-2"><Users className="w-3 h-3" /> Active Registrations</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/50 block mb-1">Teams Registered</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-heading font-black text-white tracking-tight drop-shadow-md">24</span>
                    </div>
                    <span className="text-[10px] text-white/40 block mt-1">Across 3 Events</span>
                  </div>
                </div>

                {/* Upcoming Event Widget */}
                <div className="rounded-lg bg-black/40 p-0 border border-white/5 relative overflow-hidden flex flex-col backdrop-blur-sm">
                  <div className="h-16 w-full relative">
                    <Image src="/stadium_bg.jpg" alt="event bg" fill className="object-cover opacity-50 blur-sm scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                  </div>
                  <div className="p-3 -mt-6 relative z-10">
                    <span className="text-[8px] uppercase font-bold text-white/50 tracking-widest flex items-center gap-1 mb-2"><Trophy className="w-3 h-3" /> Upcoming Event</span>
                    <span className="text-[8px] uppercase font-bold text-white bg-white/10 px-1.5 py-0.5 rounded border border-white/5 tracking-wider w-fit block mb-1">Registration Ends In</span>
                    <div className="text-sm mb-2"><CountdownTimer /></div>
                    <h4 className="font-bold text-[11px] text-white leading-tight">Delhi Football Cup</h4>
                    <span className="text-[9px] text-white/50 mt-1 block">12 Teams Registered</span>
                  </div>
                </div>
              </div>

              {/* Standings Preview Widget */}
              <div className="rounded-lg bg-black/40 p-4 border border-white/5 flex flex-col backdrop-blur-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest">Standings Preview - Group A</span>
                  <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest">PTS</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-primary">1. FC Titans</span>
                    <span className="font-bold text-white">9</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-white/80">2. Warriors</span>
                    <span className="font-bold text-white/80">6</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-white/60">3. Storm FC</span>
                    <span className="font-bold text-white/60">3</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-white/40">4. Red Dragons</span>
                    <span className="font-bold text-white/40">0</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center cursor-pointer group">
                  <span className="text-xs text-white/60 font-medium group-hover:text-white transition-colors">View Full Standings</span>
                  <ArrowRight className="w-3 h-3 text-white/40 group-hover:text-primary transition-colors" />
                </div>
              </div>

            </div>
          </div>
          
        </motion.div>
      </div>
    </section>
  )
}
