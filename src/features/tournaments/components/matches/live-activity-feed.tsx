import { Activity } from "lucide-react"

export function LiveActivityFeed({ match }: { match?: any }) {
  const DEFAULT_FEED = [
    { min: "67'", type: "comment", text: "Titans dominating possession in the midfield, looking for a third." },
    { min: "65'", type: "sub", text: "Substitution Warriors: M. Anderson off, J. Davis on." },
    { min: "58'", type: "goal", text: "GOAL! M. Kumar converts from close range after a brilliant cross. Titans 2 - 1 Warriors" },
    { min: "45'", type: "goal", text: "GOAL! K. Patel scores the equalizer just before halftime! Titans 1 - 1 Warriors" },
    { min: "34'", type: "yellow", text: "Yellow card for R. Sharma for a cynical foul." },
    { min: "22'", type: "comment", text: "Titans hitting the post! Great strike from V. Kohli." },
    { min: "12'", type: "goal", text: "GOAL! A. Singh opens the scoring early for the away side! Titans 0 - 1 Warriors" },
    { min: "1'", type: "comment", text: "Kickoff! The referee blows the whistle and we are underway." },
  ]

  const feed = match?.activity_feed || DEFAULT_FEED

  return (
    <div className="w-full bg-[#0A0A0A]/60 backdrop-blur-md border border-white/5 rounded-xl p-6 h-full flex flex-col">
      <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider mb-6 pb-4 border-b border-white/5 flex items-center gap-2">
        <Activity className="w-4 h-4 text-primary" /> Live Updates
      </h3>

      {feed.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/5 rounded-xl">
          <Activity className="w-8 h-8 text-white/20 mb-2" />
          <span className="text-xs font-bold text-white/40 uppercase tracking-widest">No updates yet</span>
        </div>
      ) : (
        <div className="flex-1 space-y-5 relative overflow-y-auto max-h-[600px] pr-2">
          <div className="absolute left-[13px] top-2 bottom-2 w-px bg-white/5"></div>

          {feed.map((item: any, i: number) => (
            <div key={i} className="relative pl-10 group">
              <div className={`absolute left-0 top-0.5 w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold z-10 ${
                item.type === 'goal' ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.5)]' :
                item.type === 'yellow' ? 'bg-yellow-400 text-black' :
                item.type === 'sub' ? 'bg-blue-500 text-white' :
                'bg-[#050505] text-white/50 border border-white/10 group-hover:border-primary group-hover:text-primary transition-colors'
              }`}>
                {item.min}
              </div>
              
              <p className={`text-sm leading-relaxed pt-1 ${
                item.type === 'goal' ? 'font-bold text-white' : 'text-white/70'
              }`}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
