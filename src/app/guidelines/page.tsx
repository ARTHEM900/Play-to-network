import { PtnNavbar } from "@/shared/components/ptn-navbar"
import { PtnFooter } from "@/shared/components/ptn-footer"
import { Heart } from "lucide-react"

export default function CommunityGuidelinesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <PtnNavbar />
      <div className="h-20 w-full" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <span className="text-primary font-bold tracking-wider uppercase text-sm">Community</span>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-white uppercase tracking-tight">Community Guidelines</h1>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-8">Last updated: July 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">1. Respect Everyone</h2>
            <p>Treat all members of the Play To Network community with respect and dignity. Discrimination, harassment, or hate speech of any kind will not be tolerated. We are committed to providing a safe and inclusive environment for all participants.</p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">2. Fair Play</h2>
            <p>Compete with integrity. Cheating, match-fixing, collusion, or any form of unfair advantage is strictly prohibited. Play To Network promotes honest competition where skill and sportsmanship determine the outcome.</p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">3. Communication</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Use respectful language in all communications with organizers, officials, and fellow players.</li>
              <li>Follow official communication channels for tournament updates and announcements.</li>
              <li>Do not spam, impersonate others, or share misleading information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">4. Sportsmanship</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Win with humility and lose with grace.</li>
              <li>Congratulate opponents regardless of the outcome.</li>
              <li>Respect the decisions of match officials and organizers.</li>
              <li>Encourage and uplift fellow players in your team and across the community.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">5. Reporting Violations</h2>
            <p>If you witness or experience any violation of these guidelines, please report it to the tournament organizers immediately. All reports will be taken seriously and investigated promptly.</p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">6. Consequences</h2>
            <p>Violation of community guidelines may result in:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Verbal or written warning</li>
              <li>Temporary suspension from tournaments</li>
              <li>Permanent ban from the Play To Network platform</li>
              <li>Disqualification from current tournament without refund</li>
            </ul>
          </section>
        </div>
      </div>
      <PtnFooter />
    </main>
  )
}
