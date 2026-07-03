"use client"

import { useEffect, useState, useCallback } from "react"
import { PtnLogo } from "./ptn-logo"

const taglineItems = [
  { word: "PLAY", delay: "1.0s" },
  { word: "•", delay: "1.6s", dot: true },
  { word: "COMPETE", delay: "1.6s" },
  { word: "•", delay: "2.2s", dot: true },
  { word: "BELONG", delay: "2.2s" },
]

export function CinematicLoader() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  const handleAnimationEnd = useCallback((e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.animationName === "loaderFadeOut") {
      setVisible(false)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className="cinematic-loader fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] overflow-hidden select-none"
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-60 blur-3xl"></div>

      <div className="flex flex-col items-center gap-10 relative z-10">
        <div className="cinematic-logo" style={{ "--delay": "0.3s" } as React.CSSProperties}>
          <PtnLogo className="scale-125 sm:scale-150" />
        </div>

        <div className="flex items-center gap-3 font-heading font-bold text-sm sm:text-base tracking-[0.25em] uppercase">
          {taglineItems.map((item) => (
            <span
              key={item.word}
              className={`cinematic-word ${item.dot ? "text-primary font-black" : "text-white"}`}
              style={{ "--word-delay": item.delay } as React.CSSProperties}
            >
              {item.word}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .cinematic-loader {
          animation: loaderFadeOut 0.6s ease-in-out 3.2s forwards;
        }
        .cinematic-logo {
          opacity: 0;
          transform: scale(0.95);
          animation: logoFadeIn 0.6s ease-out var(--delay) forwards;
        }
        .cinematic-word {
          opacity: 0;
          transform: translateY(5px);
          animation: wordFadeIn 0.4s ease-out var(--word-delay) forwards;
        }
        @keyframes loaderFadeOut {
          to { opacity: 0; }
        }
        @keyframes logoFadeIn {
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes wordFadeIn {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
