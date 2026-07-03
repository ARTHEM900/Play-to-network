import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/shared/components/ui/button"

export function FinalCta() {
  return (
    <section className="relative w-full px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-border">
        <Image
          src="/live-match.png"
          alt="Players competing under floodlights"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/30" />

        <div className="relative px-6 py-16 sm:px-12 sm:py-24 lg:px-16">
          <h2 className="max-w-2xl font-heading text-4xl font-bold uppercase leading-[0.95] tracking-tight text-balance text-foreground sm:text-6xl">
            Your Arena <span className="text-primary">Awaits</span>
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground text-pretty">
            Thousands of players. Hundreds of teams. One community. Step onto the
            pitch and make your mark in Delhi&apos;s amateur sports scene.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 bg-primary px-6 text-base font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Get Started Free
              <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-border bg-secondary/40 px-6 text-base font-semibold text-foreground backdrop-blur hover:bg-secondary"
            >
              Browse Tournaments
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
