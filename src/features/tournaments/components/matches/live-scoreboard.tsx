export function LiveScoreboard({ match }: { match?: any }) {
  const team1Name = match?.team1_name || match?.team1?.name || "FC Titans"
  const team2Name = match?.team2_name || match?.team2?.name || "Warriors"
  const team1Initials = team1Name.substring(0, 2).toUpperCase()
  const team2Initials = team2Name.substring(0, 2).toUpperCase()
  const score1 = match?.team1_score !== undefined && match?.team1_score !== null ? match.team1_score : "-"
  const score2 = match?.team2_score !== undefined && match?.team2_score !== null ? match.team2_score : "-"
  const matchTime = match?.match_time || "0'"

  return (
    <div className="w-full bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-10 mb-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

      <div className="flex items-center justify-between relative z-10">
        
        {/* Home Team */}
        <div className="flex flex-col items-center gap-4 w-1/3">
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-[#050505] border border-white/10 flex items-center justify-center shadow-xl">
            <span className="text-3xl sm:text-5xl font-heading font-black text-white/80">{team1Initials}</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-white text-center">{team1Name}</h2>
          <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] uppercase font-bold tracking-widest text-white/50">Home</span>
        </div>

        {/* Score & Time */}
        <div className="flex flex-col items-center justify-center w-1/3">
          <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-red-500 mb-2 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full animate-pulse">
            {matchTime}
          </div>
          <div className="flex items-center gap-4 sm:gap-8">
            <span className="text-5xl sm:text-8xl font-heading font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{score1}</span>
            <span className="text-3xl sm:text-5xl font-heading font-black text-white/20">-</span>
            <span className="text-5xl sm:text-8xl font-heading font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{score2}</span>
          </div>
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center gap-4 w-1/3">
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-[#050505] border border-white/10 flex items-center justify-center shadow-xl">
            <span className="text-3xl sm:text-5xl font-heading font-black text-white/80">{team2Initials}</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-white text-center">{team2Name}</h2>
          <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] uppercase font-bold tracking-widest text-white/50">Away</span>
        </div>

      </div>
    </div>
  )
}
