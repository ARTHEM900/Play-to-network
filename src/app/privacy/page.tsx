import { PtnNavbar } from "@/shared/components/ptn-navbar"
import { PtnFooter } from "@/shared/components/ptn-footer"
import { Shield } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <PtnNavbar />
      <div className="h-20 w-full" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-primary font-bold tracking-wider uppercase text-sm">Legal</span>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-white uppercase tracking-tight">Privacy Policy</h1>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-8">Last updated: July 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">1. Information We Collect</h2>
            <p>When you register for an account or tournament on Play To Network, we collect:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Full name and email address (via Google OAuth)</li>
              <li>Phone number provided during registration</li>
              <li>Team and player details submitted during tournament registration</li>
              <li>Payment transaction screenshots uploaded for verification</li>
              <li>Communication records with our support team</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">2. How We Use Your Information</h2>
            <p>Your data is used exclusively for:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Processing tournament registrations and payments</li>
              <li>Verifying team and player details</li>
              <li>Communicating tournament updates, schedules, and results</li>
              <li>Improving our platform and user experience</li>
              <li>Preventing fraudulent registrations and duplicate entries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">3. Data Sharing</h2>
            <p>We do not sell, rent, or share your personal data with third parties for their marketing purposes. Data may be shared with:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Tournament organizers for match scheduling and coordination</li>
              <li>Payment processors for transaction verification</li>
              <li>Legal authorities if required by applicable law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">4. Data Retention</h2>
            <p>We retain your registration data for the duration of the tournament and up to 12 months thereafter for record-keeping and dispute resolution. Account data is retained until you request deletion.</p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (subject to legal obligations)</li>
              <li>Withdraw consent for data processing where applicable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">6. Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your data, including encryption in transit and at rest, access controls, and regular security audits.</p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-3">7. Contact</h2>
            <p>For privacy-related inquiries, please contact us through our social channels or reach out to the organizing team directly at our events.</p>
          </section>
        </div>
      </div>
      <PtnFooter />
    </main>
  )
}
