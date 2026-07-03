export function MatchTimeline({ match }: { match?: any }) {
  const DEFAULT_EVENTS = [
    { minute: 12, type: "goal", team: "away", player: "A. Singh" },
    { minute: 34, type: "yellow", team: "home", player: "R. Sharma" },
    { minute: 45, type: "goal", team: "home", player: "K. Patel" },
    { minute: 58, type: "goal", team: "home", player: "M. Kumar" },
  ]

  const timelineEvents = match?.timeline || DEFAULT_EVENTS
  const matchTimeStr = match?.match_time || "67'"
  const currentMinute = parseInt(matchTimeStr) || 67

  return (
    <div className="w-full bg-[#0A0A0A]/60 backdrop-blur-md border border-white/5 rounded-xl p-6 mb-8 flex flex-col items-center">
      <div className="w-full max-w-4xl relative h-16 flex items-center">
        
        {/* Background Line */}
        <div className="absolute left-0 right-0 h-1 bg-white/10 rounded-full"></div>
        
        {/* Progress Line */}
        <div 
          className="absolute left-0 h-1 bg-primary rounded-full transition-all duration-1000"
          style={{ width: `${Math.min(100, (currentMinute / 90) * 100)}%` }}
        ></div>

        {/* Half-time marker */}
        <div className="absolute left-[50%] top-1/2 -translate-y-1/2 w-1 h-3 bg-white/30"></div>

        {/* Events */}
        {timelineEvents.map((event: any, i: number) => (
          <div 
            key={i}
            className="absolute top-1/2 -translate-y-1/2 group cursor-pointer"
            style={{ left: `${Math.min(100, (event.minute / 90) * 100)}%` }}
          >
            <div className={`w-3.5 h-3.5 rounded-full border-2 border-[#050505] flex items-center justify-center z-10 relative ${
              event.type === 'goal' ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 
              event.type === 'yellow' ? 'bg-yellow-400' : 'bg-red-500'
            }`}></div>
            
            {/* Tooltip */}
            <div className={`absolute opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-max ${
              event.team === 'home' ? 'bottom-full mb-2 -translate-x-1/2' : 'top-full mt-2 -translate-x-1/2'
            }`}>
              <div className="bg-black/90 border border-white/10 rounded px-3 py-1.5 flex flex-col items-center backdrop-blur-md">
                <span className="text-[10px] font-bold text-white">{event.minute}' {event.player}</span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-white/50">{event.type}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Current Time Indicator */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#050505] border-2 border-primary rounded-full z-20 flex items-center justify-center shadow-[0_0_15px_rgba(0,230,118,0.5)]"
          style={{ left: `${Math.min(100, (currentMinute / 90) * 100)}%` }}
        >
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
        </div>

      </div>
      
      <div className="w-full max-w-4xl flex justify-between mt-2 px-1">
        <span className="text-[10px] font-bold text-white/40 tracking-widest">0'</span>
        <span className="text-[10px] font-bold text-white/40 tracking-widest">45'</span>
        <span className="text-[10px] font-bold text-white/40 tracking-widest">90'</span>
      </div>
    </div>
  )
}
