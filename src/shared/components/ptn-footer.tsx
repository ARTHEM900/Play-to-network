import { Globe, AtSign, Send } from "lucide-react"
import { PtnLogo } from "./ptn-logo"
import Link from "next/link"

const FOOTER_LINKS = [
  {
    title: "Platform",
    links: [
      { label: "Events", href: "/events" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Rules", href: "/rules" },
    ],
  },
]

export function PtnFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 space-y-4">
            <PtnLogo className="scale-105 origin-left" />
            
            {/* Tagline */}
            <div className="font-heading font-bold text-xs tracking-[0.2em] text-white uppercase flex items-center gap-1.5">
              PLAY <span className="text-primary">•</span> COMPETE <span className="text-primary">•</span> BELONG
            </div>

            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              The Tournament Operating System for Players, Teams and Communities.
            </p>
            <div className="mt-5 flex gap-3">
              {[Globe, AtSign, Send].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  aria-label="Social media"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Play To Network. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">Made in Delhi, India</p>
        </div>
      </div>
    </footer>
  )
}
