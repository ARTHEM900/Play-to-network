import { PtnNavbar } from "@/shared/components/ptn-navbar"
import { PtnFooter } from "@/shared/components/ptn-footer"
import { FileText } from "lucide-react"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <PtnNavbar />
      <div className="h-20 w-full" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-primary font-bold tracking-wider uppercase text-sm">Legal</span>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-white uppercase tracking-tight">Terms &amp; Conditions</h1>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-8">Last updated: July 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using Play To Network, you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use our platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">2. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. All activities under your account are your responsibility. You must provide accurate and complete information during registration.</p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">3. Tournament Registration</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>All registration information must be accurate and truthful.</li>
              <li>Payment must be completed as per the instructions provided.</li>
              <li>Fake or manipulated payment proofs will result in immediate disqualification without refund.</li>
              <li>Play To Network reserves the right to reject or cancel any registration at its sole discretion.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">4. Code of Conduct</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Treat fellow players, organizers, and officials with respect.</li>
              <li>Unsportsmanlike behaviour, abuse, or harassment will not be tolerated.</li>
              <li>Follow all tournament rules and instructions from organizers.</li>
              <li>Any form of cheating, match-fixing, or collusion is strictly prohibited.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">5. Intellectual Property</h2>
            <p>All content on Play To Network, including logos, trademarks, and branding, is the property of Play To Network. You may not use, reproduce, or distribute our content without prior written permission.</p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">6. Limitation of Liability</h2>
            <p>Play To Network is not liable for any injuries, losses, or damages incurred during tournament participation. Participants compete at their own risk. Organizer decisions regarding tournament operations are final and binding.</p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">7. Modifications</h2>
            <p>We reserve the right to modify these terms at any time. Users will be notified of material changes. Continued use of the platform after changes constitute acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">8. Governing Law</h2>
            <p>These terms are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Delhi, India.</p>
          </section>
        </div>
      </div>
      <PtnFooter />
    </main>
  )
}
