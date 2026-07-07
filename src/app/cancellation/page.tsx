import { PtnNavbar } from "@/shared/components/ptn-navbar"
import { PtnFooter } from "@/shared/components/ptn-footer"
import { XCircle } from "lucide-react"

export default function CancellationPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <PtnNavbar />
      <div className="h-20 w-full" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-primary font-bold tracking-wider uppercase text-sm">Legal</span>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-white uppercase tracking-tight">Cancellation Policy</h1>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-8">Last updated: July 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">1. Tournament Cancellation by Organizer</h2>
            <p>If a tournament is cancelled by Play To Network or the organizing team:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Registered participants will receive a full refund of the registration fee.</li>
              <li>Refunds will be processed within 7-14 business days.</li>
              <li>Participants will be notified via the registered contact information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">2. Participant Cancellation</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Cancellations made 7 or more days before the tournament date: 50% refund of the registration fee.</li>
              <li>Cancellations made less than 7 days before the tournament date: No refund.</li>
              <li>Cancellations on the day of the tournament: No refund.</li>
              <li>All cancellation requests must be submitted through the official communication channels.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">3. Match Cancellation</h2>
            <p>Individual matches may be cancelled or rescheduled due to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Inclement weather or unsafe conditions</li>
              <li>Insufficient players on either team</li>
              <li>Venue unavailability</li>
              <li>Force majeure events</li>
            </ul>
            <p className="mt-2">In such cases, organizers will make reasonable efforts to reschedule the match. No refunds will be issued for individual match cancellations.</p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">4. No-Shows</h2>
            <p>Teams or players who fail to appear at the scheduled match time without prior notice will be considered a no-show. No-shows will result in:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Automatic forfeiture of the match</li>
              <li>No refund of the registration fee</li>
              <li>Possible ban from future tournaments if habitual</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">5. Disqualification</h2>
            <p>Participants disqualified due to violation of rules or code of conduct are not eligible for any refund or compensation. This includes cases of:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Fake payment proofs</li>
              <li>Cheating or match-fixing</li>
              <li>Unsportsmanlike behaviour</li>
              <li>Providing false information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">6. Changes by Organizer</h2>
            <p>Play To Network reserves the right to modify the tournament schedule, format, or venue as needed. Participants will be notified of any significant changes. Such modifications do not entitle participants to a refund unless the entire tournament is cancelled.</p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">7. Contact</h2>
            <p>For cancellation-related inquiries, please contact the tournament organizers through the official Play To Network communication channels.</p>
          </section>
        </div>
      </div>
      <PtnFooter />
    </main>
  )
}
