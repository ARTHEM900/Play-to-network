export interface TeamCardProps {
  id: string
  name: string
  captain: string
  players: number
  group?: string
}

export function TeamCard({ name, captain, players, group }: TeamCardProps) {
  return (
    <div className="bg-[#0A0A0A]/40 backdrop-blur-md border border-white/5 rounded-xl p-5 hover:border-white/10 hover:bg-[#0A0A0A]/60 transition-all cursor-pointer group flex flex-col items-center text-center">
      
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
        <span className="text-xl font-heading font-black text-white/50">{name.substring(0,2).toUpperCase()}</span>
      </div>

      <h4 className="text-base font-bold text-white mb-1 group-hover:text-primary transition-colors">{name}</h4>
      
      {group && (
        <span className="px-2 py-0.5 rounded border border-white/10 text-[10px] uppercase font-bold tracking-widest text-white/40 mb-4">
          Group {group}
        </span>
      )}

      <div className="w-full pt-4 border-t border-white/5 mt-auto flex justify-between items-center text-xs text-white/50">
        <div className="flex flex-col items-start">
          <span className="text-[9px] uppercase font-bold tracking-widest text-white/30">Captain</span>
          <span className="font-medium text-white/70">{captain}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[9px] uppercase font-bold tracking-widest text-white/30">Squad</span>
          <span className="font-medium text-white/70">{players} Players</span>
        </div>
      </div>
    </div>
  )
}
