import { cn } from "@/shared/utils/utils"

type PtnLogoProps = {
  className?: string
  /** Show only the shield mark without the wordmark */
  markOnly?: boolean
}

/**
 * PTN brand mark: reconstructed to use "PLAY to Network" custom branding typography.
 */
export function PtnLogo({ className, markOnly = false }: PtnLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <PtnMark className="h-6 w-6 shrink-0" />
      {!markOnly && (
        <span className="flex items-baseline font-heading tracking-normal">
          <span className="text-lg md:text-xl font-black logo-serif-text tracking-tighter">
            PLAY
          </span>
          <span className="text-[9px] font-bold logo-sans-text mx-1 tracking-tighter opacity-90 relative top-[-1px]">
            TO
          </span>
          <span className="text-xl md:text-2xl logo-script-text tracking-normal -ml-0.5 relative top-[1px]">
            Network
          </span>
        </span>
      )}
    </span>
  )
}

export function PtnMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("filter drop-shadow-[0_0_6px_rgba(0,230,118,0.6)]", className)}
      role="img"
      aria-label="Play To Network shield logo"
    >
      {/* Shield body */}
      <path
        d="M24 3.5 6 10.5v12.7c0 11 7.6 18.4 18 21.3 10.4-2.9 18-10.3 18-21.3V10.5L24 3.5Z"
        className="fill-primary/5 stroke-primary"
        strokeWidth={3}
        strokeLinejoin="round"
      />
      {/* Network connections */}
      <g className="stroke-primary" strokeWidth={2.5} strokeLinecap="round">
        <line x1="16" y1="16" x2="24" y2="24" />
        <line x1="24" y1="24" x2="32" y2="15" />
        <line x1="24" y1="24" x2="18" y2="33" />
        <line x1="24" y1="24" x2="31" y2="31" />
      </g>
      {/* Network nodes */}
      <g className="fill-primary">
        <circle cx="16" cy="16" r="3.2" />
        <circle cx="32" cy="15" r="2.6" />
        <circle cx="18" cy="33" r="2.6" />
        <circle cx="31" cy="31" r="2.6" />
      </g>
      {/* Central hub node */}
      <circle
        cx="24"
        cy="24"
        r="4.2"
        className="fill-black stroke-primary"
        strokeWidth={2.5}
      />
    </svg>
  )
}
