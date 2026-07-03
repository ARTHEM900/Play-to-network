import { UserPlus, Users, ClipboardCheck, Swords } from "lucide-react"

const STEPS = [
  {
    icon: UserPlus,
    title: "Create Account",
    desc: "Sign up in seconds and set up your athlete profile.",
  },
  {
    icon: Users,
    title: "Create Team",
    desc: "Build your squad and invite your teammates to join.",
  },
  {
    icon: ClipboardCheck,
    title: "Register",
    desc: "Pick a tournament and lock in your team's spot.",
  },
  {
    icon: Swords,
    title: "Compete",
    desc: "Take the field, win matches, and climb the rankings.",
  },
]

export function HowItWorks() {
  return (
    <section className="relative w-full py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Get Started
          </span>
          <h2 className="mt-2 font-heading text-4xl font-bold uppercase tracking-tight text-balance text-foreground sm:text-5xl">
            How It Works
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-border bg-card p-6"
            >
              <span className="font-heading text-5xl font-bold text-secondary">
                0{i + 1}
              </span>
              <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-heading text-xl font-bold uppercase text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
