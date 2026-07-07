import { PtnNavbar } from "@/shared/components/ptn-navbar"
import { PtnFooter } from "@/shared/components/ptn-footer"
import { Swords } from "lucide-react"

export default function TournamentRulesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <PtnNavbar />
      <div className="h-20 w-full" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <span className="text-primary font-bold tracking-wider uppercase text-sm">Rules</span>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-white uppercase tracking-tight">Tournament Rules</h1>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-8">Last updated: July 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">1. Team Composition</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Each team must consist of exactly 5 players.</li>
              <li>All player names must be provided at the time of registration.</li>
              <li>Player substitutions are not allowed after registration is submitted.</li>
              <li>Each player can only be registered with one team per tournament.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">2. Registration & Payment</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>All registrations must be completed through the official Play To Network platform.</li>
              <li>Payment must be made via UPI to the provided UPI ID before the registration deadline.</li>
              <li>A clear payment screenshot showing the transaction details must be uploaded.</li>
              <li>Payment verification is required for registration to be approved.</li>
              <li>Fake or manipulated payment proofs will lead to immediate disqualification without refund.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">3. Match Format</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Match format will be communicated prior to the tournament start date.</li>
              <li>Fixture schedules will be released after the registration deadline.</li>
              <li>Teams must report to the venue at the scheduled time.</li>
              <li>Late arrivals may result in forfeiture of the match.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">4. Code of Conduct</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>All players must maintain sportsmanlike conduct at all times.</li>
              <li>Abusive language, violence, or unsportsmanlike behaviour will result in immediate disqualification.</li>
              <li>Decisions made by match officials and tournament organizers are final.</li>
              <li>Any form of cheating, match-fixing, or collusion is strictly prohibited and will result in a ban from future events.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">5. Organizer Authority</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Organizer decisions are final for all tournament operations.</li>
              <li>Organizers reserve the right to modify rules, schedules, or formats as necessary.</li>
              <li>Any disputes must be raised with the organizers immediately.</li>
              <li>Failure to comply with organizer instructions may result in disqualification.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">6. Liability</h2>
            <p>Play To Network and tournament organizers are not responsible for any injuries, loss, or damage incurred during participation. Players participate at their own risk. By registering, participants agree to this liability waiver.</p>
          </section>
        </div>
      </div>
      <PtnFooter />
    </main>
  )
}
