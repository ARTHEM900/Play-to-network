"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const TABS = ["All Events", "Upcoming", "Ongoing", "Completed"]
const CATEGORIES = ["All", "Football", "Cricket", "Basketball", "Badminton", "Esports"]

export function EventsTabs() {
  const [activeTab, setActiveTab] = useState(TABS[0])
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])

  return (
    <div className="w-full mt-10 mb-8">
      {/* Category Pills */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-4">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
              activeCategory === category
                ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-8 border-b border-white/10 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative py-4 text-sm font-bold tracking-wide transition-colors whitespace-nowrap ${
              activeTab === tab ? "text-primary" : "text-white/50 hover:text-white/80"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-sm shadow-[0_0_10px_rgba(0,230,118,0.5)]"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
