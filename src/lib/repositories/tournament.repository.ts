import { SupabaseClient } from '@supabase/supabase-js'
import { EVENT_CONFIG } from '@/lib/config/event'

export interface TournamentData {
  id?: string
  title: string
  sport: string
  location: string
  start_date: string
  end_date: string
  registration_status: 'Live' | 'Closed' | 'Upcoming'
  team_count: number
  max_teams: number
  current_stage: string
  prize_pool?: string
  description?: string
  created_at?: string
  about_tournament?: string
  rules?: any
  faqs?: any
  contacts?: any
  guidelines?: any
  tournament_format?: any
  checklist?: any
  brochure_url?: string
}

export const TournamentRepository = {
  async getTournaments(supabase: SupabaseClient): Promise<TournamentData[]> {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data || []).map((t: any) => {
      if (t.id === '8681b997-c81b-4395-89f4-2792e3be75e5') {
        return {
          ...t,
          location: "Delhi (Near Metro Routes)",
          start_date: EVENT_CONFIG.eventDate,
          end_date: EVENT_CONFIG.eventDate,
          brochure_url: "/brochure/mini-fifa-world-cup-2026.pdf"
        }
      }
      return t
    })
  },
  
  async getTournamentById(supabase: SupabaseClient, id: string): Promise<TournamentData | null> {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', id)
      .single()
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    if (data && id === '8681b997-c81b-4395-89f4-2792e3be75e5') {
      return {
        ...data,
        location: "Delhi (Near Metro Routes)",
        start_date: "July 19, 2026",
        end_date: "July 19, 2026",
        brochure_url: "/brochure/mini-fifa-world-cup-2026.pdf",
        about_tournament: {
          what_is_mini_fifa: "Mini FIFA is an elite 5v5 offline football tournament designed to capture the intensity and excitement of the FIFA World Cup on a compact scale.",
          ptn_vision: "Play To Network envisions creating an ecosystem where amateur athletes can showcase their talents, connect with fellow players, and build professional networks through competitive sports.",
          tournament_objective: "The Mini FIFA World Cup 2026 is more than just a football tournament. It is an initiative to bring together football lovers from across Delhi, encourage healthy competition, and create a vibrant sporting community through the spirit of the beautiful game.",
          who_can_participate: "Open to all amateur football players, college students, corporate teams, and football enthusiasts. Professional players are excluded to maintain fair play."
        },
        rules: [
          {
            category: "Team Composition",
            items: [
              "Each team shall consist of 5 players (NO SUBSTITUTES).",
              "Each player may represent only one team throughout the tournament.",
              "A player cannot be registered for multiple teams."
            ]
          },
          {
            category: "Registration & Fees",
            items: [
              "Registration Fee: A total of Rs. 3000 for each team which is ₹600 per player.",
              "Individual registrations are also accepted (₹600 per player). Teams will be formed by the organizers if sufficient individual registrations are received.",
              "A team's registration will be confirmed only after the complete registration fee has been received.",
              "Early registration increases the chances of securing your preferred nation."
            ]
          },
          {
            category: "National Team Selection",
            items: [
              "Participants will represent football nations during the tournament.",
              "Favourite national teams will be allotted strictly on a first-come, first-serve basis.",
              "If a preferred nation has already been allotted to another team, the organizers will provide an alternative from the remaining available nations.",
              "For individual registrations, allocation of national team will be random depending on available teams and majority priority."
            ]
          },
          {
            category: "Tournament Structure",
            items: [
              "The tournament begins with a league stage, not with direct knockout matches, ensuring that every team gets sufficient opportunity to compete before the elimination rounds begin.",
              "This format has been adopted to reduce the impact of unlucky eliminations and provide every participant with a fair tournament experience.",
              "The exact tournament structure, including the number of groups, fixtures, and qualification process, will depend upon the total number of confirmed registrations."
            ]
          },
          {
            category: "Match Rules & Officiating",
            items: [
              "The tournament will follow the basic rules of football with necessary modifications suitable for a 5v5 format.",
              "The referee's decision during a match shall be final and binding.",
              "The detailed conduct of each match, including playing time, procedures, and disciplinary actions, will be determined by the organizing team before the commencement."
            ]
          },
          {
            category: "Code of Conduct",
            items: [
              "Every participant is expected to uphold the spirit of sportsmanship throughout the tournament.",
              "All players are requested to respect referees, opponents, organizers, and volunteers, and maintain discipline.",
              "Arrive on time for scheduled matches. Late arrival can lead to straight disqualification.",
              "Avoid abusive language, offensive behaviour, or unsporting conduct. Help maintain cleanliness at the venue.",
              "The organizers reserve the right to issue warnings, suspend, or disqualify any participant whose behaviour is considered inappropriate."
            ]
          },
          {
            category: "Refund Policy",
            items: [
              "Registration fees are non-refundable unless the tournament is cancelled by the organizers.",
              "For individual registrations, the registration fee will be fully refunded only in case of failure of formation of a team."
            ]
          },
          {
            category: "Organizing Committee's Decision",
            items: [
              "In situations involving tournament management, disciplinary matters, scheduling, interpretation of rules, or unforeseen circumstances, the decision of the Organizing Committee shall be final and cannot be challenged.",
              "The organizers reserve the right to modify fixtures, schedules, or tournament arrangements if required for the smooth conduct of the event."
            ]
          }
        ],
        faqs: [
          {
            question: "Can I register individually?",
            answer: "Yes, players who do not have a complete team may register individually. If sufficient individual registrations are received, teams will be formed by the organizers."
          },
          {
            question: "Will I get a refund if a team is not formed?",
            answer: "Yes, for individual registrations, the registration fee will be fully refundable only in case of failure of formation of a team. No requests for changes in allotted teams will be entertained."
          },
          {
            question: "How are national teams allocated?",
            answer: "For teams, preferred national teams are allotted strictly on a first-come, first-served basis. For individuals, allocation of the national team will be random depending on available teams and majority priority of other team members."
          },
          {
            question: "Are substitutes allowed?",
            answer: "No, each team must consist of exactly 5 players and no substitutes are allowed."
          },
          {
            question: "When and where is the tournament?",
            answer: `The tournament is on Sunday, ${EVENT_CONFIG.eventDateFaq} at Delhi (near metro routes for easy accessibility). Reach the venue at least 30 minutes before your scheduled match.`
          }
        ],
        contacts: {
          email: "contact@playtonetwork.com",
          phones: [
            "8766284161 (Pratham Jain)",
            "9810130848 (Harshit Verma)"
          ],
          website: "playtonetwork.com",
          instagram: "@playtonetwork",
          organizer: "Play To Network"
        },
        guidelines: [
          "Reach the venue at least 30 minutes before your scheduled match.",
          "Carefully listen to the briefing provided by the organizing team before the tournament begins.",
          "Follow all instructions issued by referees and Organizers.",
          "Fixtures and match timings will be shared with all registered participants after registrations close.",
          "The tournament format may vary depending on the total number of confirmed registrations.",
          "The opening stage of the tournament will not be a direct knockout round, ensuring every team receives a fair opportunity to compete."
        ],
        checklist: [
          "Comfortable football shoes or suitable sports footwear",
          "A water bottle to stay hydrated",
          "Food for Lunch and snacks",
          "Comfortable sportswear",
          "A valid identity proof (if requested by the organizers)",
          "Any personal medication you may require"
        ]
      }
    }
    return data
  },
  
  async createTournament(supabase: SupabaseClient, tournamentData: TournamentData): Promise<TournamentData> {
    const { data, error } = await supabase
      .from('tournaments')
      .insert(tournamentData)
      .select()
      .single()
    if (error) throw error
    return data
  }
}