import { Check } from "lucide-react"

export function TournamentStatusBanner({ currentStage }: { currentStage: "Registration" | "Groups" | "Knockouts" | "Final" | "Completed" }) {
  
  const stages = ["Registration", "Groups", "Knockouts", "Final"]
  const currentIndex = stages.indexOf(currentStage) === -1 && currentStage === "Completed" ? 4 : stages.indexOf(currentStage)

  return (
    <div className="w-full bg-[#0A0A0A]/60 backdrop-blur-md border-b border-white/5 py-6">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">Current Stage</span>
          <span className="px-3 py-1 rounded bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest text-white">
            {currentStage}
          </span>
        </div>

        {/* Timeline Progress */}
        <div className="flex-1 w-full max-w-2xl">
          <div className="relative flex items-center justify-between">
            {/* Connecting Line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-white/10 z-0"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-primary z-0 transition-all duration-1000"
              style={{ width: `${(Math.min(currentIndex, 3) / 3) * 100}%` }}
            >
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary/20 blur-md rounded-full"></div>
            </div>

            {stages.map((stage, index) => {
              const isCompleted = index < currentIndex || currentStage === "Completed"
              const isActive = index === currentIndex

              return (
                <div key={stage} className="relative z-10 flex flex-col items-center gap-2 group">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted ? "bg-primary border-primary text-black" :
                    isActive ? "bg-[#050505] border-primary shadow-[0_0_15px_rgba(0,230,118,0.5)]" :
                    "bg-[#050505] border-white/20"
                  }`}>
                    {isCompleted && <Check className="w-2.5 h-2.5" />}
                  </div>
                  <span className={`absolute top-6 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                    isActive ? "text-primary" :
                    isCompleted ? "text-white/80" : "text-white/30"
                  }`}>
                    {stage}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
