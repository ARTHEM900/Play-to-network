"use client"

import { Search, MapPin, Trophy, Activity } from "lucide-react"

export function EventsFilter() {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {/* Search Bar */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-white/40" />
        </div>
        <input
          type="text"
          placeholder="Search tournaments, teams, or players..."
          className="w-full bg-[#0A0A0A]/80 border border-white/10 rounded-lg pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all backdrop-blur-md"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide flex-shrink-0">
        <div className="relative min-w-[140px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Trophy className="h-4 w-4 text-white/40" />
          </div>
          <select className="w-full bg-[#0A0A0A]/80 border border-white/10 rounded-lg pl-9 pr-8 py-3.5 text-sm text-white/80 appearance-none focus:outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer backdrop-blur-md">
            <option value="">All Sports</option>
            <option value="football">Football</option>
            <option value="cricket">Cricket</option>
            <option value="basketball">Basketball</option>
            <option value="badminton">Badminton</option>
            <option value="esports">Esports</option>
          </select>
        </div>

        <div className="relative min-w-[140px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-4 w-4 text-white/40" />
          </div>
          <select className="w-full bg-[#0A0A0A]/80 border border-white/10 rounded-lg pl-9 pr-8 py-3.5 text-sm text-white/80 appearance-none focus:outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer backdrop-blur-md">
            <option value="">All Cities</option>
            <option value="delhi">Delhi NCR</option>
            <option value="mumbai">Mumbai</option>
            <option value="bangalore">Bangalore</option>
            <option value="pune">Pune</option>
          </select>
        </div>

        <div className="relative min-w-[140px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Activity className="h-4 w-4 text-white/40" />
          </div>
          <select className="w-full bg-[#0A0A0A]/80 border border-white/10 rounded-lg pl-9 pr-8 py-3.5 text-sm text-white/80 appearance-none focus:outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer backdrop-blur-md">
            <option value="">Status</option>
            <option value="open">Registration Open</option>
            <option value="closing">Closing Soon</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>
    </div>
  )
}
