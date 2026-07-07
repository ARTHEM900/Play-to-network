import { PtnNavbar } from "@/shared/components/ptn-navbar"
import { PtnFooter } from "@/shared/components/ptn-footer"
import { IndianRupee } from "lucide-react"

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <PtnNavbar />
      <div className="h-20 w-full" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <span className="text-primary font-bold tracking-wider uppercase text-sm">Legal</span>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-white uppercase tracking-tight">Refund Policy</h1>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-8">Last updated: July 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">1. Registration Fees</h2>
            <p>All tournament registration fees are non-refundable once the registration is submitted and payment is processed, except as explicitly stated in this policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">2. Tournament Cancellation by Organizer</h2>
            <p>If a tournament is cancelled by the organizer before the start date, registered participants will receive a full refund of the registration fee within 7-14 business days.</p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">3. Participant Withdrawal</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Withdrawal requests made 7 or more days before the tournament: 50% refund.</li>
              <li>Withdrawal requests made less than 7 days before the tournament: No refund.</li>
              <li>No-shows on the day of the tournament are not eligible for any refund.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">4. Disqualification</h2>
            <p>Participants disqualified due to fake payment proofs, rule violations, or code of conduct breaches are not entitled to any refund. This includes but is not limited to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Submission of manipulated or fraudulent payment screenshots</li>
              <li>Providing false information during registration</li>
              <li>Violation of tournament rules or code of conduct</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">5. Refund Processing</h2>
            <p>Approved refunds will be processed to the original payment method within 7-14 business days. Play To Network is not responsible for delays caused by payment intermediaries.</p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">6. Disputes</h2>
            <p>Any refund disputes must be raised within 7 days of the tournament date. Decisions regarding refunds are at the sole discretion of Play To Network and the tournament organizers.</p>
          </section>
        </div>
      </div>
      <PtnFooter />
    </main>
  )
}
