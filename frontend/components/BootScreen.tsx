/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from "react"

const LINES: ReadonlyArray<readonly [string, string]> = [
  ["kodex-sa core", "OK"],
  ["loading interface", "OK"],
  ["operator: ashley k motsie", "IDENTIFIED"],
  ["status", "ONLINE"],
]

const SEEN_KEY = "kodex-boot-seen"

// One-time-per-session boot overlay. Skippable (click / any key) and disabled for reduced-motion users.
export default function BootScreen() {
  const [phase, setPhase] = useState<"idle" | "boot" | "out" | "done">("idle")
  const [shown, setShown] = useState(0)

  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1"
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (seen || reduce) {
      setPhase("done")
      return
    }
    try {
      sessionStorage.setItem(SEEN_KEY, "1")
    } catch {}
    setPhase("boot")

    const timers: ReturnType<typeof setTimeout>[] = []
    LINES.forEach((_, i) => timers.push(setTimeout(() => setShown(i + 1), 250 + i * 330)))
    const finish = () => {
      setPhase("out")
      timers.push(setTimeout(() => setPhase("done"), 500))
    }
    timers.push(setTimeout(finish, 1900))

    const skip = () => finish()
    window.addEventListener("keydown", skip, { once: true })
    window.addEventListener("pointerdown", skip, { once: true })
    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener("keydown", skip)
      window.removeEventListener("pointerdown", skip)
    }
  }, [])

  if (phase === "idle" || phase === "done") return null

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-[#04070d] transition-opacity duration-500 ${
        phase === "out" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-[min(92vw,440px)] font-mono text-xs sm:text-sm">
        <div className="mb-5 text-[10px] tracking-[0.3em] text-[#00e5ff]">KODEX-SA // BOOT</div>

        <div className="space-y-1.5 min-h-[7.5rem]">
          {LINES.slice(0, shown).map(([label, status]) => (
            <div key={label} className="flex items-baseline gap-2 text-[#bfefff]">
              <span className="text-[#00e5ff]">&gt;</span>
              <span>{label}</span>
              <span className="flex-1 border-b border-dotted border-[#0b4a5c] translate-y-[-3px]" />
              <span className={status === "ONLINE" ? "text-[#00ff9c]" : "text-[#00e5ff]"}>{status}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 h-px w-full bg-[#0b2a36] overflow-hidden">
          <div
            className="h-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff] transition-[width] duration-[330ms] ease-linear"
            style={{ width: `${(shown / LINES.length) * 100}%` }}
          />
        </div>
        <div className="mt-4 text-[10px] tracking-widest text-[#0097a7]">PRESS ANY KEY TO SKIP</div>
      </div>
    </div>
  )
}
