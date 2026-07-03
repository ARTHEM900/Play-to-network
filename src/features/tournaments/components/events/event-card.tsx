"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Users, Activity } from "lucide-react"

export interface EventCardProps {
  id: string
  title: string
  sport: string
  location: string
  teamCount: number
  maxTeams: number
  registrationStatus: "Open" | "Closing Soon" | "Closed"
  registrationDeadline: string
  startDate: string
  imageUrl: string
  format?: string
  prizePool?: string
  entryFeeTeam?: number
  entryFeeIndividual?: number
}

export const EventCard = memo(function EventCard({
  id,
  title,
  sport,
  location,
  teamCount,
  maxTeams,
  registrationStatus,
  registrationDeadline,
  startDate,
  imageUrl,
  format,
  prizePool,
  entryFeeTeam,
  entryFeeIndividual,
}: EventCardProps) {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
      case "Registration Open": 
        return "text-primary border-primary bg-primary/10"
      case "Closing Soon": 
        return "text-yellow-500 border-yellow-500 bg-yellow-500/10"
      case "Closed": 
        return "text-red-500 border-red-500 bg-red-500/10"
      default: 
        return "text-white/50 border-white/10 bg-white/5"
    }
  }

  const remainingSlots = Math.max(0, maxTeams - teamCount)

  return (
    <Link href={`/tournaments/${id}`} prefetch={true}>
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="group relative rounded-xl border border-white/10 bg-[#0A0A0A]/60 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,230,118,0.15)] hover:border-primary/50 flex flex-col h-full"
      >
        {/* Subtle inner top highlight */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 group-hover:via-primary/30 to-transparent z-20"></div>

        {/* Image Header */}
        <div className="relative h-48 w-full overflow-hidden bg-black">
          <Image 
            src={imageUrl} 
            alt={title} 
            fill 
            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 to-transparent"></div>
          
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white">
              {sport}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 rounded border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(registrationStatus)}`}>
              {registrationStatus}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col flex-1 relative z-10">
          <h3 className="text-xl font-heading font-bold text-white mb-2 group-hover:text-primary transition-colors">{title}</h3>
          
          <div className="space-y-2 mb-4 flex-1">
            <div className="flex items-center text-xs text-white/60">
              <MapPin className="w-3.5 h-3.5 mr-2 text-white/40" />
              <span className="font-medium">{location}</span>
            </div>
            <div className="flex items-center text-xs text-white/60">
              <Calendar className="w-3.5 h-3.5 mr-2 text-white/40" />
              <span className="font-medium">Starts: {startDate}</span>
            </div>

            {/* Format & Prize Pool badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {format && (
                <span className="text-[10px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  {format}
                </span>
              )}
              {prizePool && (
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  {prizePool}
                </span>
              )}
            </div>

            {/* Entry Fees block */}
            <div className="border-t border-white/5 pt-2 mt-2 flex justify-between gap-2 text-[10px] text-white/50">
              <span>Team: <strong className="text-white">₹{entryFeeTeam || 0}</strong></span>
              <span>Solo: <strong className="text-white">₹{entryFeeIndividual || 0}</strong></span>
            </div>
          </div>

          {/* Footer - Teams Progress */}
          <div className="pt-3 border-t border-white/5 mt-auto">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest flex items-center gap-1.5">
                <Users className="w-3 h-3" /> Teams
              </span>
              <span className="text-[10px] font-semibold text-white/40">
                {remainingSlots} slots left
              </span>
              <span className="text-xs font-bold text-white">
                {teamCount} <span className="text-white/40 font-medium">/ {maxTeams}</span>
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full relative" 
                style={{ width: `${(teamCount / maxTeams) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
})
