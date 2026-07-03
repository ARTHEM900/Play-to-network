export function MatchStatistics({ match }: { match?: any }) {
  const DEFAULT_STATS = [
    { label: "Possession", home: 58, away: 42, isPercentage: true },
    { label: "Shots", home: 14, away: 8, isPercentage: false },
    { label: "Shots on Target", home: 6, away: 3, isPercentage: false },
    { label: "Corners", home: 5, away: 2, isPercentage: false },
    { label: "Fouls", home: 9, away: 12, isPercentage: false },
    { label: "Yellow Cards", home: 1, away: 2, isPercentage: false },
  ]

  const stats = match?.statistics || DEFAULT_STATS

  return (
    <div className="w-full bg-[#0A0A0A]/60 backdrop-blur-md border border-white/5 rounded-xl p-6 h-full flex flex-col">
      <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider mb-6 pb-4 border-b border-white/5">Team Statistics</h3>
      
      <div className="flex-1 flex flex-col justify-center gap-6">
        {stats.map((stat: any, i: number) => (
          <div key={i} className="flex flex-col gap-2">
            
            <div className="flex justify-between items-center px-1">
              <span className="text-sm font-bold text-white">{stat.home}{stat.isPercentage ? "%" : ""}</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">{stat.label}</span>
              <span className="text-sm font-bold text-white">{stat.away}{stat.isPercentage ? "%" : ""}</span>
            </div>

            <div className="flex w-full h-1.5 rounded-full overflow-hidden bg-white/5">
              {/* Home Bar (Left) */}
              <div 
                className="h-full flex-1 flex justify-end bg-transparent"
              >
                <div 
                  className={`h-full ${stat.home >= stat.away ? 'bg-primary' : 'bg-white/30'}`}
                  style={{ width: `${((stat.home || 1) / ((stat.home || 1) + (stat.away || 1))) * 100}%` }}
                ></div>
              </div>
              
              <div className="w-0.5 h-full bg-[#050505]"></div>

              {/* Away Bar (Right) */}
              <div 
                className="h-full flex-1 flex justify-start bg-transparent"
              >
                <div 
                  className={`h-full ${stat.away >= stat.home ? 'bg-blue-500' : 'bg-white/30'}`}
                  style={{ width: `${((stat.away || 1) / ((stat.home || 1) + (stat.away || 1))) * 100}%` }}
                ></div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}
