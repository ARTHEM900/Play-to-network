import { Trophy, Activity, Users, Star, MapPin, Calendar, Clock, Coins, CheckCircle2, Phone, Download } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { TournamentRepository } from "@/lib/repositories/tournament.repository"
import { MatchRepository } from "@/lib/repositories/match.repository"
import { Button } from "@/shared/components/ui/button"
import Link from "next/link"
import { FaqAccordion } from "./faq-accordion"

const NATIONS_LIST = [
  { name: "Portugal", flag: "🇵🇹" },
  { name: "Argentina", flag: "🇦🇷" },
  { name: "Brazil", flag: "🇧🇷" },
  { name: "France", flag: "🇫🇷" },
  { name: "Spain", flag: "🇪🇸" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Norway", flag: "🇳🇴" },
  { name: "Netherlands", flag: "🇳🇱" },
  { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { name: "USA", flag: "🇺🇸" },
  { name: "Mexico", flag: "🇲🇽" },
  { name: "Japan", flag: "🇯🇵" }
]

export async function OverviewSection({ tournamentId }: { tournamentId?: string }) {
  let stats = {
    prizePool: "TBD",
    teamCount: 0,
    groups: 0,
    matches: 0,
    description: "Loading tournament details..."
  }
  let activityFeed: Array<{ time: string; text: string; type: string }> = []
  let tournament: any = null
  let aboutTournament: any = null
  let tournamentFormat: any = null
  let faqs: any[] = []
  let contacts: any = null
  let checklist: string[] = []
  let brochureUrl: string = ""

  let assignedNations = new Set<string>()
  let reservedNations = new Set<string>()

  if (tournamentId) {
    try {
      const supabase = await createClient()
      tournament = await TournamentRepository.getTournamentById(supabase, tournamentId)
      if (tournament) {
        try {
          aboutTournament = typeof tournament.about_tournament === 'string' ? JSON.parse(tournament.about_tournament) : tournament.about_tournament;
        } catch(e) {}
        try {
          tournamentFormat = typeof tournament.tournament_format === 'string' ? JSON.parse(tournament.tournament_format) : tournament.tournament_format;
        } catch(e) {}
        try {
          faqs = typeof tournament.faqs === 'string' ? JSON.parse(tournament.faqs) : (Array.isArray(tournament.faqs) ? tournament.faqs : []);
        } catch(e) {}
        try {
          contacts = typeof tournament.contacts === 'string' ? JSON.parse(tournament.contacts) : tournament.contacts;
        } catch(e) {}
        try {
          checklist = typeof tournament.checklist === 'string' ? JSON.parse(tournament.checklist) : (Array.isArray(tournament.checklist) ? tournament.checklist : []);
        } catch(e) {}
        brochureUrl = tournament.brochure_url || "";

        const [matches, { count }, { data: regsData }] = await Promise.all([
          MatchRepository.getMatchesByTournament(supabase, tournamentId),
          supabase
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .eq('tournament_id', tournamentId),
          supabase
            .from('registrations')
            .select(`
              registration_status,
              teams (
                team_name
              )
            `)
            .eq('tournament_id', tournamentId)
        ])
          
        regsData?.forEach((r: any) => {
          const tName = r.teams?.team_name || ''
          const status = r.registration_status
          
          const match = tName.match(/\(([^)]+)\)/)
          if (match) {
            const nation = match[1].trim()
            if (status === 'Approved') {
              assignedNations.add(nation)
            } else if (status === 'Pending') {
              reservedNations.add(nation)
            }
          }
        })

        const teamCount = count || tournament.current_teams || 0

        stats = {
          prizePool: tournament.prize_pool || "TBD",
          teamCount,
          groups: Math.ceil(teamCount / 4) || 0,
          matches: matches ? matches.length : 0,
          description: tournament.description || "No description available for this tournament."
        }

        if (matches && matches.length > 0) {
          const completedMatches = matches.filter((m: any) => m.status === "Completed").slice(-3)
          activityFeed = completedMatches.map((m: any) => {
            const timeAgo = m.match_date === "Today" ? "2 hours ago" : m.match_date === "Yesterday" ? "1 day ago" : "Recently"
            return {
              time: timeAgo,
              text: `Match completed: ${m.team1_name ?? m.team1?.name} ${m.team1_score ?? m.team1?.score}-${m.team2_score ?? m.team2?.score} ${m.team2_name ?? m.team2?.name}`,
              type: "match"
            }
          })
          if (activityFeed.length === 0) {
            activityFeed = [
              { time: "System", text: "Tournament scheduled. Awaiting match updates.", type: "system" }
            ]
          }
        }
      }
    } catch (error) {
      console.error("Failed to load overview data from Supabase:", error)
      activityFeed = []
    }
  }

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8">
      
      {/* Left Column: Stats & Info */}
      <div className="flex-1 space-y-8">
        
        {/* Stat Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#0A0A0A]/40 backdrop-blur-sm border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="text-3xl font-heading font-black text-white">{stats.prizePool}</span>
            <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Prize Pool</span>
          </div>
          <div className="bg-[#0A0A0A]/40 backdrop-blur-sm border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center gap-2">
            <Users className="w-5 h-5 text-white/70" />
            <span className="text-3xl font-heading font-black text-white">{stats.teamCount}</span>
            <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Teams</span>
          </div>
          <div className="bg-[#0A0A0A]/40 backdrop-blur-sm border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-3xl font-heading font-black text-white">{stats.groups}</span>
            <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Groups</span>
          </div>
          <div className="bg-[#0A0A0A]/40 backdrop-blur-sm border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center gap-2">
            <Activity className="w-5 h-5 text-red-500" />
            <span className="text-3xl font-heading font-black text-white">{stats.matches}</span>
            <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Matches</span>
          </div>
        </div>

        {/* Description / About */}
        <div className="bg-[#0A0A0A]/60 backdrop-blur-md border border-white/5 rounded-xl p-6 sm:p-8">
          <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-4">About Tournament</h3>
          <p className="text-white/70 leading-relaxed text-sm whitespace-pre-line">
            {stats.description}
          </p>
        </div>

        {/* --- Brochure Enhancements Start --- */}

        {/* About the Tournament Card */}
        {aboutTournament && (
          <div className="bg-[#0A0A0A]/60 backdrop-blur-md border border-white/5 rounded-xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wider border-b border-white/10 pb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              About the Tournament
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {aboutTournament.what_is_mini_fifa && (
                <div className="space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-xs text-primary">What is Mini FIFA</h4>
                  <p className="text-white/60 leading-relaxed">{aboutTournament.what_is_mini_fifa}</p>
                </div>
              )}
              {aboutTournament.ptn_vision && (
                <div className="space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-xs text-primary">Play To Network's Vision</h4>
                  <p className="text-white/60 leading-relaxed">{aboutTournament.ptn_vision}</p>
                </div>
              )}
              {aboutTournament.tournament_objective && (
                <div className="space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-xs text-primary">Tournament Objective</h4>
                  <p className="text-white/60 leading-relaxed">{aboutTournament.tournament_objective}</p>
                </div>
              )}
              {aboutTournament.who_can_participate && (
                <div className="space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-xs text-primary">Who Can Participate</h4>
                  <p className="text-white/60 leading-relaxed">{aboutTournament.who_can_participate}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tournament Information Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">Tournament Information</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-[#0A0A0A]/40 backdrop-blur-sm border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 text-center">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-white leading-tight">{tournament?.location || "Delhi, India"}</span>
              <span className="text-[9px] uppercase font-bold text-white/40 tracking-wider">Venue</span>
            </div>
            <div className="bg-[#0A0A0A]/40 backdrop-blur-sm border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 text-center">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-white leading-tight">
                {tournament?.start_date && tournament?.end_date 
                  ? `${tournament.start_date} - ${tournament.end_date}`
                  : "July 19, 2026"}
              </span>
              <span className="text-[9px] uppercase font-bold text-white/40 tracking-wider">Date</span>
            </div>
            <div className="bg-[#0A0A0A]/40 backdrop-blur-sm border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 text-center">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-white leading-tight">09:00 AM</span>
              <span className="text-[9px] uppercase font-bold text-white/40 tracking-wider">Reporting Time</span>
            </div>
            <div className="bg-[#0A0A0A]/40 backdrop-blur-sm border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 text-center">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-white leading-tight">{tournament?.format || "5 vs 5"}</span>
              <span className="text-[9px] uppercase font-bold text-white/40 tracking-wider">Format</span>
            </div>
            <div className="bg-[#0A0A0A]/40 backdrop-blur-sm border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 text-center">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-white leading-tight">{tournament?.max_teams || 12} Teams</span>
              <span className="text-[9px] uppercase font-bold text-white/40 tracking-wider">Max Teams</span>
            </div>
            <div className="bg-[#0A0A0A]/40 backdrop-blur-sm border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 text-center">
              <Coins className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-white leading-tight">{tournament?.prize_pool || "₹10,000"}</span>
              <span className="text-[9px] uppercase font-bold text-white/40 tracking-wider">Prize Pool</span>
            </div>
            <div className="bg-[#0A0A0A]/40 backdrop-blur-sm border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 text-center">
              <Coins className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-white leading-tight">₹{tournament?.entry_fee_team ?? 3000}</span>
              <span className="text-[9px] uppercase font-bold text-white/40 tracking-wider">Team Registration Fee</span>
            </div>
            <div className="bg-[#0A0A0A]/40 backdrop-blur-sm border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 text-center">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-white leading-tight">₹{tournament?.entry_fee_individual ?? 600}</span>
              <span className="text-[9px] uppercase font-bold text-white/40 tracking-wider">Individual Fee</span>
            </div>
            <div className="bg-[#0A0A0A]/40 backdrop-blur-sm border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 text-center">
              <Activity className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-white leading-tight">{tournament?.status || "Registration Open"}</span>
              <span className="text-[9px] uppercase font-bold text-white/40 tracking-wider">Registration Status</span>
            </div>
          </div>
        </div>

        {/* Enhanced Registration Details Section */}
        <div className="bg-[#0A0A0A]/60 backdrop-blur-md border border-white/5 rounded-xl p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wider border-b border-white/10 pb-4">Registration Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white uppercase tracking-wider text-xs">Team Registration</h4>
                <span className="px-2.5 py-1 text-xs font-bold bg-primary/10 text-primary border border-primary/20 rounded">₹{tournament?.entry_fee_team ?? 3000} per Team</span>
              </div>
              <p className="text-xs text-white/40">Register a full team with 5 players (5 Players).</p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white uppercase tracking-wider text-xs">Individual Registration</h4>
                <span className="px-2.5 py-1 text-xs font-bold bg-primary/10 text-primary border border-primary/20 rounded">₹{tournament?.entry_fee_individual ?? 600} per Player</span>
              </div>
              <p className="text-xs text-white/40">Register as an individual and get assigned to a team.</p>
            </div>
          </div>
          <div className="space-y-3 pt-2 text-xs text-white/60">
            <p><strong className="text-white">Registration Process:</strong> Enter candidate details, select preferred team type (team or individual), upload payment screenshot, and submit. The Play To Network team will review and approve.</p>
            <p><strong className="text-white">Refund Policy:</strong> Roster payments and registration fees are non-refundable unless the tournament is cancelled by the organizers.</p>
            <p><strong className="text-white">National Team Selection:</strong> Teams choose national representations during registration, allocated first-come, first-served.</p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link href={`/register${tournamentId ? `?tournamentId=${tournamentId}` : ''}`} prefetch={true} className="flex-1">
              <Button className="w-full h-12 bg-primary text-black font-bold uppercase tracking-wider hover:bg-primary/90 transition-all rounded-md">
                Register Now
              </Button>
            </Link>
            {brochureUrl && (
              <a href={brochureUrl} download className="flex-1">
                <Button variant="outline" className="w-full h-12 border-white/10 hover:bg-white/5 transition-all text-white font-bold uppercase tracking-wider rounded-md">
                  <Download className="mr-2 h-4.5 w-4.5 text-primary" />
                  Download Brochure
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Tournament Format Card */}
        {tournamentFormat && (
          <div className="bg-[#0A0A0A]/60 backdrop-blur-md border border-white/5 rounded-xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wider border-b border-white/10 pb-4">Tournament Format</h3>
            <div className="space-y-4 text-sm">
              {tournamentFormat.league_stage && (
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider text-xs text-primary mb-1">League Stage</h4>
                  <p className="text-white/60 leading-relaxed">{tournamentFormat.league_stage}</p>
                </div>
              )}
              {tournamentFormat.knockout_stage && (
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider text-xs text-primary mb-1">Knockout Stage</h4>
                  <p className="text-white/60 leading-relaxed">{tournamentFormat.knockout_stage}</p>
                </div>
              )}
              {tournamentFormat.final && (
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider text-xs text-primary mb-1">Final</h4>
                  <p className="text-white/60 leading-relaxed">{tournamentFormat.final}</p>
                </div>
              )}
              {tournamentFormat.qualification_rules && (
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider text-xs text-primary mb-1">Qualification Rules</h4>
                  <p className="text-white/60 leading-relaxed">{tournamentFormat.qualification_rules}</p>
                </div>
              )}
              {tournamentFormat.match_duration && (
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider text-xs text-primary mb-1">Match Duration</h4>
                  <p className="text-white/60 leading-relaxed">{tournamentFormat.match_duration}</p>
                </div>
              )}
              {tournamentFormat.tie_break_rules && (
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider text-xs text-primary mb-1">Tie-break Rules</h4>
                  <p className="text-white/60 leading-relaxed">{tournamentFormat.tie_break_rules}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Checklist Card */}
        {checklist && checklist.length > 0 && (
          <div className="bg-[#0A0A0A]/60 backdrop-blur-md border border-white/5 rounded-xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wider border-b border-white/10 pb-4">Tournament Day Checklist</h3>
            <p className="text-xs text-white/55">Players should ensure they bring the following and adhere to arrival guidelines:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {checklist.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-sm text-white/80">
                  <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* FAQ Section */}
        {faqs && faqs.length > 0 && <FaqAccordion faqs={faqs} />}

        {/* Downloads */}
        {brochureUrl && (
          <div className="bg-[#0A0A0A]/60 backdrop-blur-md border border-white/5 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-bold text-white uppercase tracking-wider text-sm">Official Brochure</h4>
              <p className="text-xs text-white/45">Download the complete tournament details, schedule, and rules.</p>
            </div>
            <a href={brochureUrl} download className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto h-11 border-white/10 hover:bg-white/5 transition-all text-white font-bold uppercase tracking-wider">
                <Download className="mr-2 h-4 w-4 text-primary" />
                Download Brochure
              </Button>
            </a>
          </div>
        )}

        {/* Visual Football Nations Grid */}
        <div className="bg-[#0A0A0A]/60 backdrop-blur-md border border-white/5 rounded-xl p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wider border-b border-white/10 pb-4">
            Football Nations Allocation
          </h3>
          <p className="text-xs text-white/55">
            Teams represent actual football nations during the tournament. Nations are allocated on a first-come, first-served basis:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
            {NATIONS_LIST.map((n) => {
              const status = assignedNations.has(n.name) 
                ? "Assigned" 
                : reservedNations.has(n.name) 
                  ? "Reserved" 
                  : "Available"
              
              const badgeStyle = status === "Assigned"
                ? "bg-red-500/10 text-red-400 border-red-500/20"
                : status === "Reserved"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-primary/10 text-primary border-primary/20"

              return (
                <div key={n.name} className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex flex-col items-center justify-center gap-2 text-center group hover:border-white/10 transition-all duration-300">
                  <span className="text-3xl filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.05)]">{n.flag}</span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{n.name}</span>
                  <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${badgeStyle}`}>
                    {status}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Contact Section */}
        {contacts && (
          <div className="bg-[#0A0A0A]/60 backdrop-blur-md border border-white/5 rounded-xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wider border-b border-white/10 pb-4">Organizer Contact</h3>
            <div className="space-y-4 text-sm text-white/70">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <span className="font-semibold text-white/90">Pratham Jain</span>
                  <br />
                  <a href="tel:+918766284161" className="text-white/70 hover:text-primary transition-colors">+91 87662 84161</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <span className="font-semibold text-white/90">Harshit Verma</span>
                  <br />
                  <a href="tel:+919810130848" className="text-white/70 hover:text-primary transition-colors">+91 98101 30848</a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Brochure Enhancements End --- */}

      </div>

      {/* Right Column: Activity Feed */}
      <div className="w-full lg:w-[400px]">
        <div className="bg-[#0A0A0A]/60 backdrop-blur-md border border-white/5 rounded-xl p-6 h-full flex flex-col">
          <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Live Activity Feed
          </h3>

          {activityFeed.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/5 rounded-xl min-h-[200px]">
              <Activity className="w-8 h-8 text-white/20 mb-2" />
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest">No activity log</span>
            </div>
          ) : (
            <div className="flex-1 space-y-6 relative">
              {/* Timeline Line */}
              <div className="absolute left-2.5 top-2 bottom-2 w-px bg-white/5"></div>

              {activityFeed.map((item, i) => (
                <div key={i} className="relative pl-8 group cursor-default">
                  {/* Timeline Dot */}
                  <div className={`absolute left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border border-[#050505] z-10 ${
                    item.type === 'match' ? 'bg-primary shadow-[0_0_10px_rgba(0,230,118,0.5)]' :
                    item.type === 'team' ? 'bg-white/80' : 'bg-white/20'
                  }`}></div>
                  
                  <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1.5">{item.time}</div>
                  <div className="text-sm text-white/80 font-medium leading-snug group-hover:text-white transition-colors">
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
