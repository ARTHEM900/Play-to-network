import { PtnNavbar } from "@/shared/components/ptn-navbar"
import { PtnFooter } from "@/shared/components/ptn-footer"
import { Trophy, Users, Target, Shield } from "lucide-react"

const VALUES = [
  {
    icon: Trophy,
    title: "Competition",
    desc: "We believe in the power of healthy competition to bring out the best in every player.",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Building a network of players, teams, and organizers who share a passion for sports.",
  },
  {
    icon: Target,
    title: "Excellence",
    desc: "Pushing for the highest standards in tournament organization and player experience.",
  },
  {
    icon: Shield,
    title: "Integrity",
    desc: "Fair play, transparency, and respect are at the core of everything we do.",
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <PtnNavbar />
      <div className="h-20 w-full" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-wider uppercase text-sm">About Us</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-heading font-black text-white uppercase tracking-tight">
            Compete. Connect. Conquer.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Play To Network is Delhi&apos;s fastest growing amateur sports community. We organize tournaments, 
            connect players, and provide a platform for competitive sports across football, cricket, badminton, 
            basketball, volleyball, and esports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="rounded-xl border border-border bg-card p-8">
            <h2 className="text-2xl font-heading font-bold text-white uppercase tracking-tight mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To make amateur sports accessible, organized, and competitive for everyone in India. 
              We provide the infrastructure for players to find teams, tournaments to find participants, 
              and communities to thrive.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-8">
            <h2 className="text-2xl font-heading font-bold text-white uppercase tracking-tight mb-4">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed">
              Founded in Delhi, Play To Network started with a simple idea: bring amateur athletes together 
              on a single platform. What began as small local tournaments has grown into a thriving community 
              of players, teams, and organizers.
            </p>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-white uppercase tracking-tight">Our Values</h2>
          <p className="mt-2 text-muted-foreground">What drives us every day.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {VALUES.map((val) => {
            const Icon = val.icon
            return (
              <div key={val.title} className="rounded-xl border border-border bg-card p-6 text-center">
                <div className="mx-auto mb-4 w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-primary">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{val.title}</h3>
                <p className="text-sm text-muted-foreground">{val.desc}</p>
              </div>
            )
          })}
        </div>

        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <h2 className="text-2xl font-heading font-bold text-white uppercase tracking-tight mb-4">Get In Touch</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Want to partner with us, organize a tournament, or just say hello? Reach out to us on our social channels or at our events.
          </p>
        </div>
      </div>
      <PtnFooter />
    </main>
  )
}
